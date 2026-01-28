import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FiTerminal, FiX, FiPlus, FiSend } from 'react-icons/fi';
import { executeCommand } from '../utils/tauriCommands';
import useStore from '../store/useStore';
import 'xterm/css/xterm.css';
import './TerminalEmulator.css';

const TerminalEmulator = () => {
  const { workspaceRoot } = useStore();
  const [terminals, setTerminals] = useState([
    { id: 1, name: 'Terminal 1', instance: null, history: [] }
  ]);
  const [activeTerminal, setActiveTerminal] = useState(1);
  const terminalRefs = useRef({});
  const containerRefs = useRef({});
  const commandBuffers = useRef({});
  const fitAddons = useRef({});
  const cleanupFunctions = useRef({});
  
  useEffect(() => {
    // Initialize active terminal
    const activeTab = terminals.find(t => t.id === activeTerminal);
    if (!activeTab || activeTab.instance) return;
    
    initTerminal(activeTerminal);
    
    return () => {
      // Cleanup on unmount
      Object.values(terminalRefs.current).forEach(term => {
        if (term) term.dispose();
      });
    };
  }, [activeTerminal, terminals]);
  
  const initTerminal = (terminalId) => {
    const container = containerRefs.current[terminalId];
    if (!container) return;
    
    // Create xterm instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Fira Code, monospace',
      theme: {
        background: '#0a0e27',
        foreground: '#00ff41',
        cursor: '#00ff41',
        cursorAccent: '#0a0e27',
        selection: 'rgba(0, 255, 65, 0.3)',
        black: '#000000',
        red: '#ff006e',
        green: '#00ff41',
        yellow: '#f59e0b',
        blue: '#00f0ff',
        magenta: '#a855f7',
        cyan: '#00f0ff',
        white: '#ffffff',
        brightBlack: '#555555',
        brightRed: '#ff1a8c',
        brightGreen: '#1aff5c',
        brightYellow: '#ffb31a',
        brightBlue: '#1affff',
        brightMagenta: '#c280ff',
        brightCyan: '#1affff',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });
    
    // Addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    // Open terminal
    term.open(container);
    fitAddon.fit();
    
    // Initialize command buffer
    commandBuffers.current[terminalId] = '';
    
    // Write initial prompt
    term.writeln('JIMBO Terminal Emulator v1.0');
    term.writeln('Type commands to execute in workspace directory');
    term.writeln('');
    term.write('$ ');
    
    // Handle input
    term.onData(async (data) => {
      if (data === '\r') { // Enter key
        const command = commandBuffers.current[terminalId]?.trim() || '';
        if (command) {
          term.write('\r\n');
          
          // Execute command
          await executeTerminalCommand(term, command, terminalId);
          
          // Add to history
          setTerminals(prev => prev.map(t => 
            t.id === terminalId 
              ? { ...t, history: [...t.history, command] }
              : t
          ));
          
          commandBuffers.current[terminalId] = '';
          term.write('$ ');
        } else {
          term.write('\r\n$ ');
        }
      } else if (data === '\u007F') { // Backspace
        if (commandBuffers.current[terminalId]?.length > 0) {
          commandBuffers.current[terminalId] = commandBuffers.current[terminalId].slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\u0003') { // Ctrl+C
        term.write('^C\r\n$ ');
        commandBuffers.current[terminalId] = '';
      } else if (data === '\u000C') { // Ctrl+L
        term.clear();
        term.write('$ ');
      } else if (data.charCodeAt(0) >= 32) { // Printable characters
        commandBuffers.current[terminalId] = (commandBuffers.current[terminalId] || '') + data;
        term.write(data);
      }
    });
    
    // Save instance and addon
    terminalRefs.current[terminalId] = term;
    fitAddons.current[terminalId] = fitAddon;
    setTerminals(prev => prev.map(t => 
      t.id === terminalId ? { ...t, instance: term } : t
    ));
    
    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(container);
    
    // Store cleanup function separately
    cleanupFunctions.current[terminalId] = () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  };
  
  const executeTerminalCommand = async (term, command, terminalId) => {
    try {
      // Use workspace root or fallback to home directory
      const workingDir = workspaceRoot || (typeof process !== 'undefined' && process.env?.HOME) || '/';
      const result = await executeCommand(command, workingDir);
      
      // Write output
      if (result.stdout) {
        const lines = result.stdout.split('\n');
        lines.forEach(line => {
          term.write(line + '\r\n');
        });
      }
      
      if (result.stderr) {
        const lines = result.stderr.split('\n');
        lines.forEach(line => {
          term.write(`\x1b[31m${line}\x1b[0m\r\n`);
        });
      }
      
      if (result.exit_code !== 0) {
        term.write(`\x1b[31mExit code: ${result.exit_code}\x1b[0m\r\n`);
      }
    } catch (error) {
      term.write(`\x1b[31mError: ${error.message}\x1b[0m\r\n`);
    }
  };
  
  const addTerminal = () => {
    const newId = Math.max(...terminals.map(t => t.id)) + 1;
    setTerminals([...terminals, {
      id: newId,
      name: `Terminal ${newId}`,
      instance: null,
      history: []
    }]);
    setActiveTerminal(newId);
  };
  
  const closeTerminal = (id) => {
    if (terminals.length === 1) return; // Keep at least one
    
    // Call cleanup function if it exists
    const cleanup = cleanupFunctions.current[id];
    if (cleanup) {
      cleanup();
    }
    
    delete terminalRefs.current[id];
    delete containerRefs.current[id];
    delete commandBuffers.current[id];
    delete fitAddons.current[id];
    delete cleanupFunctions.current[id];
    
    setTerminals(prev => prev.filter(t => t.id !== id));
    
    if (activeTerminal === id) {
      const remaining = terminals.filter(t => t.id !== id);
      if (remaining.length > 0) {
        setActiveTerminal(remaining[0].id);
      }
    }
  };
  
  const clearTerminal = () => {
    const term = terminalRefs.current[activeTerminal];
    if (term) {
      term.clear();
      term.write('$ ');
      commandBuffers.current[activeTerminal] = '';
    }
  };
  
  const sendToAI = () => {
    const activeTab = terminals.find(t => t.id === activeTerminal);
    if (activeTab && activeTab.history.length > 0) {
      const context = `Terminal history:\n${activeTab.history.join('\n')}`;
      // Send to AI assistant
      console.log('Send to AI:', context);
      alert('Terminal output sent to AI!\n\n' + context);
    } else {
      alert('No terminal history to send.');
    }
  };
  
  return (
    <div className="terminal-emulator">
      <div className="terminal-header">
        <div className="terminal-tabs">
          {terminals.map(term => (
            <div
              key={term.id}
              className={`terminal-tab ${activeTerminal === term.id ? 'active' : ''}`}
              onClick={() => setActiveTerminal(term.id)}
            >
              <FiTerminal />
              <span>{term.name}</span>
              {terminals.length > 1 && (
                <FiX 
                  className="close-tab"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTerminal(term.id);
                  }}
                />
              )}
            </div>
          ))}
          <button className="add-terminal-btn" onClick={addTerminal} title="New Terminal">
            <FiPlus />
          </button>
        </div>
        
        <div className="terminal-actions">
          <button className="terminal-action-btn" onClick={clearTerminal} title="Clear">
            Clear
          </button>
          <button className="terminal-action-btn" onClick={sendToAI} title="Send to AI">
            <FiSend /> Send to AI
          </button>
        </div>
      </div>
      
      <div className="terminal-content">
        {terminals.map(term => (
          <div
            key={term.id}
            ref={el => containerRefs.current[term.id] = el}
            className="terminal-container"
            style={{ display: activeTerminal === term.id ? 'block' : 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default TerminalEmulator;
