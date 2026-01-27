import React from 'react';
import { FiTerminal } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import FileExplorer from './components/FileExplorer';
import SystemMonitor from './components/SystemMonitor';
import Integrations from './components/Integrations';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import useStore from './store/useStore';
import './App.css';

const TerminalView = () => (
  <div className="terminal-view">
    <h2>Terminal</h2>
    <div className="terminal-placeholder">
      <FiTerminal className="terminal-icon" />
      <p>Terminal feature coming soon...</p>
      <p style={{ fontSize: '14px' }}>Integrated terminal with command execution</p>
    </div>
  </div>
);

function App() {
  const { currentView, aiPanelOpen } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'editor':
        return <CodeEditor />;
      case 'monitor':
        return <SystemMonitor />;
      case 'integrations':
        return <Integrations />;
      case 'terminal':
        return <TerminalView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <div className="grid-background"></div>

      <Sidebar />

      <div className="app-content">
        <TopBar />

        <div className="main-content">
          <div className="view-container">
            {renderView()}
          </div>

          {aiPanelOpen && <AIAssistant />}
        </div>
      </div>

      <Settings />
    </div>
  );
}

export default App;
