import React, { useState, useEffect } from 'react';
import { FiSettings, FiX, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import useStore from '../store/useStore';
import { saveAPIKey, getAPIKey } from '../utils/tauriCommands';
import { testOpenAIConnection, testClaudeConnection } from '../utils/aiClient';
import './Settings.css';

const Settings = () => {
  const { settingsOpen, toggleSettings, setOpenAIKey, setClaudeKey } = useStore();
  const [activeTab, setActiveTab] = useState('ai');
  
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

  // OpenRouter
  const [openrouterKeyInput, setOpenrouterKeyInput] = useState('');
  const [openrouterModel, setOpenrouterModel] = useState('openai/gpt-3.5-turbo');
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false);
  const [openrouterTestStatus, setOpenrouterTestStatus] = useState(null);
  const [testingOpenrouter, setTestingOpenrouter] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      loadApiKeys();
    }
  }, [settingsOpen]);

  const loadApiKeys = async () => {
    try {
      const openaiKey = await getAPIKey('openai');
      const claudeKey = await getAPIKey('claude');
      const openrouterKey = await getAPIKey('openrouter');
      
      if (openaiKey) {
        setOpenaiKeyInput(openaiKey);
        setOpenAIKey(openaiKey);
      }
      if (claudeKey) {
        setClaudeKeyInput(claudeKey);
        setClaudeKey(claudeKey);
      }
      if (openrouterKey) {
        setOpenrouterKeyInput(openrouterKey);
        setOpenRouterKey(openrouterKey);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
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

  const handleTestOpenRouter = async () => {
    if (!openrouterKeyInput.trim()) {
      setOpenrouterTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingOpenrouter(true);
    setOpenrouterTestStatus(null);

    try {
      const success = await testOpenRouterConnection(openrouterKeyInput);
      if (success) {
        setOpenrouterTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setOpenrouterTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setOpenrouterTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingOpenrouter(false);
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
      if (openrouterKeyInput.trim()) {
        await saveAPIKey('openrouter', openrouterKeyInput);
        setOpenRouterKey(openrouterKeyInput);
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

              <div className="settings-section">
                <h3>OpenRouter Configuration (Multi-Model)</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showOpenrouterKey ? 'text' : 'password'}
                      value={openrouterKeyInput}
                      onChange={(e) => setOpenrouterKeyInput(e.target.value)}
                      placeholder="sk-or-..."
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showOpenrouterKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get access to 100+ models at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>OpenRouter.ai</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestOpenRouter}
                    disabled={testingOpenrouter || !openrouterKeyInput.trim()}
                  >
                    {testingOpenrouter ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {openrouterTestStatus && (
                  <div className={`connection-status ${openrouterTestStatus.success ? 'success' : 'error'}`}>
                    {openrouterTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {openrouterTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Initial Model</label>
                  <select value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}>
                    <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
                    <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                    <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku (via OR)</option>
                    <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</option>
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
