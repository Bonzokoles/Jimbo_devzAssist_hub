import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiDownload, FiUpload } from 'react-icons/fi';
import './PromptEditor.css';

const PromptEditor = ({ 
  isOpen, 
  onClose, 
  initialPrompt = '', 
  onSave, 
  title = 'Edit Prompt',
  placeholder = 'Enter your prompt here...'
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(prompt);
      onClose();
    } catch (error) {
      console.error('Failed to save prompt:', error);
      alert('Failed to save prompt: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ prompt, exportDate: new Date().toISOString() }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.prompt) {
            setPrompt(data.prompt);
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  if (!isOpen) return null;

  return (
    <div className="prompt-editor-overlay" onClick={onClose}>
      <div className="prompt-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-editor-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="prompt-editor-content">
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
          />
          <div className="character-count">
            {prompt.length} characters
          </div>
        </div>

        <div className="prompt-editor-actions">
          <div className="left-actions">
            <button className="action-btn" onClick={handleImport} title="Import from JSON">
              <FiUpload /> Import
            </button>
            <button className="action-btn" onClick={handleExport} title="Export to JSON">
              <FiDownload /> Export
            </button>
          </div>
          <div className="right-actions">
            <button className="neon-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={isSaving}
            >
              <FiSave /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
