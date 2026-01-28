# Testing Guide - Enhanced File Explorer

## 🧪 Prerequisites

Before testing, ensure:
- Node.js and npm are installed
- Rust and Cargo are installed
- Tauri CLI is available
- System dependencies for Tauri are installed (webkit2gtk, etc.)

## 📦 Setup

```bash
# Install npm dependencies
npm install

# Build the application
npm run tauri:build

# Or run in development mode
npm run tauri:dev
```

## ✅ Test Cases

### Test Suite 1: File Tree Display

#### TC-1.1: Open Workspace
**Steps:**
1. Launch the application
2. Navigate to File Explorer
3. Click "Select Root Directory"
4. Choose a folder with nested structure (e.g., a React project)

**Expected:**
- Folder picker dialog appears
- After selection, full directory tree loads
- Root folder is expanded by default
- Folders appear first, then files (alphabetically)

**Verification:**
- [ ] Tree displays complete hierarchy
- [ ] Icons are appropriate for file types
- [ ] Indentation shows nesting levels correctly

#### TC-1.2: Expand/Collapse Folders
**Steps:**
1. With workspace open, click on a collapsed folder
2. Click on an expanded folder

**Expected:**
- Click on collapsed folder → chevron rotates, children appear
- Click on expanded folder → chevron rotates back, children hide

**Verification:**
- [ ] Chevron icon changes (right → down)
- [ ] Children render/hide smoothly
- [ ] Nested folders can be expanded independently

#### TC-1.3: File Selection
**Steps:**
1. Click on a file in the tree

**Expected:**
- File opens in CodeEditor
- Selected file is highlighted in tree
- File content loads correctly

**Verification:**
- [ ] File is highlighted with border/background
- [ ] Content appears in editor
- [ ] File path shows in editor toolbar

### Test Suite 2: File Operations

#### TC-2.1: Create New File
**Steps:**
1. Right-click on a folder
2. Select "New File"
3. Enter filename "test.js"
4. Click OK

**Expected:**
- Prompt appears for filename
- File is created in selected folder
- Tree refreshes showing new file
- New file appears in sorted position

**Verification:**
- [ ] File exists on disk
- [ ] File appears in tree
- [ ] File is in correct alphabetical position

#### TC-2.2: Create New Folder
**Steps:**
1. Right-click on a folder
2. Select "New Folder"
3. Enter name "new-folder"
4. Click OK

**Expected:**
- Prompt appears for folder name
- Folder is created
- Tree refreshes
- New folder appears at top (folders first)

**Verification:**
- [ ] Folder exists on disk
- [ ] Folder appears in tree
- [ ] Folder icon is displayed

#### TC-2.3: Rename File
**Steps:**
1. Right-click on a file
2. Select "Rename"
3. Enter new name "renamed.js"
4. Click OK

**Expected:**
- Prompt shows current name as default
- File is renamed on disk
- Tree refreshes with new name
- File stays in correct sorted position

**Verification:**
- [ ] Old filename doesn't exist
- [ ] New filename exists on disk
- [ ] Tree shows new name

#### TC-2.4: Rename Folder
**Steps:**
1. Right-click on a folder
2. Select "Rename"
3. Enter new name
4. Click OK

**Expected:**
- Folder is renamed
- Tree refreshes
- Children are preserved

**Verification:**
- [ ] Folder renamed on disk
- [ ] Children still accessible
- [ ] Expanded state preserved

#### TC-2.5: Delete File
**Steps:**
1. Right-click on a file
2. Select "Delete"
3. Confirm deletion

**Expected:**
- Confirmation dialog appears
- File is deleted from disk
- Tree refreshes without the file

**Verification:**
- [ ] File removed from disk
- [ ] File not in tree
- [ ] No errors shown

#### TC-2.6: Delete Folder
**Steps:**
1. Right-click on a folder with contents
2. Select "Delete"
3. Confirm deletion

**Expected:**
- Confirmation mentions "and all its contents"
- Folder and all children deleted
- Tree refreshes

**Verification:**
- [ ] Folder removed from disk
- [ ] All children removed
- [ ] Tree updated correctly

#### TC-2.7: Copy Path
**Steps:**
1. Right-click on a file
2. Select "Copy Path"
3. Paste (Ctrl+V) into a text editor

