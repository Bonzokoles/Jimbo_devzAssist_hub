import React, { useState, useEffect } from 'react';
import { FiGlobe, FiPlay, FiSquare, FiAlertCircle } from 'react-icons/fi';
import {
  loadTunnelConfig,
  saveTunnelConfig,
  startTunnel,
  stopTunnel,
  getTunnelStatus,
} from '../utils/tunnel/cloudflareTunnel';
import './NetworkSettings.css';

const NetworkSettings = () => {
  const [devPort, setDevPort] = useState(5173);
  const [backendPort, setBackendPort] = useState('');
  const [tunnelEnabled, setTunnelEnabled] = useState(false);
  const [cloudflaredPath, setCloudflaredPath] = useState('cloudflared');
  const [tunnelStatus, setTunnelStatus] = useState({ active: false, url: null });
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const config = loadTunnelConfig();
    if (config) {
      setDevPort(config.devPort || 5173);
      setBackendPort(config.backendPort || '');
      setTunnelEnabled(config.tunnelEnabled || false);
      setCloudflaredPath(config.cloudflaredPath || 'cloudflared');
    }

    // Load tunnel status
    const status = getTunnelStatus();
    setTunnelStatus(status);
  }, []);

  const handleSave = () => {
    const config = {
      devPort,
      backendPort,
      tunnelEnabled,
      cloudflaredPath,
    };

    const success = saveTunnelConfig(config);
    if (success) {
      alert('Network settings saved successfully!');
    } else {
      alert('Failed to save network settings');
    }
  };

  const handleStartTunnel = async () => {
    setIsStarting(true);
    try {
      const result = await startTunnel(devPort, cloudflaredPath);
      if (result.success) {
        setTunnelStatus({ active: true, url: result.url });
        alert(`Tunnel started successfully!\nURL: ${result.url}`);
      } else {
        alert('Failed to start tunnel');
      }
    } catch (error) {
      alert(`Error starting tunnel: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopTunnel = async () => {
    try {
      const result = await stopTunnel();
      if (result.success) {
        setTunnelStatus({ active: false, url: null });
        alert('Tunnel stopped successfully');
      } else {
        alert('Failed to stop tunnel');
      }
    } catch (error) {
      alert(`Error stopping tunnel: ${error.message}`);
    }
  };

  return (
    <div className="network-settings">
      <div className="network-section">
        <h4>Development Server</h4>
        <div className="form-group">
          <label>Dev Server Port</label>
          <input
            type="number"
            value={devPort}
            onChange={(e) => setDevPort(parseInt(e.target.value) || 5173)}
            placeholder="5173"
            min="1024"
            max="65535"
          />
          <span className="input-hint">Default: 5173 (Vite dev server)</span>
        </div>

        <div className="form-group">
          <label>Backend Port (Optional)</label>
          <input
            type="number"
            value={backendPort}
            onChange={(e) => setBackendPort(e.target.value)}
            placeholder="3000"
            min="1024"
            max="65535"
          />
          <span className="input-hint">Leave empty if not using a backend</span>
        </div>
      </div>

      <div className="network-section">
        <h4>
          <FiGlobe /> Cloudflare Tunnel
        </h4>
        <p className="section-description">
          Expose your local development server to the internet securely
        </p>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={tunnelEnabled}
              onChange={(e) => setTunnelEnabled(e.target.checked)}
            />
            <span>Enable Cloudflare Tunnel</span>
          </label>
        </div>

        {tunnelEnabled && (
          <>
            <div className="form-group">
              <label>Cloudflared Path</label>
              <input
                type="text"
                value={cloudflaredPath}
                onChange={(e) => setCloudflaredPath(e.target.value)}
                placeholder="cloudflared"
              />
              <span className="input-hint">
                Path to cloudflared binary (default: cloudflared)
              </span>
            </div>

            <div className="tunnel-status-container">
              <div className="tunnel-status">
                <div className="status-indicator">
                  <div className={`status-dot ${tunnelStatus.active ? 'active' : 'inactive'}`}></div>
                  <span className="status-text">
                    {tunnelStatus.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {tunnelStatus.active && tunnelStatus.url && (
                  <div className="tunnel-url">
                    <FiGlobe />
                    <a href={tunnelStatus.url} target="_blank" rel="noopener noreferrer">
                      {tunnelStatus.url}
                    </a>
                  </div>
                )}
              </div>

              <div className="tunnel-actions">
                {!tunnelStatus.active ? (
                  <button
                    className="tunnel-btn start-btn"
                    onClick={handleStartTunnel}
                    disabled={isStarting}
                  >
                    <FiPlay />
                    {isStarting ? 'Starting...' : 'Start Tunnel'}
                  </button>
                ) : (
                  <button className="tunnel-btn stop-btn" onClick={handleStopTunnel}>
                    <FiSquare />
                    Stop Tunnel
                  </button>
                )}
              </div>
            </div>

            <div className="info-box">
              <FiAlertCircle />
              <div>
                <strong>Note:</strong> This is a simulated tunnel interface. In production,
                cloudflared would need to be installed and configured.
              </div>
            </div>
          </>
        )}
      </div>

      <div className="network-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Network Settings
        </button>
      </div>
    </div>
  );
};

export default NetworkSettings;
