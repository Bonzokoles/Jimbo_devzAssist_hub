// Skills Storage - Save and load custom skills from localStorage

const SKILLS_STORAGE_KEY = 'bonzo_custom_skills';

// Load custom skills from localStorage
export const loadCustomSkills = () => {
  try {
    const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (!stored) return [];
    
    const skills = JSON.parse(stored);
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error('Failed to load custom skills:', error);
    return [];
  }
};

// Save custom skills to localStorage
export const saveCustomSkills = (skills) => {
  try {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
    return true;
  } catch (error) {
    console.error('Failed to save custom skills:', error);
    return false;
  }
};

// Add a new custom skill
export const addCustomSkill = (skill) => {
  const skills = loadCustomSkills();
  
  // Generate ID if not provided
  if (!skill.id) {
    skill.id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Add timestamp
  skill.createdAt = new Date().toISOString();
  skill.isCustom = true;
  
  skills.push(skill);
  return saveCustomSkills(skills) ? skill : null;
};

// Update an existing custom skill
export const updateCustomSkill = (skillId, updates) => {
  const skills = loadCustomSkills();
  const index = skills.findIndex(s => s.id === skillId);
  
  if (index === -1) return false;
  
  skills[index] = {
    ...skills[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return saveCustomSkills(skills);
};

// Delete a custom skill
export const deleteCustomSkill = (skillId) => {
  const skills = loadCustomSkills();
  const filtered = skills.filter(s => s.id !== skillId);
  
  if (filtered.length === skills.length) return false;
  
  return saveCustomSkills(filtered);
};

// Get custom skill by ID
export const getCustomSkillById = (skillId) => {
  const skills = loadCustomSkills();
  return skills.find(s => s.id === skillId);
};

// Export all skills to JSON
export const exportSkills = () => {
  const skills = loadCustomSkills();
  const dataStr = JSON.stringify(skills, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bonzo-skills-${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

// Import skills from JSON
export const importSkills = (jsonString) => {
  try {
    const importedSkills = JSON.parse(jsonString);
    
    if (!Array.isArray(importedSkills)) {
      throw new Error('Invalid skills format');
    }
    
    const existingSkills = loadCustomSkills();
    
    // Merge imported skills with existing (avoid duplicates by ID)
    const merged = [...existingSkills];
    
    importedSkills.forEach(imported => {
      const exists = merged.find(s => s.id === imported.id);
      if (!exists) {
        imported.isCustom = true;
        imported.importedAt = new Date().toISOString();
        merged.push(imported);
      }
    });
    
    return saveCustomSkills(merged) ? merged.length - existingSkills.length : 0;
  } catch (error) {
    console.error('Failed to import skills:', error);
    throw error;
  }
};

// Validate skill object
export const validateSkill = (skill) => {
  const errors = [];
  
  if (!skill.name || skill.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!skill.description || skill.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!skill.systemPrompt || skill.systemPrompt.trim().length === 0) {
    errors.push('System prompt is required');
  }
  
  if (skill.name && skill.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (skill.description && skill.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
