import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FiSave, FiPlay, FiSettings, FiMaximize, FiCopy, FiTerminal } from 'react-icons/fi';
import { writeFileContent } from '../utils/tauriCommands';
import useStore from '../store/useStore';
import DiffViewer from './DiffViewer';
import './CodeEditor.css';

const CodeEditor = () => {
  const { 
    currentFile, 
    currentFileHandle, 
    currentFileContent, 
    setCurrentFileContent 
  } = useStore();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(currentFileContent || '// Start coding...');
  const [agentCount, setAgentCount] = useState(0); // 0 to 4 agents
  const [systemPrompt, setSystemPrompt] = useState('You are an elite coding assistant...');
  const [agentPrompts, setAgentPrompts] = useState({}); // { 0: '...', 1: '...' }
  const [agentCodes, setAgentCodes] = useState({}); // { 0: '// Agent 1...', 1: '// Agent 2...' }
  const [showDiff, setShowDiff] = useState(false);
  const [pendingCode, setPendingCode] = useState(null);

  const handleSaveFile = async () => {
    if (!currentFile) {
      alert('No file selected to save.');
      return;
    }
    try {
      if (currentFileHandle) {
        // Web Mode: Use File System Access API
        const writable = await currentFileHandle.createWritable();
        await writable.write(currentFileContent);
        await writable.close();
        alert('File saved successfully (Web): ' + currentFile);
      } else {
        // Desktop Mode: Use Tauri
        await writeFileContent(currentFile, currentFileContent);
        alert('File saved successfully: ' + currentFile.split('\\').pop());
      }
    } catch (error) {
      alert('Failed to save file: ' + error);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
    setCurrentFileContent(value || '');
  };

  const handleEditorWillMount = (monaco) => {
    // Define "Search Lights" (Radiolevity) Theme
    monaco.editor.defineTheme('search-lights', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', background: '050505' },
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'D4B261' }, // Gold keywords
        { token: 'string', foreground: 'A6E22E' }, // Green strings
        { token: 'number', foreground: 'BD93F9' },
        { token: 'type', foreground: '66D9EF' },
        { token: 'function', foreground: '50FA7B' },
      ],
      colors: {
        'editor.background': '#050505',
        'editor.foreground': '#D4B261',
        'editorCursor.foreground': '#D4B261',
        'editor.lineHighlightBackground': '#111111',
        'editorLineNumber.foreground': '#444444',
        'editor.selectionBackground': '#222222',
        'editorIndentGuide.background': '#151515',
        'editorIndentGuide.activeBackground': '#333333',
      }
    });
  };

  const handleFormat = () => {
    console.log('Formatting code...');
  };

  const handleSave = () => {
    console.log('Saving file...');
  };

  const handleRun = () => {
    console.log('Running code...');
  };

  const handlePromptKeyDown = (e, type, index = null) => {
    if (e.key === 'Enter') {
      console.log(`Saving ${type} prompt...`, index !== null ? `(Agent ${index + 1})` : '');
      e.target.blur(); // Visual feedback of "saving"
    }
  };

  // This will be called by AI assistant when suggesting code changes
  const handleAIEdit = async (aiSuggestion) => {
    // AI suggested new code
    setPendingCode(aiSuggestion);
    setShowDiff(true);
  };

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

  return (
    <div className={`code-editor ${agentCount > 0 ? 'split-mode' : ''}`}>
      <div className="editor-toolbar">
        <div className="editor-controls">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="dark-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </select>
          
          <div className="moa-selector">
            <span className="moa-label">MOA Agents:</span>
            <select 
              className="dark-select agent-count-select"
              value={agentCount}
              onChange={(e) => setAgentCount(parseInt(e.target.value))}
            >
              <option value="0">Off</option>
              <option value="1">1 Agent</option>
              <option value="2">2 Agents</option>
              <option value="3">3 Agents</option>
              <option value="4">4 Agents</option>
            </select>
          </div>
        </div>

        <div className="toolbar-group">
          <button className="toolbar-btn neon-text" title="Run Code" onClick={handleRun}>
            <FiPlay />
          </button>
          <button className="toolbar-btn cyan-text" title="Save File (Ctrl+S)" onClick={handleSaveFile}>
            <FiSave />
          </button>
          <button className="toolbar-btn" title="Copy All">
            <FiCopy />
          </button>
        </div>
      </div>

      {/* Diff viewer overlay */}
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

      <div className="editor-container" style={{ 
        gridTemplateColumns: `1fr ${agentCount > 0 ? `repeat(${agentCount}, 1fr)` : ''}`
      }}>
        <div className="main-editor-pane">
          <div className="system-prompt-bar">
            <span className="prompt-label">/System Prompt:</span>
            <input 
              type="text" 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              onKeyDown={(e) => handlePromptKeyDown(e, 'system')}
              className="prompt-input"
              placeholder="Enter system instructions..."
            />
          </div>
          <Editor
            height="calc(100% - 45px)"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="search-lights"
            beforeMount={handleEditorWillMount}
            options={{
              fontSize: 14,
              fontFamily: 'Fira Code, monospace',
              minimap: { enabled: true },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>
        
        {[...Array(agentCount)].map((_, i) => (
          <div key={i} className="moa-output-pane glass-card">
            <div className="pane-header neon-text">AGENT {i + 1} ANALYSIS</div>
            <div className="pane-content">
              <div className="agent-prompt-bar">
                <span className="prompt-label">/Prompt:</span>
                <input 
                  type="text" 
                  value={agentPrompts[i] || ''}
                  onChange={(e) => setAgentPrompts({ ...agentPrompts, [i]: e.target.value })}
                  onKeyDown={(e) => handlePromptKeyDown(e, 'agent', i)}
                  className="prompt-input"
                  placeholder={`Instructions for Agent ${i + 1}...`}
                />
              </div>
              <div className="agent-editor-container">
                <Editor
                  height="100%"
                  language={language}
                  value={agentCodes[i] || `// Agent ${i + 1} analysis result will appear here...`}
                  onChange={(value) => setAgentCodes({ ...agentCodes, [i]: value })}
                  theme="search-lights"
                  options={{
                    fontSize: 13,
                    fontFamily: 'Fira Code, monospace',
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    readOnly: false,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
