# Enhanced File Explorer - Visual Guide

## 🎯 Feature Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─ Open Workspace ──────────────────────────┐
                   │                                            │
                   ├─ Expand/Collapse Folders ─────────────────┤
                   │                                            │
                   ├─ Right-Click Context Menu ────────────────┤
                   │                                            │
                   ├─ Select & Edit File ──────────────────────┤
                   │                                            │
                   └─ Run Code ────────────────────────────────┤
                                                                │
                                                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  FileExplorer    │  │  CodeEditor      │  │  ContextMenu     │  │
│  │  ──────────────  │  │  ──────────────  │  │  ──────────────  │  │
│  │  • Tree State    │  │  • Editor State  │  │  • Menu Actions  │  │
│  │  • Expand/       │  │  • Run Button    │  │  • New File      │  │
│  │    Collapse      │  │  • Output Panel  │  │  • New Folder    │  │
│  │  • Selection     │  │  • Auto-save     │  │  • Rename        │  │
│  │                  │  │                  │  │  • Delete        │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                     │             │
│           └─────────────────────┼─────────────────────┘             │
│                                 │                                   │
│  ┌─────────────────────────────┴─────────────────────────────┐     │
│  │            UTILITIES & HELPERS                             │     │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐   │     │
│  │  │ fileIcons  │  │ codeExecutor │  │ tauriCommands   │   │     │
│  │  └────────────┘  └──────────────┘  └─────────────────┘   │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │ Tauri IPC
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Rust/Tauri)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐  ┌──────────────────────┐                │
│  │  File Operations     │  │  Code Execution      │                │
│  │  ────────────────    │  │  ────────────────    │                │
│  │  read_dir_recursive  │  │  execute_code        │                │
│  │  create_file         │  │                      │                │
│  │  create_folder       │  │  • Command parsing   │                │
│  │  delete_path         │  │  • Working dir       │                │
│  │  rename_path         │  │  • Output capture    │                │
│  │  read_file_content   │  │  • Exit code         │                │
│  │  write_file_content  │  │                      │                │
│  └──────────┬───────────┘  └──────────┬───────────┘                │
│             │                          │                            │
│             └──────────────┬───────────┘                            │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │  FILE SYSTEM       │
                    │  ──────────────    │
                    │  • Directories     │
                    │  • Files           │
                    │  • Permissions     │
                    └────────────────────┘
```

## 🔄 Component Interaction Flow

### 1. Opening Workspace

```
User clicks "Select Root Directory"
    ↓
FileExplorer.handleOpenFolder()
    ↓
Tauri dialog.open()
    ↓
setWorkspaceRoot(path)
    ↓
loadFolderTree()
    ↓
tauriCommands.readDirRecursive(path)
    ↓
Backend: read_dir_recursive()
    ↓
Recursively scan directory
    ↓
Return FileEntry tree
    ↓
setTree(treeData)
    ↓
Render FileTreeNode components
```

### 2. File Tree Rendering

```
FileTreeNode (root)
    │
    ├─ Check if expanded (Set.has(path))
    │
    ├─ Render folder icon + name
    │
    └─ If expanded && hasChildren:
         │
         ├─ Render children container
         │
         └─ Map each child to FileTreeNode
              │
              └─ Recursively render children
```

### 3. Creating a File

```
Right-click folder
    ↓
Show ContextMenu
    ↓
User clicks "New File"
    ↓
Prompt for filename
    ↓
handleContextAction('new-file')
    ↓
tauriCommands.createFile(path, content)
    ↓
Backend: create_file()
    ↓
fs::write(path, content)
    ↓
Success
    ↓
loadFolderTree() (refresh)
    ↓
Tree updates with new file
```

### 4. Executing Code

```
User clicks Run button
    ↓
CodeEditor.handleRun()
    ↓
Save file first
    ↓
codeExecutor.executeCode(filePath, language, workingDir)
    ↓
Determine command based on language
    ↓
tauriCommands.executeCode(command, workingDir)
    ↓
Backend: execute_code()
    ↓
std::process::Command::new(program).args(args)
    ↓
Capture stdout, stderr, exit_code
    ↓
