import React, { useState, useEffect } from 'react';
import { FiBox, FiLink, FiActivity, FiGlobe, FiServer, FiPlay, FiSquare, FiRefreshCw } from 'react-icons/fi';
import { invoke } from '@tauri-apps/api/tauri';
import './Infrastructure.css';

const Infrastructure = () => {
  const [activeTab, setActiveTab] = useState('podman');
  const [containers, setContainers] = useState([]);
  const [tunnels, setTunnels] = useState([
    { id: 1, name: 'Web Dev Tunnel', url: 'https://jimbo-dev.trycloudflare.com', status: 'active', port: 5173 },
    { id: 2, name: 'API Tunnel', url: '-', status: 'inactive', port: 3000 },
  ]);
  const [services, setServices] = useState([
    { name: 'Vite Dev Server', port: 5173, status: 'running' },
    { name: 'Podman Engine', port: '-', status: 'running' },
    { name: 'Local DB', port: 5432, status: 'stopped' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const isTauri = window.__TAURI_IPC__ !== undefined;

  const fetchContainers = async () => {
    if (!isTauri) return;
    setIsLoading(true);
    try {
      const result = await invoke('get_podman_containers');
      const parsed = JSON.parse(result);
      setContainers(parsed.map(c => ({
        id: c.Id.substring(0, 12),
        name: c.Names[0],
        image: c.Image,
        status: c.State === 'running' ? 'running' : 'exited',
        uptime: c.Status
      })));
    } catch (err) {
      console.error('Failed to fetch containers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContainer = async (id, currentStatus) => {
    if (!isTauri) return;
    const action = currentStatus === 'running' ? 'stop' : 'start';
    try {
      await invoke('manage_podman_container', { id, action });
      fetchContainers();
    } catch (err) {
      alert(`Action failed: ${err}`);
    }
  };

  const checkServices = async () => {
    if (!isTauri) return;
    const updated = await Promise.all(services.map(async (service) => {
      if (typeof service.port === 'number') {
        const isUp = await invoke('check_localhost_port', { port: service.port });
        return { ...service, status: isUp ? 'running' : 'stopped' };
      }
      return service;
    }));
    setServices(updated);
  };

  useEffect(() => {
    if (!isTauri) return;
    if (activeTab === 'podman') fetchContainers();
    if (activeTab === 'localhost') checkServices();
    
    const interval = setInterval(() => {
      if (activeTab === 'localhost') checkServices();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const DesktopWarning = () => (
    <div className="desktop-required-msg glass-card">
      <FiServer size={48} className="neon-text" style={{ marginBottom: '15px' }} />
      <h3>Desktop Hub Required</h3>
      <p className="dim-text">This module requires direct system access (Podman/SSH/Ports).</p>
      <p className="dim-text">Please launch **JIMBO-Pro** as a Desktop Application.</p>
    </div>
  );

  return (
    <div className="infrastructure-hub">
      <div className="infra-header glass-card">
        <div className="infra-title">
          <FiServer className="neon-text" />
          <h2>Infrastructure Hub</h2>
        </div>
        <div className="infra-tabs">
          <button 
            className={`infra-tab ${activeTab === 'podman' ? 'active' : ''}`}
            onClick={() => setActiveTab('podman')}
          >
            <FiBox /> Podman
          </button>
          <button 
            className={`infra-tab ${activeTab === 'tunnel' ? 'active' : ''}`}
            onClick={() => setActiveTab('tunnel')}
          >
            <FiGlobe /> Webtunnels
          </button>
          <button 
            className={`infra-tab ${activeTab === 'localhost' ? 'active' : ''}`}
            onClick={() => setActiveTab('localhost')}
          >
            <FiActivity /> Localhost
          </button>
        </div>
      </div>

      <div className="infra-content scrollbar-hidden">
        {activeTab === 'podman' && (
          <div className="podman-view">
            {!isTauri ? (
              <DesktopWarning />
            ) : (
              <>
                <div className="section-header">
                  <h3>Active Containers</h3>
                  <button className="refresh-btn" onClick={fetchContainers} disabled={isLoading}>
                    <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                  </button>
                </div>
                <div className="container-grid">
                  {containers.map((container) => (
                    <div key={container.id} className="container-card glass-card">
                      <div className="container-info">
                        <span className="container-name">{container.name}</span>
                        <span className="container-image dim-text">{container.image}</span>
                      </div>
                      <div className="container-status">
                        <span className={`status-dot ${container.status}`}></span>
                        <span className="status-text">{container.status}</span>
                      </div>
                      <div className="container-actions">
                        {container.status === 'running' ? (
                          <button className="action-btn stop" onClick={() => toggleContainer(container.id, 'running')} title="Stop Container">
                            <FiSquare />
                          </button>
                        ) : (
                          <button className="action-btn start" onClick={() => toggleContainer(container.id, 'exited')} title="Start Container">
                            <FiPlay />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'tunnel' && (
          <div className="tunnel-view">
            <h3>Cloudflare Tunnels</h3>
            <div className="tunnel-list">
              {tunnels.map((tunnel) => (
                <div key={tunnel.id} className="tunnel-item glass-card">
                  <div className="tunnel-info">
                    <FiLink className="neon-text" />
                    <div className="details">
                      <span className="tunnel-name">{tunnel.name}</span>
                      <a href={tunnel.url} target="_blank" className="tunnel-url neon-text">{tunnel.url}</a>
                    </div>
                  </div>
                  <div className="tunnel-meta">
                    <span className="dim-text">Port: {tunnel.port}</span>
                    <span className={`status-tag ${tunnel.status}`}>{tunnel.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="neon-button plus-btn">+ Create New Tunnel</button>
          </div>
        )}

        {activeTab === 'localhost' && (
          <div className="localhost-view">
            {!isTauri ? (
              <DesktopWarning />
            ) : (
              <>
                <h3>Localhost Monitor</h3>
                <div className="service-list">
                  {services.map((service, i) => (
                    <div key={i} className="service-item glass-card">
                      <div className="service-info">
                        <FiPlay className="neon-text" />
                        <span>{service.name}</span>
                      </div>
                      <div className="service-details">
                        <span className="dim-text">Port: {service.port}</span>
                        <span className={`status-tag ${service.status}`}>{service.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Infrastructure;
