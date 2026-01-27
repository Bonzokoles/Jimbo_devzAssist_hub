import React, { useState, useEffect } from 'react';
import { FiPlus, FiUpload } from 'react-icons/fi';
import MOAScenarioCard from './MOAScenarioCard';
import MOAScenarioBuilder from './MOAScenarioBuilder';
import { 
  loadMOAScenarios, 
  deleteMOAScenario, 
  exportScenario, 
  importScenario,
  saveMOAScenario 
} from '../utils/moa/scenarioStorage';
import './ScenarioManager.css';

const ScenarioManager = () => {
  const [scenarios, setScenarios] = useState([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const loaded = await loadMOAScenarios();
      setScenarios(loaded);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const handleCreateNew = () => {
    setEditingScenario(null);
    setBuilderOpen(true);
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setBuilderOpen(true);
  };

  const handleDuplicate = async (scenario) => {
    const duplicate = {
      ...scenario,
      name: `${scenario.name} (Copy)`,
    };
    setEditingScenario(duplicate);
    setBuilderOpen(true);
  };

  const handleExport = (scenario) => {
    exportScenario(scenario);
  };

  const handleImport = async () => {
    try {
      const scenario = await importScenario();
      await saveMOAScenario(scenario);
      await loadScenarios();
      alert('Scenario imported successfully!');
    } catch (error) {
      console.error('Failed to import scenario:', error);
      alert('Failed to import scenario: ' + error.message);
    }
  };

  const handleDelete = async (scenario) => {
    if (!confirm(`Delete scenario "${scenario.name}"?`)) {
      return;
    }

    try {
      await deleteMOAScenario(scenario.name);
      await loadScenarios();
    } catch (error) {
      console.error('Failed to delete scenario:', error);
      alert('Failed to delete scenario: ' + error.message);
    }
  };

  const handleSaveScenario = async () => {
    await loadScenarios();
    setBuilderOpen(false);
    setEditingScenario(null);
  };

  return (
    <div className="scenario-manager">
      <div className="manager-header">
        <h3>Saved MOA Scenarios</h3>
        <div className="manager-actions">
          <button className="import-btn" onClick={handleImport}>
            <FiUpload /> Import
          </button>
          <button className="create-btn" onClick={handleCreateNew}>
            <FiPlus /> Create New Scenario
          </button>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="empty-state">
          <p>No scenarios saved yet.</p>
          <p>Create your first MOA scenario to get started!</p>
          <button className="neon-button" onClick={handleCreateNew}>
            <FiPlus /> Create First Scenario
          </button>
        </div>
      ) : (
        <div className="scenarios-grid">
          {scenarios.map((scenario, index) => (
            <MOAScenarioCard
              key={index}
              scenario={scenario}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onExport={handleExport}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <MOAScenarioBuilder
        isOpen={builderOpen}
        onClose={() => {
          setBuilderOpen(false);
          setEditingScenario(null);
        }}
        initialScenario={editingScenario}
        onSave={handleSaveScenario}
      />
    </div>
  );
};

export default ScenarioManager;
