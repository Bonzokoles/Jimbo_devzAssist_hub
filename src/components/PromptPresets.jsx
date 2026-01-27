import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import { DEFAULT_SYSTEM_PROMPTS } from '../utils/prompts/systemPrompts';
import { loadPromptPresets, savePromptPreset, deletePromptPreset } from '../utils/prompts/promptStorage';
import './PromptPresets.css';

const PromptPresets = ({ onSelectPreset, currentPrompt }) => {
  const [customPresets, setCustomPresets] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [selectedPresetKey, setSelectedPresetKey] = useState(null);

  useEffect(() => {
    loadCustomPresets();
  }, []);

  const loadCustomPresets = async () => {
    try {
      const presets = await loadPromptPresets();
      setCustomPresets(presets);
    } catch (error) {
      console.error('Failed to load custom presets:', error);
    }
  };

  const handleSelectPreset = (key, prompt) => {
    setSelectedPresetKey(key);
    onSelectPreset(prompt);
  };

  const handleSaveCustomPreset = async () => {
    if (!newPresetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    try {
      await savePromptPreset(newPresetName, currentPrompt);
      setNewPresetName('');
      setShowSaveDialog(false);
      await loadCustomPresets();
      alert('Preset saved successfully!');
    } catch (error) {
      console.error('Failed to save preset:', error);
      alert('Failed to save preset: ' + error.message);
    }
  };

  const handleDeletePreset = async (name) => {
    if (!confirm(`Delete preset "${name}"?`)) {
      return;
    }

    try {
      await deletePromptPreset(name);
      await loadCustomPresets();
    } catch (error) {
      console.error('Failed to delete preset:', error);
      alert('Failed to delete preset: ' + error.message);
    }
  };

  return (
    <div className="prompt-presets">
      <div className="presets-header">
        <h4>Prompt Presets</h4>
        <button 
          className="save-preset-btn"
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          title="Save current prompt as preset"
        >
          <FiPlus /> Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="save-preset-dialog">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveCustomPreset();
              }
            }}
          />
          <button onClick={handleSaveCustomPreset}>
            <FiCheck /> Save
          </button>
        </div>
      )}

      <div className="presets-section">
        <h5>Default Presets</h5>
        <div className="presets-list">
          {Object.entries(DEFAULT_SYSTEM_PROMPTS).map(([key, { name, prompt }]) => (
            <div 
              key={key}
              className={`preset-item ${selectedPresetKey === key ? 'selected' : ''}`}
              onClick={() => handleSelectPreset(key, prompt)}
            >
              <div className="preset-name">{name}</div>
              <div className="preset-preview">
                {prompt.substring(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {customPresets.length > 0 && (
        <div className="presets-section">
          <h5>Custom Presets</h5>
          <div className="presets-list">
            {customPresets.map((preset, index) => (
              <div 
                key={index}
                className={`preset-item ${selectedPresetKey === `custom-${index}` ? 'selected' : ''}`}
              >
                <div 
                  className="preset-content"
                  onClick={() => handleSelectPreset(`custom-${index}`, preset.prompt)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-preview">
                    {preset.prompt.substring(0, 100)}...
                  </div>
                </div>
                <button 
                  className="delete-preset-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePreset(preset.name);
                  }}
                  title="Delete preset"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPresets;
