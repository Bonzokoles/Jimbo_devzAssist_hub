import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiCode, 
  FiActivity, 
  FiZap, 
  FiTerminal, 
  FiSettings,
  FiServer,
  FiPackage
} from 'react-icons/fi';
import useStore from '../store/useStore';
import { loadCustomLogo } from '../utils/branding';
import './Sidebar.css';

const Sidebar = () => {
  const { currentView, setCurrentView, toggleSettings, openaiKey, claudeKey } = useStore();
  const [customLogo, setCustomLogo] = useState(null);

  useEffect(() => {
    // Load custom logo on mount
    const logo = loadCustomLogo();
    if (logo) {
      setCustomLogo(logo);
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { id: 'editor', icon: FiCode, label: 'Code Editor' },
    { id: 'libraries', icon: FiPackage, label: 'Libraries' },
    { id: 'monitor', icon: FiActivity, label: 'System Monitor' },
    { id: 'integrations', icon: FiZap, label: 'Integrations' },
    { id: 'infra', icon: FiServer, label: 'Infrastructure Hub' },
    { id: 'terminal', icon: FiTerminal, label: 'Terminal Hub' },
  ];

  const hasApiKeys = openaiKey || claudeKey;

  return (
    <div className="sidebar">
      <div className="sidebar-logo glitch" data-text="B">
        {customLogo ? (
          <img src={customLogo} alt="Logo" className="custom-logo" />
        ) : (
          'B'
        )}
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
              title={item.label}
            >
              <Icon />
            </div>
          );
        })}
      </div>

      <div className="sidebar-status">
        <div className="sidebar-ai-status">
          <div className={`pulse-dot ${hasApiKeys ? '' : 'inactive'}`} 
               style={!hasApiKeys ? {background: '#666', boxShadow: 'none', animation: 'none'} : {}}></div>
          <span className="sidebar-ai-label">AI</span>
        </div>
        
        <div
          className="sidebar-item"
          onClick={toggleSettings}
          title="Settings"
        >
          <FiSettings />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
