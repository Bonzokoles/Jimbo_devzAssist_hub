import React from 'react';
import { FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './MOAModelConfig.css';

const MOAModelConfig = ({ 
  model, 
  index, 
  onChange, 
  onRemove,
  canRemove = true 
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (field, value) => {
    onChange(index, { ...model, [field]: value });
  };

  return (
    <div className="moa-model-config">
      <div className="model-config-header">
        <div className="model-info">
          <span className="model-number">Model {index + 1}</span>
          <span className="model-role">{model.role || 'Untitled'}</span>
        </div>
        <div className="model-actions">
          <button 
            className="toggle-btn"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {canRemove && (
            <button 
              className="remove-btn"
              onClick={() => onRemove(index)}
              title="Remove model"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="model-config-content">
          <div className="form-row">
            <div className="form-group">
              <label>Role/Purpose</label>
              <input
                type="text"
                value={model.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="e.g., Code Generator, Reviewer, Optimizer"
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label>Provider</label>
              <select
                value={model.provider}
                onChange={(e) => handleChange('provider', e.target.value)}
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Claude (Anthropic)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Model</label>
              <select
                value={model.model}
                onChange={(e) => handleChange('model', e.target.value)}
              >
                {model.provider === 'openai' && (
                  <>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </>
                )}
                {model.provider === 'claude' && (
                  <>
                    <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                    <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>System Prompt (Model-Specific Role)</label>
            <textarea
              value={model.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              placeholder="Define this model's specific role and instructions..."
              rows={6}
            />
            <div className="character-count">
              {(model.systemPrompt || '').length} characters
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label>Temperature</label>
              <input
                type="number"
                value={model.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                min="0"
                max="2"
                step="0.1"
              />
              <small className="help-text">0 = deterministic, 2 = creative</small>
            </div>

            <div className="form-group">
              <label>Max Tokens</label>
              <input
                type="number"
                value={model.maxTokens}
                onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                min="100"
                max="4096"
                step="100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MOAModelConfig;
