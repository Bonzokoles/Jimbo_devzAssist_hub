# Component Integration Map

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      JIMBO DEVASSIST HUB                         │
│                     Main Application (App.jsx)                   │
└──────────────────┬───────────────────┬──────────────────────────┘
                   │                   │
       ┌───────────┴──────┐  ┌────────┴────────┐
       │                  │  │                 │
       ▼                  ▼  ▼                 ▼
  ┌─────────┐      ┌──────────────┐     ┌──────────┐
  │Dashboard│      │Code Editor   │     │Terminal  │
  └─────────┘      │              │     │          │
                   │ ┌──────────┐ │     └────┬─────┘
                   │ │ Monaco   │ │          │
                   │ │ Editor   │ │          │
                   │ └──────────┘ │          │
                   │              │          ▼
                   │ ┌──────────┐ │   ┌────────────────┐
                   │ │ MOA      │ │   │TerminalEmulator│
                   │ │ Agents   │ │   │                │
                   │ └──────────┘ │   │ ┌────────────┐ │
                   │              │   │ │  xterm.js  │ │
                   │ ┌──────────┐ │   │ └────────────┘ │
                   │ │ AI Edit  │ │   │                │
                   │ │ Handler  │ │   │ [Tab Manager]  │
                   │ └────┬─────┘ │   └───────┬────────┘
                   │      │       │           │
                   │      │       │           │
                   │      ▼       │           ▼
                   │ ┌──────────┐ │   ┌────────────────┐
                   │ │DiffViewer│ │   │executeCommand()│
                   │ │(Overlay) │ │   │   (JS Utils)   │
                   │ │          │ │   └───────┬────────┘
                   │ │Split View│ │           │
                   │ │Unified   │ │           │
                   │ │Accept/   │ │           ▼
                   │ │Reject    │ │   ┌────────────────┐
                   │ └──────────┘ │   │  Tauri IPC     │
                   └──────────────┘   └───────┬────────┘
                                              │
                                              ▼
                                      ┌────────────────┐
                                      │  Rust Backend  │
                                      │   (main.rs)    │
                                      │                │
                                      │ execute_command│
                                      │ ↓              │
                                      │ Validate Dir   │
                                      │ ↓              │
                                      │ Run Shell Cmd  │
                                      │ ↓              │
                                      │ Return Result  │
                                      └────────────────┘
```

## Data Flow

### Diff Viewer Flow

```
User Code
   ↓
AI Assistant Suggests Changes
   ↓
handleAIEdit(newCode) called in CodeEditor
   ↓
setPendingCode(newCode)
setShowDiff(true)
   ↓
DiffViewer renders as overlay
   ↓
diffLines(oldCode, newCode) calculates differences
   ↓
Renders DiffLine components for each change
   ↓
User reviews changes
   ↓
User clicks Accept All / Reject All / Accept Selected
   ↓
onAccept(newCode) or onReject() callback
   ↓
Code updated or changes discarded
```

### Terminal Emulator Flow

```
User Types Command
   ↓
xterm.js onData event
   ↓
Command Buffer Updated
   ↓
User Presses Enter
   ↓
executeTerminalCommand() called
   ↓
executeCommand(cmd, workingDir) - JS Utils
   ↓
invoke('execute_command', {command, workingDir}) - Tauri IPC
   ↓
execute_command(command, working_dir) - Rust
   ↓
Validate working_dir exists
   ↓
Execute via System Shell (cmd.exe or sh)
   ↓
Capture stdout, stderr, exit_code
   ↓
Return ExecutionResult to Frontend
   ↓
Write output to xterm.js terminal
   ↓
Display with color coding
```

## Key Integration Points

### 1. CodeEditor ↔ DiffViewer

**File:** `src/components/CodeEditor.jsx`

```javascript
// State
const [showDiff, setShowDiff] = useState(false);
const [pendingCode, setPendingCode] = useState(null);

// Handler for AI edits
const handleAIEdit = async (aiSuggestion) => {
  setPendingCode(aiSuggestion);
  setShowDiff(true);
};

// Accept/Reject handlers
const handleAcceptDiff = (newCode) => {
  setCode(newCode);
  setCurrentFileContent(newCode);
  setShowDiff(false);
  setPendingCode(null);
};

const handleRejectDiff = () => {
  setShowDiff(false);
  setPendingCode(null);
};

// Render DiffViewer
{showDiff && (
  <div className="diff-overlay">
    <DiffViewer
      oldCode={code}
      newCode={pendingCode}
      language={language}
      onAccept={handleAcceptDiff}
      onReject={handleRejectDiff}
    />
  </div>
)}
```

### 2. Terminal ↔ TerminalEmulator

**File:** `src/components/Terminal.jsx`

```javascript
import TerminalEmulator from './TerminalEmulator';

const Terminal = () => {
  return <TerminalEmulator />;
};
```

### 3. TerminalEmulator ↔ Tauri Backend

**Frontend:** `src/components/TerminalEmulator.jsx`

```javascript
import { executeCommand } from '../utils/tauriCommands';

