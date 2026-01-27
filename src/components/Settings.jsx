import React, { useState, useEffect } from 'react';
import { FiSettings, FiX, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import useStore from '../store/useStore';
import { saveAPIKey, getAPIKey } from '../utils/tauriCommands';
import { testOpenAIConnection, testClaudeConnection } from '../utils/aiClient';
import { OPENROUTER_MODELS, testOpenRouterConnection } from '../utils/providers/openrouter';
import { GEMINI_MODELS, testGeminiConnection } from '../utils/providers/gemini';
import { MISTRAL_MODELS, testMistralConnection } from '../utils/providers/mistral';
import { COHERE_MODELS, testCohereConnection } from '../utils/providers/cohere';
import { DEFAULT_OLLAMA_MODELS, testOllamaConnection, getOllamaModels } from '../utils/providers/ollama';
import SkillsManager from './SkillsManager';
import MOAPanel from './MOAPanel';
import './Settings.css';

const Settings = () => {
  const { settingsOpen, toggleSettings, setOpenAIKey, setClaudeKey, setOpenRouterKey, setGeminiKey, setMistralKey, setCohereKey, setOllamaUrl } = useStore();
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
  const [openrouterModel, setOpenrouterModel] = useState(OPENROUTER_MODELS[0].id);
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false);
  const [openrouterTestStatus, setOpenrouterTestStatus] = useState(null);
  const [testingOpenrouter, setTestingOpenrouter] = useState(false);

  // Google Gemini
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [geminiModel, setGeminiModel] = useState(GEMINI_MODELS[0].id);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [geminiTestStatus, setGeminiTestStatus] = useState(null);
  const [testingGemini, setTestingGemini] = useState(false);

  // Mistral AI
  const [mistralKeyInput, setMistralKeyInput] = useState('');
  const [mistralModel, setMistralModel] = useState(MISTRAL_MODELS[0].id);
  const [showMistralKey, setShowMistralKey] = useState(false);
  const [mistralTestStatus, setMistralTestStatus] = useState(null);
  const [testingMistral, setTestingMistral] = useState(false);

  // Cohere
  const [cohereKeyInput, setCohereKeyInput] = useState('');
  const [cohereModel, setCohereModel] = useState(COHERE_MODELS[0].id);
  const [showCohereKey, setShowCohereKey] = useState(false);
  const [cohereTestStatus, setCohereTestStatus] = useState(null);
  const [testingCohere, setTestingCohere] = useState(false);

  // Ollama
  const [ollamaUrlInput, setOllamaUrlInput] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(DEFAULT_OLLAMA_MODELS[0].id);
  const [ollamaTestStatus, setOllamaTestStatus] = useState(null);
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaModels, setOllamaModels] = useState(DEFAULT_OLLAMA_MODELS);

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
      const geminiKey = await getAPIKey('gemini');
      const mistralKey = await getAPIKey('mistral');
      const cohereKey = await getAPIKey('cohere');
      const ollamaUrl = await getAPIKey('ollama');
      
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
      if (geminiKey) {
        setGeminiKeyInput(geminiKey);
        setGeminiKey(geminiKey);
      }
      if (mistralKey) {
        setMistralKeyInput(mistralKey);
        setMistralKey(mistralKey);
      }
      if (cohereKey) {
        setCohereKeyInput(cohereKey);
        setCohereKey(cohereKey);
      }
      if (ollamaUrl) {
        setOllamaUrlInput(ollamaUrl);
        setOllamaUrl(ollamaUrl);
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

  const handleTestGemini = async () => {
    if (!geminiKeyInput.trim()) {
      setGeminiTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingGemini(true);
    setGeminiTestStatus(null);

    try {
      const success = await testGeminiConnection(geminiKeyInput);
      if (success) {
        setGeminiTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setGeminiTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setGeminiTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleTestMistral = async () => {
    if (!mistralKeyInput.trim()) {
      setMistralTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingMistral(true);
    setMistralTestStatus(null);

    try {
      const success = await testMistralConnection(mistralKeyInput);
      if (success) {
        setMistralTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setMistralTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setMistralTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingMistral(false);
    }
  };

  const handleTestCohere = async () => {
    if (!cohereKeyInput.trim()) {
      setCohereTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTestingCohere(true);
    setCohereTestStatus(null);

    try {
      const success = await testCohereConnection(cohereKeyInput);
      if (success) {
        setCohereTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        setCohereTestStatus({ success: false, message: 'Connection failed. Check your API key.' });
      }
    } catch (error) {
      setCohereTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingCohere(false);
    }
  };

  const handleTestOllama = async () => {
    if (!ollamaUrlInput.trim()) {
      setOllamaTestStatus({ success: false, message: 'Please enter a base URL' });
      return;
    }

    setTestingOllama(true);
    setOllamaTestStatus(null);

    try {
      const success = await testOllamaConnection(ollamaUrlInput);
      if (success) {
        setOllamaTestStatus({ success: true, message: 'Connection successful!' });
        try {
          const models = await getOllamaModels(ollamaUrlInput);
          if (models && models.length > 0) {
            setOllamaModels(models);
          }
        } catch (error) {
          console.error('Failed to fetch Ollama models:', error);
        }
      } else {
        setOllamaTestStatus({ success: false, message: 'Connection failed. Check your base URL.' });
      }
    } catch (error) {
      setOllamaTestStatus({ success: false, message: 'Connection failed: ' + error.message });
    } finally {
      setTestingOllama(false);
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
      if (geminiKeyInput.trim()) {
        await saveAPIKey('gemini', geminiKeyInput);
        setGeminiKey(geminiKeyInput);
      }
      if (mistralKeyInput.trim()) {
        await saveAPIKey('mistral', mistralKeyInput);
        setMistralKey(mistralKeyInput);
      }
      if (cohereKeyInput.trim()) {
        await saveAPIKey('cohere', cohereKeyInput);
        setCohereKey(cohereKeyInput);
      }
      if (ollamaUrlInput.trim()) {
        await saveAPIKey('ollama', ollamaUrlInput);
        setOllamaUrl(ollamaUrlInput);
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
              className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </button>
            <button
              className={`tab-btn ${activeTab === 'moa' ? 'active' : ''}`}
              onClick={() => setActiveTab('moa')}
            >
              MOA
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
                <h3>OpenRouter Configuration</h3>
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
                    Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>OpenRouter</a>
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
                  <label>Default Model</label>
                  <select value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}>
                    {OPENROUTER_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Google Gemini Configuration</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      placeholder="AIza..."
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showGeminiKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>Google AI Studio</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestGemini}
                    disabled={testingGemini || !geminiKeyInput.trim()}
                  >
                    {testingGemini ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {geminiTestStatus && (
                  <div className={`connection-status ${geminiTestStatus.success ? 'success' : 'error'}`}>
                    {geminiTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {geminiTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                    {GEMINI_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Mistral AI Configuration</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showMistralKey ? 'text' : 'password'}
                      value={mistralKeyInput}
                      onChange={(e) => setMistralKeyInput(e.target.value)}
                      placeholder="Enter your Mistral API key"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowMistralKey(!showMistralKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showMistralKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get your API key from <a href="https://console.mistral.ai/api-keys/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>Mistral AI Console</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestMistral}
                    disabled={testingMistral || !mistralKeyInput.trim()}
                  >
                    {testingMistral ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {mistralTestStatus && (
                  <div className={`connection-status ${mistralTestStatus.success ? 'success' : 'error'}`}>
                    {mistralTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {mistralTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={mistralModel} onChange={(e) => setMistralModel(e.target.value)}>
                    {MISTRAL_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Cohere Configuration</h3>
                <div className="form-group">
                  <label>API Key</label>
                  <div className="input-wrapper">
                    <input
                      type={showCohereKey ? 'text' : 'password'}
                      value={cohereKeyInput}
                      onChange={(e) => setCohereKeyInput(e.target.value)}
                      placeholder="Enter your Cohere API key"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowCohereKey(!showCohereKey)}
                      style={{ position: 'absolute' }}
                    >
                      {showCohereKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="provider-info">
                    Get your API key from <a href="https://dashboard.cohere.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>Cohere Dashboard</a>
                  </p>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestCohere}
                    disabled={testingCohere || !cohereKeyInput.trim()}
                  >
                    {testingCohere ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {cohereTestStatus && (
                  <div className={`connection-status ${cohereTestStatus.success ? 'success' : 'error'}`}>
                    {cohereTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {cohereTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={cohereModel} onChange={(e) => setCohereModel(e.target.value)}>
                    {COHERE_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Ollama Configuration (Local LLM)</h3>
                <div className="form-group">
                  <label>Base URL</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={ollamaUrlInput}
                      onChange={(e) => setOllamaUrlInput(e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <button
                    className="test-connection-btn"
                    onClick={handleTestOllama}
                    disabled={testingOllama || !ollamaUrlInput.trim()}
                  >
                    {testingOllama ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {ollamaTestStatus && (
                  <div className={`connection-status ${ollamaTestStatus.success ? 'success' : 'error'}`}>
                    {ollamaTestStatus.success ? <FiCheck /> : <FiAlertCircle />}
                    {ollamaTestStatus.message}
                  </div>
                )}

                <div className="form-group model-select">
                  <label>Default Model</label>
                  <select value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)}>
                    {ollamaModels.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="settings-section">
              <SkillsManager inSettingsModal={true} onUseSkill={() => {}} />
            </div>
          )}

          {activeTab === 'moa' && (
            <div className="settings-section">
              <MOAPanel />
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
