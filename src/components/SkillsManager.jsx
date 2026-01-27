import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiUpload, FiX } from 'react-icons/fi';
import { BUILTIN_SKILLS } from '../utils/skills/builtinSkills';
import {
  loadCustomSkills,
  addCustomSkill,
  updateCustomSkill,
  deleteCustomSkill,
  exportSkills,
  importSkills,
  validateSkill,
} from '../utils/skills/skillsStorage';
import SkillCard from './SkillCard';
import './SkillsManager.css';

const SkillsManager = ({ onUseSkill, inSettingsModal = false }) => {
  const [customSkills, setCustomSkills] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeTab, setActiveTab] = useState('builtin');
  
  // Form state for creating/editing skills
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '⚡',
    category: 'Custom',
    systemPrompt: '',
    requiredContext: [],
  });
  
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => {
    const skills = loadCustomSkills();
    setCustomSkills(skills);
  };

  const handleCreateSkill = () => {
    const validation = validateSkill(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingSkill) {
      // Update existing skill
      updateCustomSkill(editingSkill.id, formData);
    } else {
      // Create new skill
      addCustomSkill(formData);
    }

    // Reset and reload
    setFormData({
      name: '',
      description: '',
      icon: '⚡',
      category: 'Custom',
      systemPrompt: '',
      requiredContext: [],
    });
    setEditingSkill(null);
    setShowCreateModal(false);
    setFormErrors([]);
    loadSkills();
  };

  const handleEditSkill = (skill) => {
    setFormData({
      name: skill.name,
      description: skill.description,
      icon: skill.icon || '⚡',
      category: skill.category || 'Custom',
      systemPrompt: skill.systemPrompt,
      requiredContext: skill.requiredContext || [],
    });
    setEditingSkill(skill);
    setShowCreateModal(true);
  };

  const handleDeleteSkill = (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteCustomSkill(skillId);
      loadSkills();
    }
  };

  const handleExport = () => {
    exportSkills();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const count = importSkills(e.target.result);
        alert(`Successfully imported ${count} skills!`);
        loadSkills();
      } catch (error) {
        alert('Failed to import skills: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleCancelEdit = () => {
    setShowCreateModal(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      description: '',
      icon: '⚡',
      category: 'Custom',
      systemPrompt: '',
      requiredContext: [],
    });
    setFormErrors([]);
  };

  return (
    <div className={`skills-manager ${inSettingsModal ? 'in-modal' : ''}`}>
      {!inSettingsModal && (
        <div className="skills-header">
          <h2>AI Skills</h2>
          <div className="skills-actions">
            <button className="skill-btn" onClick={() => setShowCreateModal(true)}>
              <FiPlus /> Create Skill
            </button>
            <button className="skill-btn" onClick={handleExport}>
              <FiDownload /> Export
            </button>
            <label className="skill-btn">
              <FiUpload /> Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}

      <div className="skills-tabs">
        <button
          className={`tab-btn ${activeTab === 'builtin' ? 'active' : ''}`}
          onClick={() => setActiveTab('builtin')}
        >
          Built-in Skills ({BUILTIN_SKILLS.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Custom Skills ({customSkills.length})
        </button>
      </div>

      <div className="skills-content">
        {activeTab === 'builtin' && (
          <div className="skills-grid">
            {BUILTIN_SKILLS.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onUse={onUseSkill}
                isCustom={false}
              />
            ))}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="skills-grid">
            {customSkills.length === 0 ? (
              <div className="no-skills">
                <p>No custom skills yet.</p>
                <button className="neon-button" onClick={() => setShowCreateModal(true)}>
                  <FiPlus /> Create Your First Skill
                </button>
              </div>
            ) : (
              customSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onUse={onUseSkill}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                  isCustom={true}
                />
              ))
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="skill-modal-overlay" onClick={handleCancelEdit}>
          <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
            <div className="skill-modal-header">
              <h3>{editingSkill ? 'Edit Skill' : 'Create New Skill'}</h3>
              <button className="close-btn" onClick={handleCancelEdit}>
                <FiX />
              </button>
            </div>

            <div className="skill-modal-content">
              {formErrors.length > 0 && (
                <div className="form-errors">
                  {formErrors.map((error, i) => (
                    <div key={i} className="error-message">{error}</div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Custom Code Review"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="⚡"
                  maxLength={2}
                />
                <small>Use an emoji (e.g., 🚀 📝 🔍)</small>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Code Quality, Security"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this skill does..."
                  rows={2}
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label>System Prompt *</label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  placeholder="You are an expert... Analyze the code for..."
                  rows={10}
                />
                <small>This is the instruction given to the AI when using this skill</small>
              </div>
            </div>

            <div className="skill-modal-footer">
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleCreateSkill}>
                {editingSkill ? 'Save Changes' : 'Create Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