const executeTerminalCommand = async (term, command, terminalId) => {
  try {
    const workingDir = workspaceRoot || '/';
    const result = await executeCommand(command, workingDir);
    
    // Display stdout
    if (result.stdout) {
      term.write(result.stdout.replace(/\n/g, '\r\n'));
    }
    
    // Display stderr in red
    if (result.stderr) {
      term.write(`\x1b[31m${result.stderr}\x1b[0m\r\n`);
    }
    
    // Display exit code if non-zero
    if (result.exit_code !== 0) {
      term.write(`\x1b[31mExit code: ${result.exit_code}\x1b[0m\r\n`);
    }
  } catch (error) {
    term.write(`\x1b[31mError: ${error.message}\x1b[0m\r\n`);
  }
};
```

**Utils:** `src/utils/tauriCommands.js`

```javascript
import { invoke } from '@tauri-apps/api/tauri';

export const executeCommand = async (command, workingDir) => {
  try {
    return await invoke('execute_command', { command, workingDir });
  } catch (error) {
    console.error('Failed to execute command:', error);
    throw error;
  }
};
```

**Backend:** `src-tauri/src/main.rs`

```rust
#[derive(Debug, Serialize, Deserialize)]
struct ExecutionResult {
    stdout: String,
    stderr: String,
    exit_code: i32,
}

#[tauri::command]
async fn execute_command(command: String, working_dir: String) 
    -> Result<ExecutionResult, String> {
    
    // Validate working directory
    let work_path = Path::new(&working_dir);
    if !work_path.exists() || !work_path.is_dir() {
        return Err(format!("Invalid working directory: {}", working_dir));
    }
    
    // Execute command
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", &command])
            .current_dir(&working_dir)
            .output()
    } else {
        Command::new("sh")
            .arg("-c")
            .arg(&command)
            .current_dir(&working_dir)
            .output()
    };
    
    // Return result
    match output {
        Ok(output) => Ok(ExecutionResult {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            exit_code: output.status.code().unwrap_or(-1),
        }),
        Err(e) => Err(format!("Failed to execute: {}", e)),
    }
}

// Register in invoke_handler
.invoke_handler(tauri::generate_handler![
    // ... other commands ...
    execute_command,
])
```

## Component Dependencies

```
DiffViewer.jsx
├── React (hooks: useState)
├── diff (diffLines)
├── react-syntax-highlighter
├── react-icons (FiCheck, FiX)
└── DiffLine.jsx
    └── react-syntax-highlighter

TerminalEmulator.jsx
├── React (hooks: useState, useEffect, useRef)
├── xterm (Terminal)
├── xterm-addon-fit (FitAddon)
├── xterm-addon-web-links (WebLinksAddon)
├── react-icons (FiTerminal, FiX, FiPlus, FiSend)
├── tauriCommands (executeCommand)
│   └── @tauri-apps/api (invoke)
│       └── Rust execute_command
└── useStore (Zustand)
    └── workspaceRoot
```

## State Management

### DiffViewer State

```javascript
const [selectedChanges, setSelectedChanges] = useState(new Set());
const [viewMode, setViewMode] = useState('split'); // or 'unified'
```

**Parent (CodeEditor) State:**
```javascript
const [showDiff, setShowDiff] = useState(false);
const [pendingCode, setPendingCode] = useState(null);
```

### TerminalEmulator State

```javascript
const [terminals, setTerminals] = useState([
  { id: 1, name: 'Terminal 1', instance: null, history: [] }
]);
const [activeTerminal, setActiveTerminal] = useState(1);
```

**Refs:**
```javascript
const terminalRefs = useRef({});        // Terminal instances
const containerRefs = useRef({});       // DOM containers
const commandBuffers = useRef({});      // Input buffers
const fitAddons = useRef({});           // Resize addons
const cleanupFunctions = useRef({});    // Cleanup handlers
```

## Event Handlers

### DiffViewer

- `toggleChange(id)` - Toggle line selection
- `handleAcceptAll()` - Accept all changes
- `handleRejectAll()` - Reject all changes
- `handleAcceptSelected()` - Accept selected changes
- `setViewMode('split'|'unified')` - Change view mode

### TerminalEmulator

- `initTerminal(terminalId)` - Initialize xterm.js instance
- `executeTerminalCommand(term, command, terminalId)` - Execute command
- `addTerminal()` - Create new terminal tab
- `closeTerminal(id)` - Remove terminal tab
- `clearTerminal()` - Clear current terminal
- `sendToAI()` - Send history to AI assistant

### xterm.js Input Handling

- `\r` (Enter) - Execute command
- `\u007F` (Backspace) - Delete character
- `\u0003` (Ctrl+C) - Cancel input
- `\u000C` (Ctrl+L) - Clear screen
- Printable chars - Add to buffer

## CSS Classes

### DiffViewer

- `.diff-viewer` - Main container
- `.diff-toolbar` - Top toolbar
- `.diff-split-view` - Side-by-side layout
- `.diff-unified-view` - Inline layout
- `.diff-line` - Individual line
- `.diff-added` - Added line (green)
- `.diff-removed` - Removed line (red)
- `.diff-unchanged` - Unchanged line
- `.diff-footer` - Bottom actions

### TerminalEmulator

- `.terminal-emulator` - Main container
- `.terminal-header` - Top bar with tabs
- `.terminal-tabs` - Tab container
- `.terminal-tab` - Individual tab
- `.terminal-tab.active` - Active tab
- `.terminal-content` - Terminal area
- `.terminal-container` - xterm.js container
- `.terminal-actions` - Action buttons

## Utility Classes (Added)

- `.cyan-text` - Cyan colored text
- `.pink-text` - Pink colored text

Both use cyberpunk color scheme:
```css
.cyan-text {
  color: var(--neon-cyan); /* #00f0ff */
}

.pink-text {
  color: var(--neon-pink); /* #ff006e */
}
```