**Expected:**
- Full file path copied to clipboard
- No visual feedback needed

**Verification:**
- [ ] Correct full path in clipboard
- [ ] Path is absolute

### Test Suite 3: Code Execution

#### TC-3.1: Execute JavaScript
**Steps:**
1. Create/open a .js file with:
   ```javascript
   console.log("Hello from JavaScript!");
   console.log("2 + 2 =", 2 + 2);
   ```
2. Click Run button (▶️)

**Expected:**
- File is saved automatically
- Output panel appears at bottom
- Shows "Running..." briefly
- Displays output
- Shows exit code 0

**Verification:**
- [ ] Output shows: "Hello from JavaScript!" and "2 + 2 = 4"
- [ ] Exit code is 0
- [ ] Panel can be closed

#### TC-3.2: Execute Python
**Steps:**
1. Create/open a .py file with:
   ```python
   print("Hello from Python!")
   for i in range(3):
       print(f"Count: {i}")
   ```
2. Click Run button

**Expected:**
- Code executes
- Output shows all print statements
- Exit code 0

**Verification:**
- [ ] Correct output shown
- [ ] No errors in stderr
- [ ] Exit code 0

#### TC-3.3: Execute with Error
**Steps:**
1. Create a .js file with:
   ```javascript
   console.log("Before error");
   throw new Error("Test error");
   console.log("After error");
   ```
2. Click Run

**Expected:**
- "Before error" in stdout
- Error message in stderr section
- Non-zero exit code
- Clear error indication

**Verification:**
- [ ] Partial output shown
- [ ] Error message visible
- [ ] Exit code non-zero

#### TC-3.4: Auto-detect Language
**Steps:**
1. Open a .py file
2. Check language selector

**Expected:**
- Language selector auto-changes to "python"

**Verification:**
- [ ] Correct language selected
- [ ] Works for .js, .py, .rs, .java, .go, .cpp

#### TC-3.5: Run Unsupported Language
**Steps:**
1. Create a .txt file
2. Click Run

**Expected:**
- Error message shown
- No execution attempted

**Verification:**
- [ ] Clear error message
- [ ] No system errors

### Test Suite 4: Context Menu

#### TC-4.1: Folder Context Menu
**Steps:**
1. Right-click on a folder

**Expected:**
- Menu appears at cursor position
- Shows: New File, New Folder, Rename, Delete

**Verification:**
- [ ] All 4 options shown
- [ ] Menu positioned correctly

#### TC-4.2: File Context Menu
**Steps:**
1. Right-click on a file

**Expected:**
- Menu appears
- Shows: Rename, Delete, Copy Path

**Verification:**
- [ ] All 3 options shown
- [ ] No "New File/Folder" options

#### TC-4.3: Close Context Menu
**Steps:**
1. Right-click to open menu
2. Click outside menu
3. OR press Escape

**Expected:**
- Menu closes
- No action taken

**Verification:**
- [ ] Click outside closes menu
- [ ] Escape key closes menu

### Test Suite 5: UI/UX

#### TC-5.1: Refresh Tree
**Steps:**
1. Open workspace
2. Create a file externally (not through app)
3. Click Refresh button in toolbar

**Expected:**
- Tree reloads
- New file appears
- Expanded state resets

**Verification:**
- [ ] External changes reflected
- [ ] No duplicates
- [ ] Tree fully reloaded

#### TC-5.2: Output Panel
**Steps:**
1. Run code to show output
2. Click X button on output panel

**Expected:**
- Panel closes
- More screen space for editor

**Verification:**
- [ ] Panel closes smoothly
- [ ] Can be reopened by running code again

#### TC-5.3: Large Directory
**Steps:**
1. Open a workspace with 100+ files
2. Expand multiple nested folders

**Expected:**
- Tree loads without lag
- Scrolling is smooth
- No performance issues

**Verification:**
- [ ] Initial load < 2 seconds
- [ ] Smooth scrolling
- [ ] No UI freezing

#### TC-5.4: Deep Nesting
**Steps:**
1. Open workspace with 5+ levels of folders
2. Expand all levels

**Expected:**
- Indentation shows hierarchy clearly
- All levels accessible
- No visual glitches

