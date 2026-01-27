import React, { useState, useEffect } from 'react';
import { FiFolder, FiRefreshCw } from 'react-icons/fi';
import { WORKSPACE_TEMPLATES } from '../utils/prompts/workspacePrompts';
import './WorkspacePrompt.css';

const WorkspacePrompt = ({ 
  projectPath, 
  prompt, 
  onPromptChange,
  onProjectPathChange 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateSelect = (e) => {
    const key = e.target.value;
    setSelectedTemplate(key);
    
    if (key && WORKSPACE_TEMPLATES[key]) {
      onPromptChange(WORKSPACE_TEMPLATES[key].template);
    }
  };

  const handleClear = () => {
    if (confirm('Clear workspace prompt?')) {
      onPromptChange('');
      setSelectedTemplate('');
    }
  };

  return (
    <div className="workspace-prompt">
      <div className="form-group">
        <label>Project Path</label>
        <div className="project-path-input">
          <FiFolder />
          <input
            type="text"
            value={projectPath}
            onChange={(e) => onProjectPathChange(e.target.value)}
            placeholder="/path/to/project"
          />
        </div>
        <p className="help-text">
          Workspace prompts are saved per project path
        </p>
      </div>

      <div className="form-group">
        <label>Template</label>
        <select value={selectedTemplate} onChange={handleTemplateSelect}>
          <option value="">-- Select a template --</option>
          {Object.entries(WORKSPACE_TEMPLATES).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <div className="prompt-header">
          <label>Workspace Prompt</label>
          <button 
            className="clear-btn"
            onClick={handleClear}
            title="Clear prompt"
          >
            <FiRefreshCw /> Clear
          </button>
        </div>
        <textarea
          className="workspace-textarea"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe your project context, tech stack, and coding conventions..."
          rows={12}
        />
        <div className="character-count">
          {prompt.length} characters
        </div>
      </div>

      <div className="info-box">
        <p><strong>💡 Tip:</strong> The workspace prompt will be included in all AI queries for this project.</p>
        <p>Use it to specify:</p>
        <ul>
          <li>Tech stack and frameworks</li>
          <li>Coding conventions and style guides</li>
          <li>Project structure and architecture</li>
          <li>Business context and requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkspacePrompt;
