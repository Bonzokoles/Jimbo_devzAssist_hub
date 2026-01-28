import React from 'react';
import { FiTerminal } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import FileExplorer from './components/FileExplorer';
import SystemMonitor from './components/SystemMonitor';
import Integrations from './components/Integrations';
import LibrariesManager from './components/LibrariesManager';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Terminal from './components/Terminal';
import Infrastructure from './components/Infrastructure';
import useStore from './store/useStore';
import './App.css';


function App() {
  const { currentView, aiPanelOpen } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'editor':
        return <CodeEditor />;
      case 'libraries':
        return <LibrariesManager />;
      case 'monitor':
        return <SystemMonitor />;
      case 'integrations':
        return <Integrations />;
      case 'terminal':
        return <Terminal />;
      case 'infra':
        return <Infrastructure />;
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
