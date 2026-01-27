import React, { useState, useEffect } from 'react';
import { FiCpu, FiHardDrive, FiDatabase } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../store/useStore';
import { getSystemStats, cleanCache, optimizeMemory } from '../utils/tauriCommands';
import './SystemMonitor.css';

const SystemMonitor = () => {
  const { systemStats, setSystemStats } = useStore();
  const [cpuHistory, setCpuHistory] = useState([]);
  const [ramHistory, setRamHistory] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Update every 2 seconds
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await getSystemStats();
      setSystemStats(stats);

      // Update history
      const timestamp = new Date().toLocaleTimeString();
      setCpuHistory((prev) => [...prev.slice(-19), { time: timestamp, value: stats.cpu_usage }]);
      setRamHistory((prev) => [...prev.slice(-19), { time: timestamp, value: stats.memory_percent }]);
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const handleCleanCache = async () => {
    try {
      const result = await cleanCache();
      alert(result);
      fetchStats();
    } catch (error) {
      alert('Failed to clean cache: ' + error);
    }
  };

  const handleOptimizeMemory = async () => {
    try {
      const result = await optimizeMemory();
      alert(result);
      fetchStats();
    } catch (error) {
      alert('Failed to optimize memory: ' + error);
    }
  };

  const CircularProgress = ({ value, max = 100 }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;

    return (
      <div className="progress-ring">
        <svg width="120" height="120">
          <circle
            className="progress-ring-circle"
            cx="60"
            cy="60"
            r={radius}
          />
          <circle
            className="progress-ring-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="progress-text">{value.toFixed(1)}%</div>
      </div>
    );
  };

  return (
    <div className="system-monitor">
      <h2>System Monitor</h2>

      {systemStats && (
        <>
          <div className="monitor-grid">
            <div className="monitor-card">
              <div className="monitor-header">
                <span className="monitor-label">CPU Usage</span>
                <FiCpu className="monitor-icon" />
              </div>
              <CircularProgress value={systemStats.cpu_usage} />
              <div className="monitor-details">Real-time CPU monitoring</div>
            </div>

            <div className="monitor-card">
              <div className="monitor-header">
                <span className="monitor-label">Memory</span>
                <FiDatabase className="monitor-icon" />
              </div>
              <CircularProgress value={systemStats.memory_percent} />
              <div className="monitor-details">
                {systemStats.memory_used} MB / {systemStats.memory_total} MB
              </div>
            </div>

            <div className="monitor-card">
              <div className="monitor-header">
                <span className="monitor-label">Disk Usage</span>
                <FiHardDrive className="monitor-icon" />
              </div>
              <CircularProgress value={systemStats.disk_percent} />
              <div className="monitor-details">
                {systemStats.disk_used} GB / {systemStats.disk_total} GB
              </div>
            </div>
          </div>

          <div className="charts-section">
            <h3>Performance History</h3>

            {cpuHistory.length > 0 && (
              <div className="chart-container">
                <h4 style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.8)' }}>CPU Usage</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cpuHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{ background: '#0a0e27', border: '1px solid rgba(0,255,65,0.3)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00ff41"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {ramHistory.length > 0 && (
              <div className="chart-container">
                <h4 style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.8)' }}>Memory Usage</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ramHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{ background: '#0a0e27', border: '1px solid rgba(0,240,255,0.3)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00f0ff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="optimization-actions">
            <button className="neon-button" onClick={handleCleanCache}>
              Clean Cache
            </button>
            <button className="neon-button cyan" onClick={handleOptimizeMemory}>
              Free Memory
            </button>
            <button className="neon-button pink">
              Optimize GPU
            </button>
          </div>
        </>
      )}

      {!systemStats && (
        <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.5)' }}>
          Loading system statistics...
        </div>
      )}
    </div>
  );
};

export default SystemMonitor;