Return ExecutionResult
    ↓
Display in output panel
```

## 📊 State Management

### FileExplorer State

```javascript
{
  tree: FileEntry,              // Complete directory tree
  expandedFolders: Set<string>, // Paths of expanded folders
  selectedPath: string,          // Currently selected file/folder
  contextMenu: {                 // Right-click menu state
    x: number,
    y: number,
    item: FileEntry
  },
  refreshKey: number             // Trigger for re-fetching tree
}
```

### CodeEditor State

```javascript
{
  code: string,           // Editor content
  language: string,       // Selected language
  output: string,         // Execution output
  isRunning: boolean,     // Execution in progress
  agentCount: number,     // MOA agents (existing feature)
  systemPrompt: string,   // AI prompt (existing feature)
  // ... other existing state
}
```

## 🎨 UI Component Tree

```
App
└── Main Layout
    ├── Sidebar
    ├── TopBar
    └── Content Area
        ├── FileExplorer
        │   ├── Toolbar
        │   │   ├── Path Display
        │   │   ├── Refresh Button
        │   │   └── Open Folder Button
        │   └── File Tree
        │       └── FileTreeNode (recursive)
        │           ├── Chevron Icon
        │           ├── File/Folder Icon
        │           ├── Label
        │           └── Children (FileTreeNode[])
        │
        ├── CodeEditor
        │   ├── Toolbar
        │   │   ├── Language Selector
        │   │   ├── MOA Selector
        │   │   ├── Run Button ⭐ NEW
        │   │   ├── Save Button
        │   │   └── Copy Button
        │   ├── Editor Panel
        │   └── Output Panel ⭐ NEW
        │       ├── Header (Terminal icon + Close)
        │       └── Content (stdout/stderr)
        │
        └── ContextMenu (conditional) ⭐ NEW
            └── Menu Items
                ├── New File
                ├── New Folder
                ├── Rename
                ├── Delete
                └── Copy Path
```

## 🗂️ File Type Icon Mapping

```
JavaScript (.js)       → SiJavascript  (⚡ yellow)
React (.jsx, .tsx)     → SiReact       (⚛️ blue)
TypeScript (.ts)       → SiTypescript  (🔷 blue)
Python (.py)           → SiPython      (🐍 yellow/blue)
Rust (.rs)             → SiRust        (⚙️ orange)
HTML (.html)           → SiHtml5       (🌐 orange)
CSS (.css)             → SiCss3        (🎨 blue)
JSON (.json)           → SiJson        (📋 yellow)
Markdown (.md)         → SiMarkdown    (📝 white)
C++ (.cpp, .h)         → SiCplusplus   (🔧 blue)
Go (.go)               → SiGo          (🔵 cyan)
Others                 → FiFile        (📄 generic)
Folders                → FiFolder      (📁 gold)
```

## 🎯 Language Execution Commands

```
JavaScript (.js)   →  node "file.js"
Python (.py)       →  python "file.py"
Rust (.rs)         →  rustc "file.rs" -o "file" && "./file"
Java (.java)       →  javac "file.java" && java ClassName
Go (.go)           →  go run "file.go"
C++ (.cpp)         →  g++ "file.cpp" -o "file" && "./file"
```

## 📈 Performance Characteristics

- **Tree Loading**: O(n) where n = number of files/folders
- **Tree Rendering**: O(v) where v = visible nodes (collapsed nodes not rendered)
- **File Operations**: O(1) + filesystem operation time
- **Code Execution**: Depends on executed program
- **Memory**: Tree held in memory, ~100 bytes per node

## 🔧 Extension Points

Future developers can extend:

1. **Add new file types**:
   - Update `fileIcons.js` icon mapping
   - Add icon import from react-icons

2. **Add new languages**:
   - Update `codeExecutor.js` command mapping
   - Add language to editor dropdown

3. **Add new file operations**:
   - Add backend Tauri command in `main.rs`
   - Add frontend wrapper in `tauriCommands.js`
   - Add UI in `ContextMenu.jsx`

4. **Custom execution commands**:
   - Modify `codeExecutor.js` to read from config
   - Add UI for command configuration
