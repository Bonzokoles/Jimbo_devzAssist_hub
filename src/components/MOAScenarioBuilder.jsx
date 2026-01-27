import React, { useState, useEffect } from 'react';
import { FiPlus, FiSave, FiPlay, FiX } from 'react-icons/fi';
import MOAModelConfig from './MOAModelConfig';
import { getDefaultScenario, validateScenario, saveMOAScenario } from '../utils/moa/scenarioStorage';
import './MOAScenarioBuilder.css';

const MOAScenarioBuilder = ({ 
  isOpen, 
  onClose, 
  initialScenario = null,
  onSave 
}) => {
  const [scenario, setScenario] = useState(initialScenario || getDefaultScenario());
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialScenario) {
      setScenario(initialScenario);
    } else {
      setScenario(getDefaultScenario());
    }
  }, [initialScenario, isOpen]);

  const handleScenarioChange = (field, value) => {
    setScenario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModelChange = (index, updatedModel) => {
    const newModels = [...scenario.models];
    newModels[index] = updatedModel;
    setScenario(prev => ({
      ...prev,
      models: newModels
    }));
  };

  const handleAddModel = () => {
    const newModel = {
      role: 'New Model',
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 2000
    };
    setScenario(prev => ({
      ...prev,
      models: [...prev.models, newModel]
    }));
  };

  const handleRemoveModel = (index) => {
    if (scenario.models.length <= 1) {
      alert('At least one model is required');
      return;
    }
    const newModels = scenario.models.filter((_, i) => i !== index);
    setScenario(prev => ({
      ...prev,
      models: newModels
    }));
  };

  const handleAggregationChange = (field, value) => {
    setScenario(prev => ({
      ...prev,
      aggregation: {
        ...prev.aggregation,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const validation = validateScenario(scenario);
    if (!validation.valid) {
      setErrors(validation.errors);
      alert('Please fix the errors:\n' + validation.errors.join('\n'));
      return;
    }

    try {
      await saveMOAScenario(scenario);
      if (onSave) {
        onSave(scenario);
      }
      alert('Scenario saved successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save scenario:', error);
      alert('Failed to save scenario: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="scenario-builder-overlay" onClick={onClose}>
      <div className="scenario-builder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scenario-builder-header">
          <h2>MOA Scenario Builder</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="scenario-builder-content">
          {errors.length > 0 && (
            <div className="error-box">
              <strong>Errors:</strong>
              <ul>
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-section">
            <h3>Scenario Information</h3>
            <div className="form-group">
              <label>Scenario Name *</label>
              <input
                type="text"
                value={scenario.name}
                onChange={(e) => handleScenarioChange('name', e.target.value)}
                placeholder="e.g., Code Gen → Review → Optimize"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={scenario.description}
                onChange={(e) => handleScenarioChange('description', e.target.value)}
                placeholder="Describe what this scenario does..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Execution Strategy *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="sequential"
                    checked={scenario.strategy === 'sequential'}
                    onChange={(e) => handleScenarioChange('strategy', e.target.value)}
                  />
                  <span>Sequential</span>
                  <small>Each model processes the output of the previous one</small>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="parallel"
                    checked={scenario.strategy === 'parallel'}
                    onChange={(e) => handleScenarioChange('strategy', e.target.value)}
                  />
                  <span>Parallel</span>
                  <small>All models process the user query simultaneously</small>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Models ({scenario.models.length})</h3>
              <button className="add-model-btn" onClick={handleAddModel}>
                <FiPlus /> Add Model
              </button>
            </div>

            <div className="models-list">
              {scenario.models.map((model, index) => (
                <MOAModelConfig
                  key={index}
                  model={model}
                  index={index}
                  onChange={handleModelChange}
                  onRemove={handleRemoveModel}
                  canRemove={scenario.models.length > 1}
                />
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Response Aggregation</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={scenario.aggregation?.enabled || false}
                  onChange={(e) => handleAggregationChange('enabled', e.target.checked)}
                />
                <span>Enable Response Aggregation</span>
              </label>
              <small className="help-text">
                Combine all individual model responses into a single coherent answer
              </small>
            </div>

            {scenario.aggregation?.enabled && (
              <>
                <div className="form-row two-columns">
                  <div className="form-group">
                    <label>Aggregation Provider</label>
                    <select
                      value={scenario.aggregation.provider}
                      onChange={(e) => handleAggregationChange('provider', e.target.value)}
                    >
                      <option value="openai">OpenAI</option>
                      <option value="claude">Claude</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aggregation Model</label>
                    <select
                      value={scenario.aggregation.model}
                      onChange={(e) => handleAggregationChange('model', e.target.value)}
                    >
                      {scenario.aggregation.provider === 'openai' && (
                        <>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        </>
                      )}
                      {scenario.aggregation.provider === 'claude' && (
                        <>
                          <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                          <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Aggregation Prompt</label>
                  <textarea
                    value={scenario.aggregation.prompt}
                    onChange={(e) => handleAggregationChange('prompt', e.target.value)}
                    placeholder="Instruct the aggregator how to combine responses..."
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="scenario-builder-footer">
          <button className="neon-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            <FiSave /> Save Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default MOAScenarioBuilder;
