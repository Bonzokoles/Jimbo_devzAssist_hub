import React from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import './SkillCard.css';

const SkillCard = ({ skill, onUse, onEdit, onDelete, isCustom = false }) => {
  return (
    <div className="skill-card">
      <div className="skill-header">
        <span className="skill-icon">{skill.icon || '⚡'}</span>
        <h3 className="skill-name">{skill.name}</h3>
        {skill.category && <span className="skill-category">{skill.category}</span>}
      </div>
      
      <p className="skill-description">{skill.description}</p>
      
      <div className="skill-actions">
        <button 
          className="skill-action-btn use-btn"
          onClick={() => onUse(skill)}
          title="Use this skill"
        >
          Use Skill
        </button>
        
        {isCustom && (
          <>
            <button 
              className="skill-action-btn edit-btn"
              onClick={() => onEdit(skill)}
              title="Edit skill"
            >
              <FiEdit2 />
            </button>
            <button 
              className="skill-action-btn delete-btn"
              onClick={() => onDelete(skill.id)}
              title="Delete skill"
            >
              <FiTrash2 />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
