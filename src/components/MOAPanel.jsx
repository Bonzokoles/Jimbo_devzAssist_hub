import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiRefreshCw } from 'react-icons/fi';
import useStore from '../store/useStore';
import { MOA_STRATEGIES, isMOAConfigured } from '../utils/moa/moaEngine';
import { OPENROUTER_MODELS } from '../utils/providers/openrouter';
import { GEMINI_MODELS } from '../utils/providers/gemini';
import { MISTRAL_MODELS } from '../utils/providers/mistral';
import { COHERE_MODELS } from '../utils/providers/cohere';
import { DEFAULT_OLLAMA_MODELS } from '../utils/providers/ollama';
import './MOAPanel.css';

const MOAPanel = () => {
  const { 
    moaEnabled, moaConfig, setMOAEnabled, setMOAConfig,
    openaiKey, claudeKey, openrouterKey, geminiKey, mistralKey, cohereKey, ollamaUrl 
  } = useStore();

  const [strategy, setStrategy] = useState(moaConfig?.strategy || MOA_STRATEGIES.PARALLEL);
  const [models, setModels] = useState(moaConfig?.models || []);
  const [aggregatorConfig, setAggregatorConfig] = useState(moaConfig?.aggregatorConfig || null);
  const [agentRoles, setAgentRoles] = useState(moaConfig?.agentRoles || {});

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('bonzo_moa_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setStrategy(parsed.strategy || MOA_STRATEGIES.PARALLEL);
        setModels(parsed.models || []);
        setAggregatorConfig(parsed.aggregatorConfig || null);
        setAgentRoles(parsed.agentRoles || {});
      } catch (error) {
        console.error('Failed to parse MOA config:', error);
      }
    }
  }, []);

  const getApiKeyForProvider = (provider) => {
    switch (provider) {
      case 'openai': return openaiKey;
      case 'claude': return claudeKey;
      case 'openrouter': return openrouterKey;
      case 'gemini': return geminiKey;
      case 'mistral': return mistralKey;
      case 'cohere': return cohereKey;
      case 'ollama': return true;
      default: return null;
    }
  };

  const getModelOptions = (provider) => {
    switch (provider) {
      case 'openai':
        return [
          { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
          { id: 'gpt-4', name: 'GPT-4' },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        ];
      case 'claude':
        return [
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
        ];
      case 'openrouter': return OPENROUTER_MODELS;
      case 'gemini': return GEMINI_MODELS;
      case 'mistral': return MISTRAL_MODELS;
      case 'cohere': return COHERE_MODELS;
      case 'ollama': return DEFAULT_OLLAMA_MODELS;
      default: return [];
    }
  };

  const addModel = () => {
    if (models.length >= 5) {
      alert('Maximum 5 models allowed');
      return;
    }

    const newModel = {
      id: Date.now(),
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: openaiKey || '',
      baseUrl: null,
    };

    setModels([...models, newModel]);
  };

  const removeModel = (id) => {
    setModels(models.filter(m => m.id !== id));
  };

  const updateModel = (id, field, value) => {
    setModels(models.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        
        // Auto-fill API key when provider changes
        if (field === 'provider') {
          updated.apiKey = getApiKeyForProvider(value) || '';
          updated.baseUrl = value === 'ollama' ? ollamaUrl : null;
          
          // Set default model for provider
          const modelOptions = getModelOptions(value);
          if (modelOptions.length > 0) {
            updated.model = modelOptions[0].id;
          }
        }
        
        return updated;
      }
      return m;
    }));
  };

  const saveConfiguration = () => {
    const config = {
      strategy,
      models: strategy === MOA_STRATEGIES.SPECIALIZED ? [] : models,
      aggregatorConfig: strategy === MOA_STRATEGIES.VOTING ? aggregatorConfig : null,
      agentRoles: strategy === MOA_STRATEGIES.SPECIALIZED ? agentRoles : {},
    };

    // Validate config
    if (!isMOAConfigured(config)) {
      alert('Please configure at least 2 models/agents');
      return;
    }

    // Save to localStorage
    localStorage.setItem('bonzo_moa_config', JSON.stringify(config));
    
    // Save to store
    setMOAConfig(config);
    
    alert('MOA configuration saved successfully!');
  };

  const loadConfiguration = () => {
    const savedConfig = localStorage.getItem('bonzo_moa_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setStrategy(parsed.strategy || MOA_STRATEGIES.PARALLEL);
        setModels(parsed.models || []);
        setAggregatorConfig(parsed.aggregatorConfig || null);
        setAgentRoles(parsed.agentRoles || {});
        setMOAConfig(parsed);
        alert('Configuration loaded successfully!');
      } catch (error) {
        alert('Failed to load configuration: ' + error.message);
      }
    } else {
      alert('No saved configuration found');
    }
  };

  const addAgentRole = (role) => {
    if (agentRoles[role]) {
      alert('Agent role already exists');
      return;
    }

    const rolePrompts = {
      coder: 'You are a senior software engineer. Focus on writing clean, efficient, and well-documented code. Provide implementation details and best practices.',
      reviewer: 'You are a code reviewer. Analyze the code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Provide constructive feedback.',
      documenter: 'You are a technical writer. Create clear, comprehensive documentation. Include usage examples, API references, and explanations.',
      tester: 'You are a QA engineer. Design and write comprehensive test cases. Focus on edge cases, error handling, and test coverage.',
    };

    setAgentRoles({
      ...agentRoles,
      [role]: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: openaiKey || '',
        systemPrompt: rolePrompts[role] || '',
      },
    });
  };

  const removeAgentRole = (role) => {
    const newRoles = { ...agentRoles };
    delete newRoles[role];
    setAgentRoles(newRoles);
  };

  const updateAgentRole = (role, field, value) => {
    setAgentRoles({
      ...agentRoles,
      [role]: {
        ...agentRoles[role],
        [field]: value,
      },
    });
  };

  return (
    <div className="moa-panel">
      <div className="moa-header">
        <h3>Mixture of Agents (MOA)</h3>
        <p className="moa-description">
          Combine multiple AI models for enhanced results. Each strategy offers unique advantages.
        </p>
      </div>

      <div className="moa-section">
        <label className="moa-label">Strategy</label>
        <select 
          className="moa-select"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value={MOA_STRATEGIES.PARALLEL}>Parallel - All models respond simultaneously</option>
          <option value={MOA_STRATEGIES.SEQUENTIAL}>Sequential - Models refine each other's responses</option>
          <option value={MOA_STRATEGIES.VOTING}>Voting - Models vote on best answer</option>
          <option value={MOA_STRATEGIES.SPECIALIZED}>Specialized - Different agents for different roles</option>
        </select>
      </div>

      {/* Model Configuration for Parallel, Sequential, and Voting */}
      {(strategy === MOA_STRATEGIES.PARALLEL || 
        strategy === MOA_STRATEGIES.SEQUENTIAL || 
        strategy === MOA_STRATEGIES.VOTING) && (
        <div className="moa-section">
          <div className="section-header">
            <label className="moa-label">Models ({models.length}/5)</label>
            <button 
              className="add-model-btn"
              onClick={addModel}
              disabled={models.length >= 5}
            >
              <FiPlus /> Add Model
            </button>
          </div>

          {models.length === 0 && (
            <div className="empty-state">
              <p>No models configured. Add at least 2 models to use MOA.</p>
            </div>
          )}

          {models.map((model, index) => (
            <div key={model.id} className="model-card">
              <div className="model-card-header">
                <span className="model-number">Model {index + 1}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeModel(model.id)}
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="model-field">
                <label>Provider</label>
                <select
                  value={model.provider}
                  onChange={(e) => updateModel(model.id, 'provider', e.target.value)}
                >
                  <option value="openai" disabled={!openaiKey}>OpenAI</option>
                  <option value="claude" disabled={!claudeKey}>Claude</option>
                  <option value="openrouter" disabled={!openrouterKey}>OpenRouter</option>
                  <option value="gemini" disabled={!geminiKey}>Google Gemini</option>
                  <option value="mistral" disabled={!mistralKey}>Mistral AI</option>
                  <option value="cohere" disabled={!cohereKey}>Cohere</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              <div className="model-field">
                <label>Model</label>
                <select
                  value={model.model}
                  onChange={(e) => updateModel(model.id, 'model', e.target.value)}
                >
                  {getModelOptions(model.provider).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="model-field">
                <label>API Key</label>
                <input
                  type="password"
                  value={model.apiKey}
                  onChange={(e) => updateModel(model.id, 'apiKey', e.target.value)}
                  placeholder={model.provider === 'ollama' ? 'Not required' : 'Enter API key or use default'}
                  disabled={model.provider === 'ollama'}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aggregator Configuration for Voting Strategy */}
      {strategy === MOA_STRATEGIES.VOTING && (
        <div className="moa-section">
          <label className="moa-label">Aggregator Model</label>
          <p className="field-description">
            This model will analyze and combine responses from all models.
          </p>

          <div className="model-card">
            <div className="model-field">
              <label>Provider</label>
              <select
                value={aggregatorConfig?.provider || 'openai'}
                onChange={(e) => setAggregatorConfig({
                  ...aggregatorConfig,
                  provider: e.target.value,
                  apiKey: getApiKeyForProvider(e.target.value) || '',
                  model: getModelOptions(e.target.value)[0]?.id || '',
                })}
              >
                <option value="openai" disabled={!openaiKey}>OpenAI</option>
                <option value="claude" disabled={!claudeKey}>Claude</option>
                <option value="openrouter" disabled={!openrouterKey}>OpenRouter</option>
                <option value="gemini" disabled={!geminiKey}>Google Gemini</option>
                <option value="mistral" disabled={!mistralKey}>Mistral AI</option>
                <option value="cohere" disabled={!cohereKey}>Cohere</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>

            <div className="model-field">
              <label>Model</label>
              <select
                value={aggregatorConfig?.model || ''}
                onChange={(e) => setAggregatorConfig({
                  ...aggregatorConfig,
                  model: e.target.value,
                })}
              >
                {getModelOptions(aggregatorConfig?.provider || 'openai').map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="model-field">
              <label>API Key</label>
              <input
                type="password"
                value={aggregatorConfig?.apiKey || ''}
                onChange={(e) => setAggregatorConfig({
                  ...aggregatorConfig,
                  apiKey: e.target.value,
                })}
                placeholder="Enter API key or use default"
                disabled={aggregatorConfig?.provider === 'ollama'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Specialized Agents Configuration */}
      {strategy === MOA_STRATEGIES.SPECIALIZED && (
        <div className="moa-section">
          <div className="section-header">
            <label className="moa-label">Agent Roles</label>
            <div className="agent-role-buttons">
              {!agentRoles.coder && (
                <button className="add-role-btn" onClick={() => addAgentRole('coder')}>
                  + Coder
                </button>
              )}
              {!agentRoles.reviewer && (
                <button className="add-role-btn" onClick={() => addAgentRole('reviewer')}>
                  + Reviewer
                </button>
              )}
              {!agentRoles.documenter && (
                <button className="add-role-btn" onClick={() => addAgentRole('documenter')}>
                  + Documenter
                </button>
              )}
              {!agentRoles.tester && (
                <button className="add-role-btn" onClick={() => addAgentRole('tester')}>
                  + Tester
                </button>
              )}
            </div>
          </div>

          {Object.keys(agentRoles).length === 0 && (
            <div className="empty-state">
              <p>No agents configured. Add at least 2 specialized agents.</p>
            </div>
          )}

          {Object.entries(agentRoles).map(([role, config]) => (
            <div key={role} className="agent-card">
              <div className="agent-card-header">
                <span className="agent-role-name">{role.toUpperCase()}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeAgentRole(role)}
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="model-field">
                <label>Provider</label>
                <select
                  value={config.provider}
                  onChange={(e) => {
                    const newProvider = e.target.value;
                    updateAgentRole(role, 'provider', newProvider);
                    updateAgentRole(role, 'apiKey', getApiKeyForProvider(newProvider) || '');
                    updateAgentRole(role, 'model', getModelOptions(newProvider)[0]?.id || '');
                  }}
                >
                  <option value="openai" disabled={!openaiKey}>OpenAI</option>
                  <option value="claude" disabled={!claudeKey}>Claude</option>
                  <option value="openrouter" disabled={!openrouterKey}>OpenRouter</option>
                  <option value="gemini" disabled={!geminiKey}>Google Gemini</option>
                  <option value="mistral" disabled={!mistralKey}>Mistral AI</option>
                  <option value="cohere" disabled={!cohereKey}>Cohere</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              <div className="model-field">
                <label>Model</label>
                <select
                  value={config.model}
                  onChange={(e) => updateAgentRole(role, 'model', e.target.value)}
                >
                  {getModelOptions(config.provider).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="model-field">
                <label>System Prompt</label>
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) => updateAgentRole(role, 'systemPrompt', e.target.value)}
                  placeholder="Define the agent's role and responsibilities..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Preview */}
      <div className="moa-section">
        <label className="moa-label">Configuration Preview</label>
        <div className="config-preview">
          <div className="preview-item">
            <strong>Strategy:</strong> {strategy}
          </div>
          <div className="preview-item">
            <strong>Status:</strong>{' '}
            {isMOAConfigured({ strategy, models, aggregatorConfig, agentRoles }) ? (
              <span className="status-valid">✓ Valid Configuration</span>
            ) : (
              <span className="status-invalid">✗ Invalid - Configure at least 2 models/agents</span>
            )}
          </div>
          {strategy !== MOA_STRATEGIES.SPECIALIZED && (
            <div className="preview-item">
              <strong>Models:</strong> {models.length}
            </div>
          )}
          {strategy === MOA_STRATEGIES.SPECIALIZED && (
            <div className="preview-item">
              <strong>Agents:</strong> {Object.keys(agentRoles).join(', ') || 'None'}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="moa-actions">
        <button className="moa-btn secondary" onClick={loadConfiguration}>
          <FiRefreshCw /> Load Saved
        </button>
        <button className="moa-btn primary" onClick={saveConfiguration}>
          <FiSave /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default MOAPanel;
