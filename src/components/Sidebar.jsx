import React from 'react';
import { 
  FiHome, 
  FiCode, 
  FiActivity, 
  FiZap, 
  FiTerminal, 
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import useStore from '../store/useStore';
import './Sidebar.css';

const Sidebar = () => {
  const { currentView, setCurrentView, toggleSettings, openaiKey, claudeKey } = useStore();

  const menuItems = [
    { id: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { id: 'editor', icon: FiCode, label: 'Code Editor' },
    { id: 'libraries', icon: FiPackage, label: 'Libraries' },
    { id: 'monitor', icon: FiActivity, label: 'System Monitor' },
    { id: 'integrations', icon: FiZap, label: 'Integrations' },
    { id: 'terminal', icon: FiTerminal, label: 'Terminal' },
  ];

  const hasApiKeys = openaiKey || claudeKey;

  return (
    <div className="sidebar">
      <div className="sidebar-logo glitch" data-text="B">
        B
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