**Verification:**
- [ ] Clear visual hierarchy
- [ ] No overflow issues
- [ ] Icons aligned properly

### Test Suite 6: Edge Cases

#### TC-6.1: Hidden Files
**Steps:**
1. Create a file starting with dot (e.g., .gitignore)
2. Refresh tree

**Expected:**
- Hidden files are filtered out
- Not shown in tree

**Verification:**
- [ ] .gitignore not visible
- [ ] Other dot-files hidden

#### TC-6.2: Special Characters in Names
**Steps:**
1. Create file with name: "test file (v2).js"
2. Run the file

**Expected:**
- File creates successfully
- Executes without path errors

**Verification:**
- [ ] Spaces handled correctly
- [ ] Parentheses handled
- [ ] Execution works

#### TC-6.3: Empty Folder
**Steps:**
1. Create empty folder
2. Expand it

**Expected:**
- Folder expands (chevron rotates)
- No children shown
- No errors

**Verification:**
- [ ] Chevron works
- [ ] No "empty folder" message needed
- [ ] Can add files via context menu

#### TC-6.4: No Workspace Selected
**Steps:**
1. Launch app without selecting workspace

**Expected:**
- Shows "No workspace opened" message
- Shows "Select Root Directory" button
- No tree visible

**Verification:**
- [ ] Clear empty state
- [ ] Button works
- [ ] No errors in console

## 🐛 Bug Report Template

When reporting issues, include:

```
**Issue Title:** [Brief description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Environment:**
- OS: [Windows/macOS/Linux]
- Node version: 
- Tauri version: 
- App version: 

**Screenshots:**
[If applicable]

**Console Errors:**
[If any]
```

## 📊 Test Results Template

```
Test Date: ________
Tester: ________
Environment: ________

File Tree Display:
- [ ] TC-1.1: Open Workspace
- [ ] TC-1.2: Expand/Collapse
- [ ] TC-1.3: File Selection

File Operations:
- [ ] TC-2.1: Create File
- [ ] TC-2.2: Create Folder
- [ ] TC-2.3: Rename File
- [ ] TC-2.4: Rename Folder
- [ ] TC-2.5: Delete File
- [ ] TC-2.6: Delete Folder
- [ ] TC-2.7: Copy Path

Code Execution:
- [ ] TC-3.1: Execute JavaScript
- [ ] TC-3.2: Execute Python
- [ ] TC-3.3: Execute with Error
- [ ] TC-3.4: Auto-detect Language
- [ ] TC-3.5: Unsupported Language

Context Menu:
- [ ] TC-4.1: Folder Menu
- [ ] TC-4.2: File Menu
- [ ] TC-4.3: Close Menu

UI/UX:
- [ ] TC-5.1: Refresh Tree
- [ ] TC-5.2: Output Panel
- [ ] TC-5.3: Large Directory
- [ ] TC-5.4: Deep Nesting

Edge Cases:
- [ ] TC-6.1: Hidden Files
- [ ] TC-6.2: Special Characters
- [ ] TC-6.3: Empty Folder
- [ ] TC-6.4: No Workspace

Total Passed: ____ / 27
Issues Found: ____
```

## 🎯 Performance Benchmarks

Measure and record:

- **Tree Load Time**: Time from workspace selection to tree display
  - Target: < 2 seconds for 1000 files
- **File Operation Latency**: Time from action to tree refresh
  - Target: < 500ms
- **Code Execution Overhead**: Extra time beyond actual execution
  - Target: < 200ms
- **Memory Usage**: Additional memory for tree
  - Target: < 10MB for typical project
- **Render Performance**: Frames per second during scrolling
  - Target: 60 FPS

## 🔍 Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] Screen reader announces tree structure
- [ ] High contrast mode visibility
- [ ] Focus indicators visible
- [ ] No color-only information

## 🌐 Cross-Platform Testing

Test on:
- [ ] Windows 10/11
- [ ] macOS (Intel)
- [ ] macOS (Apple Silicon)
- [ ] Linux (Ubuntu/Debian)
- [ ] Linux (Fedora/RHEL)

Platform-specific checks:
- Path separator handling (\ vs /)
- Default programs (python vs python3)
- File permissions
- Hidden file detection
