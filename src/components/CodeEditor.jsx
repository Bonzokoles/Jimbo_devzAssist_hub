import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FiSave, FiPlay, FiCode, FiZap } from 'react-icons/fi';
import useStore from '../store/useStore';
import './CodeEditor.css';

const CodeEditor = () => {
  const { currentFile, currentFileContent, setCurrentFileContent } = useStore();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(currentFileContent || '// Start coding...');

  const handleEditorChange = (value) => {
    setCode(value || '');
    setCurrentFileContent(value || '');
  };

  const handleSave = () => {
    console.log('Saving file...');
    alert('File saved! (Demo mode)');
  };

  const handleFormat = () => {
    console.log('Formatting code...');
    alert('Code formatted! (Demo mode)');
  };

  const handleRun = () => {
    console.log('Running code...');
    alert('Code execution! (Demo mode)');
  };

  return (
    <div className="code-editor">
      <div className="editor-toolbar">
        <div className="editor-controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </select>
        </div>

        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={handleFormat}>
            <FiCode />
            Format
          </button>
          <button className="toolbar-btn" onClick={handleSave}>
            <FiSave />
            Save
          </button>
          <button className="toolbar-btn" onClick={handleRun}>
            <FiPlay />
            Run
          </button>
          <button className="toolbar-btn primary">
            <FiZap />
            AI Complete
          </button>
        </div>
      </div>

      <div className="editor-container">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
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
    </div>
  );
};

export default CodeEditor;
