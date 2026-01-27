import React, { useState, useEffect } from 'react';
import { FiSettings, FiX, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import useStore from '../store/useStore';
import { saveAPIKey, getAPIKey } from '../utils/tauriCommands';
import { testOpenAIConnection, testClaudeConnection } from '../utils/aiClient';
import PromptPresets from './PromptPresets';
import WorkspacePrompt from './WorkspacePrompt';
import { loadSystemPrompt, saveSystemPrompt, loadWorkspacePrompt, saveWorkspacePrompt } from '../utils/prompts/promptStorage';
import './Settings.css';

const Settings = () => {
  const { settingsOpen, toggleSettings, setOpenAIKey, setClaudeKey, currentProjectPath } = useStore();
  const [activeTab, setActiveTab] = useState('system-prompt');
  
  // OpenAI
  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [openaiModel, setOpenaiModel] = useState('gpt-4');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [openaiTestStatus, setOpenaiTestStatus] = useState(null);
  const [testingOpenai, setTestingOpenai] = useState(false);
  
  // Claude
  const [claudeKeyInput, setClaudeKeyInput] = useState('');
  const [claudeModel, setClaudeModel] = useState('claude-3-sonnet-20240229');
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [claudeTestStatus, setClaudeTestStatus] = useState(null);
  const [testingClaude, setTestingClaude] = useState(false);
  
  // Prompts
  const [systemPrompt, setSystemPrompt] = useState('');
  const [workspacePrompt, setWorkspacePrompt] = useState('');

  useEffect(() => {
    if (settingsOpen) {
      loadApiKeys();
      loadPrompts();
    }
  }, [settingsOpen]);

  const loadApiKeys = async () => {
    try {
      const openaiKey = await getAPIKey('openai');
      const claudeKey = await getAPIKey('claude');
      
      if (openaiKey) {
        setOpenaiKeyInput(openaiKey);
        setOpenAIKey(openaiKey);
      }
      if (claudeKey) {
        setClaudeKeyInput(claudeKey);
        setClaudeKey(claudeKey);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const loadPrompts = async () => {
    try {
      const sysPrompt = await loadSystemPrompt();
      if (sysPrompt) {
        setSystemPrompt(sysPrompt);
      }
      
      if (currentProjectPath) {
        const wsPrompt = await loadWorkspacePrompt(currentProjectPath);
        if (wsPrompt) {
          setWorkspacePrompt(wsPrompt);
        }
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const handleTestOpenAI = async () => {
    if (!openaiKeyInput.trim()) {
      setOpenaiTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingOpenai(true);
    setOpenaiTestStatus(null);

    try {
      const success = await testOpenAIConnection(openaiKeyInput);
      if (success) {
        setOpenaiTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setOpenaiTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setOpenaiTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingOpenai(false);
    }
  };

  const handleTestClaude = async () => {
    if (!claudeKeyInput.trim()) {
      setClaudeTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingClaude(true);
    setClaudeTestStatus(null);

    try {
      const success = await testClaudeConnection(claudeKeyInput);
      if (success) {
        setClaudeTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setClaudeTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setClaudeTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingClaude(false);
    }
  };

  const handleSave = async () => {
    try {
      if (openaiKeyInput.trim()) {
        await saveAPIKey('openai', openaiKeyInput);
        setOpenAIKey(openaiKeyInput);
      }
      if (claudeKeyInput.trim()) {
        await saveAPIKey('claude', claudeKeyInput);
        setClaudeKey(claudeKeyInput);
      }
      
      // Save prompts
      await saveSystemPrompt(systemPrompt);
      
      if (currentProjectPath && workspacePrompt) {
        await saveWorkspacePrompt(currentProjectPath, workspacePrompt);
      }
      
      alert('Settings saved successfully!');
      toggleSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings: ' + error);
    }
  };

  if (!settingsOpen) return null;

  return (
    <div className="settings-overlay" onClick={toggleSettings}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>
            <FiSettings />
            Settings
          </h2>
          <button className="close-btn" onClick={toggleSettings}>
            <FiX />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`tab-btn ${activeTab === 'system-prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('system-prompt')}
            >
              System Prompt
            </button>
            <button
              className={`tab-btn ${activeTab === 'workspace' ? 'active' : ''}`}
              onClick={() => setActiveTab('workspace')}
            >
              Workspace
            </button>
            <button
              className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Providers
            </button>
            <button
              className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
            <button
              className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              System
            </button>
          </div>

          {activeTab === 'system-prompt' && (
            <div className="settings-section">
              <h3>System Prompt</h3>
              <p style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
                Configure the system prompt that defines the AI assistant's behavior and capabilities.
              </p>
              
              <PromptPresets onSelectPreset={setSystemPrompt} />
              
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter your system prompt here..."
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)',
                  textAlign: 'right' 
                }}>
                  {systemPrompt.length} characters
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="settings-section">
              <h3>Workspace Prompt</h3>
              <p style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
                Add project-specific context and guidelines for the current workspace.
              </p>
              
              {currentProjectPath ? (
                <WorkspacePrompt 
                  projectPath={currentProjectPath}
                  value={workspacePrompt}
                  onChange={setWorkspacePrompt}
                />
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  No project selected. Please select a project to configure workspace prompt.
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <div className="settings-section">
                <h3>OpenAI Configuration</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiKeyInput}
                      onChange={(e) => setOpenaiKeyInput(e.target.value)}
                      placeholder="sk-..."
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showOpenaiKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>OpenAI Platform</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestOpenAI}
                    disabled={testingOpenai || !openaiKeyInput.trim()}
                  >
                    {testingOpenai ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {openaiTestStatus && (
                  <div className={`connection-status ${openaiTestStatus.success ? 'success' : 'error'}`}>
                    {openaiTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {openaiTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)}>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Anthropic Claude Configuration</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showClaudeKey ? 'text' : 'password'}
                      value={claudeKeyInput}
                      onChange={(e) => setClaudeKeyInput(e.target.value)}
                      placeholder="sk-ant-..."
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowClaudeKey(!showClaudeKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showClaudeKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>Anthropic Console</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestClaude}
                    disabled={testingClaude || !claudeKeyInput.trim()}
                  >
                    {testingClaude ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {claudeTestStatus && (
                  <div className={`connection-status ${claudeTestStatus.success ? 'success' : 'error'}`}>
                    {claudeTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {claudeTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={claudeModel} onChange={(e) => setClaudeModel(e.target.value)}>
                    <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                    <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Theme Settings</h3>
              <div className="form-group">
                <label>Theme</label>
                <select defaultValue="cyberpunk">
                  <option value="cyberpunk">Cyberpunk (Default)</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <div className="form-group">
                <label>Font Size</label>
                <select defaultValue="medium">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <h3>System Preferences</h3>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  Auto-optimize memory
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  GPU Acceleration
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="neon-button" onClick={toggleSettings}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
