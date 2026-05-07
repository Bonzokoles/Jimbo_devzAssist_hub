import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { invoke } from '@tauri-apps/api/tauri';
import { FiTerminal } from 'react-icons/fi';
import 'xterm/css/xterm.css';
import './Terminal.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize XTerm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
      theme: {
        background: 'rgba(1, 2, 6, 0.0)', // Transparent to show CSS background
        foreground: '#ffffff',
        cursor: '#00f0ff',
        cursorAccent: '#000000',
        black: '#000000',
        red: '#ff0066',
        green: '#00ff41',
        yellow: '#D4B261',
        blue: '#0066ff',
        magenta: '#cc00ff',
        cyan: '#00f0ff',
        white: '#ffffff',
        brightBlack: '#666666',
        brightRed: '#ff4488',
        brightGreen: '#44ff77',
        brightYellow: '#ffff44',
        brightBlue: '#4488ff',
        brightMagenta: '#ff44ff',
        brightCyan: '#44ffff',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });

    // Add addons
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store refs
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln('\x1b[36m╔════════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[36m║\x1b[0m  \x1b[1;32mJIMBO OS v3.0.1 - Terminal Hub Initialized...\x1b[0m         \x1b[36m║\x1b[0m');
    term.writeln('\x1b[36m║\x1b[0m  Connected to: \x1b[33mT:\\Jimbo_devzAssist_hub\x1b[0m              \x1b[36m║\x1b[0m');
    term.writeln('\x1b[36m╚════════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.write('\x1b[32mPS T:\\>\x1b[0m ');

    // Handle user input
    let currentLine = '';
    
    term.onKey(async ({ key, domEvent }) => {
      const code = domEvent.keyCode;
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (code === 13) { // Enter
        term.write('\r\n');
        if (currentLine.trim()) {
          setCommandHistory(prev => [currentLine, ...prev]);
          await executeCommand(currentLine, term);
          currentLine = '';
        }
        term.write('\x1b[32mPS T:\\>\x1b[0m ');
      } else if (code === 8) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 67 && domEvent.ctrlKey) { // Ctrl+C
        term.write('^C');
        term.write('\r\n\x1b[32mPS T:\\>\x1b[0m ');
        currentLine = '';
      } else if (code === 76 && domEvent.ctrlKey) { // Ctrl+L (clear)
        term.clear();
        term.write('\x1b[32mPS T:\\>\x1b[0m ');
        currentLine = '';
      } else if (printable) {
        currentLine += key;
        term.write(key);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, []);

  const executeCommand = async (cmd, term) => {
    try {
      // Parse command and arguments
      const parts = cmd.trim().split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);

      // Execute via Tauri
      const output = await invoke('execute_command', {
        command: 'powershell.exe',
        args: ['-NoProfile', '-NonInteractive', '-Command', cmd]
      });

      // Write output
      if (output) {
        const lines = output.split('\n');
        lines.forEach(line => {
          term.writeln(line.replace(/\r/g, ''));
        });
      }
    } catch (error) {
      term.writeln(`\x1b[31mError: ${error}\x1b[0m`);
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
      
      <div className="terminal-body" style={{ padding: '10px' }}>
        <div className="scanlines"></div>
        <div 
          ref={terminalRef} 
          style={{ 
            height: '100%', 
            width: '100%',
          }} 
        />
      </div>
    </div>
  );
};

export default Terminal;
