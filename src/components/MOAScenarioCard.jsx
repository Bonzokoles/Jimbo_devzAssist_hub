import React from 'react';
import { FiEdit, FiCopy, FiDownload, FiTrash2, FiLayers, FiZap } from 'react-icons/fi';
import './MOAScenarioCard.css';

const MOAScenarioCard = ({ 
  scenario, 
  onEdit, 
  onDuplicate, 
  onExport, 
  onDelete 
}) => {
  const getStrategyIcon = () => {
    return scenario.strategy === 'sequential' ? '→' : '⚡';
  };

  const getStrategyLabel = () => {
    return scenario.strategy === 'sequential' ? 'Sequential' : 'Parallel';
  };

  return (
    <div className="moa-scenario-card">
      <div className="scenario-card-header">
        <div className="scenario-title">
          <FiLayers />
          <h4>{scenario.name}</h4>
        </div>
        <div className="scenario-badge">
          <span className={`strategy-badge ${scenario.strategy}`}>
            {getStrategyIcon()} {getStrategyLabel()}
          </span>
        </div>
      </div>

      {scenario.description && (
        <p className="scenario-description">{scenario.description}</p>
      )}

      <div className="scenario-info">
        <div className="info-item">
          <span className="info-label">Models:</span>
          <span className="info-value">{scenario.models.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Aggregation:</span>
          <span className="info-value">
            {scenario.aggregation?.enabled ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </div>
      </div>

      <div className="scenario-models-preview">
        {scenario.models.map((model, index) => (
          <div key={index} className="model-preview-item">
            <span className="model-index">{index + 1}</span>
            <span className="model-role">{model.role}</span>
            <span className="model-provider">{model.provider}</span>
          </div>
        ))}
      </div>

      <div className="scenario-card-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => onEdit(scenario)}
          title="Edit scenario"
        >
          <FiEdit />
        </button>
        <button 
          className="action-btn duplicate-btn"
          onClick={() => onDuplicate(scenario)}
          title="Duplicate scenario"
        >
          <FiCopy />
        </button>
        <button 
          className="action-btn export-btn"
          onClick={() => onExport(scenario)}
          title="Export scenario"
        >
          <FiDownload />
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(scenario)}
          title="Delete scenario"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default MOAScenarioCard;
