import React from 'react';
import { FiCpu, FiZap } from 'react-icons/fi';
import useStore from '../store/useStore';
import './TopBar.css';

const TopBar = () => {
  const { currentView, aiPanelOpen, toggleAIPanel, systemStats } = useStore();

  const viewTitles = {
    dashboard: 'Dashboard',
    editor: 'Code Editor',
    monitor: 'System Monitor',
    integrations: 'Integrations',
    terminal: 'Terminal',
  };

  return (
    <div className="topbar">
      <div className="topbar-title">
        {viewTitles[currentView] || 'BONZO DevAssist'}
      </div>

      <div className="topbar-actions">
        <div className="topbar-status">
          {systemStats && (
            <div className="status-item">
              <div className="status-icon"></div>
              <FiCpu />
              <span>{systemStats.cpu_usage?.toFixed(1)}%</span>
            </div>
          )}
        </div>

        <button 
          className={`ai-toggle-btn ${aiPanelOpen ? 'active' : ''}`}
          onClick={toggleAIPanel}
        >
          <FiZap />
          AI Assistant
        </button>
      </div>
    </div>
  );
};

export default TopBar;
