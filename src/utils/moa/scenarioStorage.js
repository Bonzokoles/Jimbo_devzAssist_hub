/**
 * MOA Scenario Storage
 * Save, load, and manage MOA scenarios
 */
import { invoke } from '@tauri-apps/api/tauri';

/**
 * Save an MOA scenario
 */
export const saveMOAScenario = async (scenario) => {
  try {
    const scenarioJson = JSON.stringify(scenario);
    await invoke('save_moa_scenario', { scenario: scenarioJson });
    return true;
  } catch (error) {
    console.error('Failed to save MOA scenario:', error);
    throw error;
  }
};

/**
 * Load all MOA scenarios
 */
export const loadMOAScenarios = async () => {
  try {
    const scenarios = await invoke('load_moa_scenarios');
    if (!scenarios || scenarios.length === 0) {
      return [];
    }
    return scenarios.map(s => JSON.parse(s));
  } catch (error) {
    console.error('Failed to load MOA scenarios:', error);
    return [];
  }
};

/**
 * Delete an MOA scenario by name
 */
export const deleteMOAScenario = async (name) => {
  try {
    await invoke('delete_moa_scenario', { name });
    return true;
  } catch (error) {
    console.error('Failed to delete MOA scenario:', error);
    throw error;
  }
};

/**
 * Export scenario to JSON file
 */
export const exportScenario = (scenario) => {
  const dataStr = JSON.stringify(scenario, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `moa-scenario-${scenario.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import scenario from JSON file
 */
export const importScenario = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const scenario = JSON.parse(event.target.result);
          
          // Validate the imported scenario
          const validation = validateScenario(scenario);
          if (!validation.valid) {
            reject(new Error('Invalid scenario: ' + validation.errors.join(', ')));
            return;
          }
          
          resolve(scenario);
        } catch (error) {
          reject(new Error('Invalid JSON file: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
};

/**
 * Validate scenario structure
 */
export const validateScenario = (scenario) => {
  const errors = [];
  
  if (!scenario.name || scenario.name.trim() === '') {
    errors.push('Scenario name is required');
  }
  
  if (!scenario.strategy || !['sequential', 'parallel'].includes(scenario.strategy)) {
    errors.push('Invalid strategy (must be sequential or parallel)');
  }
  
  if (!scenario.models || !Array.isArray(scenario.models) || scenario.models.length === 0) {
    errors.push('At least one model is required');
  }
  
  if (scenario.models) {
    scenario.models.forEach((model, index) => {
      if (!model.role || model.role.trim() === '') {
        errors.push(`Model ${index + 1}: Role is required`);
      }
      if (!model.provider) {
        errors.push(`Model ${index + 1}: Provider is required`);
      }
      if (!model.model) {
        errors.push(`Model ${index + 1}: Model is required`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get default scenario template
 */
export const getDefaultScenario = () => {
  return {
    name: 'New Scenario',
    description: '',
    strategy: 'sequential',
    models: [
      {
        role: 'Assistant',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        systemPrompt: '',
        temperature: 0.7,
        maxTokens: 2000
      }
    ],
    aggregation: {
      enabled: false,
      provider: 'openai',
      model: 'gpt-4',
      prompt: 'Combine all responses into a final, coherent answer:'
    }
  };
};
