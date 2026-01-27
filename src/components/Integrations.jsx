import React, { useState } from 'react';
import { FiGithub, FiDatabase } from 'react-icons/fi';
import './Integrations.css';

const Integrations = () => {
  const [githubToken, setGithubToken] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [dbConnectionString, setDbConnectionString] = useState('');
  const [dbConnected, setDbConnected] = useState(false);

  const handleGithubConnect = () => {
    if (githubToken.trim()) {
      setGithubConnected(true);
      alert('GitHub connected successfully! (Demo mode)');
    } else {
      alert('Please enter a valid Personal Access Token');
    }
  };

  const handleDbConnect = () => {
    if (dbConnectionString.trim()) {
      setDbConnected(true);
      alert('Database connected successfully! (Demo mode)');
    } else {
      alert('Please enter a valid connection string');
    }
  };

  return (
    <div className="integrations">
      <h2>Integrations</h2>

      <div className="integrations-grid">
        {/* GitHub Integration */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon">
              <FiGithub />
            </div>
            <div className="integration-info">
              <h3>GitHub</h3>
              <p>Connect to your GitHub repositories</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`connection-badge ${githubConnected ? 'connected' : 'disconnected'}`}>
                <div className={`pulse-dot ${!githubConnected && 'inactive'}`} 
                     style={{ width: '6px', height: '6px' }}></div>
                {githubConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="integration-form">
            <div className="form-group">
              <label>Personal Access Token</label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
              />
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Generate a token from GitHub Settings → Developer Settings
              </p>
            </div>

            <div className="integration-actions">
              <button className="neon-button" onClick={handleGithubConnect}>
                {githubConnected ? 'Reconnect' : 'Connect'}
              </button>
              {githubConnected && (
                <button className="neon-button pink" onClick={() => setGithubConnected(false)}>
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Database Integration */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
              <FiDatabase style={{ color: 'var(--neon-cyan)' }} />
            </div>
            <div className="integration-info">
              <h3>Database</h3>
              <p>Connect to PostgreSQL, MySQL, or SQLite</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`connection-badge ${dbConnected ? 'connected' : 'disconnected'}`}>
                <div className={`pulse-dot ${!dbConnected && 'inactive'}`} 
                     style={{ width: '6px', height: '6px' }}></div>
                {dbConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="integration-form">
            <div className="form-group">
              <label>Database Type</label>
              <select defaultValue="postgresql">
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Connection String</label>
              <input
                type="text"
                value={dbConnectionString}
                onChange={(e) => setDbConnectionString(e.target.value)}
                placeholder="postgresql://user:password@localhost:5432/dbname"
              />
            </div>

            <div className="integration-actions">
              <button className="neon-button cyan" onClick={handleDbConnect}>
                {dbConnected ? 'Reconnect' : 'Connect'}
              </button>
              <button className="neon-button" disabled={!dbConnected}>
                Test Connection
              </button>
              {dbConnected && (
                <button className="neon-button pink" onClick={() => setDbConnected(false)}>
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Jira Integration (Placeholder) */}
        <div className="integration-card" style={{ opacity: 0.5 }}>
          <div className="integration-header">
            <div className="integration-icon" style={{ background: 'rgba(176, 0, 255, 0.1)' }}>
              <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>J</span>
            </div>
            <div className="integration-info">
              <h3>Jira</h3>
              <p>Connect to your Jira workspace (Coming Soon)</p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '15px' }}>
            This integration will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
