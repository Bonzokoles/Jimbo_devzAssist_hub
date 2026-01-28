import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { getAvailableSources, loadMCPConfig, saveMCPConfig } from '../utils/mcp/mcpClient';
import './ContextSelector.css';

const ContextSelector = () => {
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Load available sources
    const availableSources = getAvailableSources();
    setSources(availableSources);

    // Load selected sources from config
    const config = loadMCPConfig();
    setSelectedSources(config.selectedSources || []);
  }, []);

  const toggleSource = (sourceId) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((id) => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleSave = () => {
    const config = loadMCPConfig();
    config.selectedSources = selectedSources;
    const success = saveMCPConfig(config);
    
    if (success) {
      alert('Context sources saved successfully!');
    } else {
      alert('Failed to save context sources');
    }
  };

  const getPreviewText = () => {
    const activeSource = sources.filter((s) => selectedSources.includes(s.id));
    if (activeSource.length === 0) {
      return 'No context sources selected. AI will have minimal context.';
    }

    return `Selected ${activeSource.length} context source(s):\n\n${activeSource
      .map((s) => `${s.icon} ${s.name}`)
      .join('\n')}`;
  };

  return (
    <div className="context-selector">
      <div className="context-selector-header">
        <h4>Context Sources</h4>
        <p className="context-selector-description">
          Select which context sources to include when communicating with AI
        </p>
      </div>

      <div className="context-sources-list">
        {sources.map((source) => (
          <div
            key={source.id}
            className={`context-source-item ${
              selectedSources.includes(source.id) ? 'selected' : ''
            }`}
            onClick={() => toggleSource(source.id)}
          >
            <div className="context-source-icon">{source.icon}</div>
            <div className="context-source-info">
              <div className="context-source-name">{source.name}</div>
              <div className="context-source-status">
                {source.enabled ? 'Available' : 'Coming Soon'}
              </div>
            </div>
            <div className="context-source-checkbox">
              {selectedSources.includes(source.id) ? (
                <FiCheck className="check-icon" />
              ) : (
                <div className="checkbox-empty"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="context-preview-section">
        <button
          className="preview-toggle-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide' : 'Show'} Context Preview
        </button>

        {showPreview && (
          <div className="context-preview">
            <pre>{getPreviewText()}</pre>
          </div>
        )}
      </div>

      <div className="context-selector-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Context Settings
        </button>
      </div>
    </div>
  );
};

export default ContextSelector;
