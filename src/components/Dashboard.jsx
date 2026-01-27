import React from 'react';
import { FiFolder, FiGitCommit, FiCode, FiZap, FiPlus } from 'react-icons/fi';
import { open } from '@tauri-apps/api/dialog';
import useStore from '../store/useStore';
import './Dashboard.css';

const Dashboard = () => {
  const { stats, projects, addProject, setCurrentView, setWorkspaceRoot, setProjectHandle } = useStore();

  const handleNewProject = async () => {
    // Check if we are in Tauri environment
    const isTauri = window.__TAURI_IPC__ !== undefined;

    try {
      if (isTauri) {
        // Desktop Mode: Use Tauri Dialog
        const selected = await open({
          directory: true,
          multiple: false,
          title: 'Select Project Directory'
        });

        if (selected) {
          registerProject(selected);
        }
      } else {
        // Web Mode: Use Browser File System Access API
        if ('showDirectoryPicker' in window) {
          const handle = await window.showDirectoryPicker();
          registerProject(handle.name, handle);
        } else {
          alert('Your browser does not support folder selection. Please use the Desktop App.');
        }
      }
    } catch (err) {
      console.error('Failed to open project:', err);
      // Only show alert if it's not a user cancellation
      if (err !== 'user cancelled') {
        alert('Action failed: ' + err);
      }
    }
  };

  const registerProject = (pathOrName, handle = null) => {
    const projectName = pathOrName.split?.('\\').pop() || pathOrName.split?.('/').pop() || pathOrName;
    addProject({
      id: Date.now(),
      name: projectName,
      path: typeof pathOrName === 'string' ? pathOrName : null,
      handle: handle, // For Web mode
      status: 'active',
      files: '---',
      lastModified: 'Just now'
    });
    setWorkspaceRoot(pathOrName); 
    if (handle) setProjectHandle(handle);
    setCurrentView('editor');
  };

  const handleProjectClick = (project) => {
    setWorkspaceRoot(project.path || project.name);
    if (project.handle) setProjectHandle(project.handle);
    setCurrentView('editor');
  };

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FiFolder, color: 'green' },
    { label: 'AI Queries', value: stats.aiQueries.toLocaleString(), icon: FiZap, color: 'cyan' },
    { label: 'Lines of Code', value: stats.linesOfCode.toLocaleString(), icon: FiCode, color: 'pink' },
    { label: 'Git Commits', value: stats.gitCommits.toLocaleString(), icon: FiGitCommit, color: 'purple' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>
          Welcome back, <span className="glitch neon-text" data-text="Bonzo">Bonzo</span>
        </h1>
        <p>Your intelligent development environment is ready</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <Icon className="stat-icon" />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">↑ 12% from last week</div>
            </div>
          );
        })}
      </div>

      <div className="recent-projects">
        <div className="section-header">
          <h2>Recent Projects</h2>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="project-item fade-in" 
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-info">
                <div className="project-icon">
                  <FiFolder />
                </div>
                <div className="project-details">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    {project.files} files • Last modified {project.lastModified}
                  </div>
                </div>
              </div>
              <div className={`project-status ${project.status}`}>
                <div className="pulse-dot" style={{ width: '6px', height: '6px' }}></div>
                {project.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <button className="neon-button" onClick={handleNewProject}>
          <FiPlus style={{ marginRight: '8px' }} />
          New Project
        </button>
        <button className="neon-button cyan" onClick={() => setCurrentView('editor')}>
          <FiCode style={{ marginRight: '8px' }} />
          Open Editor
        </button>
        <button className="neon-button pink" onClick={() => setCurrentView('monitor')}>
          <FiZap style={{ marginRight: '8px' }} />
          System Monitor
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
