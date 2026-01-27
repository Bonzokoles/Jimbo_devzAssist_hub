import React, { useState, useEffect, useRef } from 'react';
import { FiTerminal, FiChevronRight } from 'react-icons/fi';
import './Terminal.css';

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'JIMBO OS v3.0.1 - Terminal Hub Initialized...' },
    { type: 'system', text: 'Establishing secure connection to local workspace...' },
    { type: 'success', text: 'Connected to: T:\\Jimbo_devzAssist_hub' },
    { type: 'info', text: 'Type "help" for a list of available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', text: `PS T:\\> ${cmd}` }]);
    setCommandHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);

    // Mock Command Logic
    switch (trimmedCmd) {
      case 'help':
        setHistory(prev => [...prev, { type: 'info', text: 'Available commands: help, clear, ls, status, moa, whoami, version' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'ls':
        setHistory(prev => [...prev, { type: 'system', text: 'Directory: T:\\Jimbo_devzAssist_hub' },
          { type: 'dim', text: 'src/\npublic/\nnode_modules/\npackage.json\nvite.config.js' }]);
        break;
      case 'status':
        setHistory(prev => [...prev, { type: 'success', text: 'SYSTEM STATUS: OPTIMAL' },
          { type: 'info', text: 'CPU: 14.2% | RAM: 4.8GB / 32GB | GPU: Active' }]);
        break;
      case 'moa':
        setHistory(prev => [...prev, { type: 'neon', text: 'MOA ENGINES: Standby (0/4 Agents active)' }]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'info', text: 'USER: Bonzo (Administrator)\nACCESS LEVEL: Alpha-9' }]);
        break;
      case 'version':
        setHistory(prev => [...prev, { type: 'info', text: 'JIMBO Terminal v3.0.1 (Stable Build)' }]);
        break;
      default:
        // Try to simulate PowerShell check
        setHistory(prev => [...prev, { type: 'error', text: `'${cmd}' is not recognized as a cmdlet, function, or script file.` }]);
    }
    
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="terminal-hub glass-card">
      <div className="terminal-header">
        <FiTerminal className="terminal-status-icon pulse" />
        <span className="terminal-title">JIMBO-TERMINAL (POWERSHELL)</span>
        <div className="terminal-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      
      <div className="terminal-body scrollbar-hidden">
        <div className="scanlines"></div>
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">PS T:\&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck="false"
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
