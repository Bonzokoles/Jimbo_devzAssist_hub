/**
 * Storage utilities for system and workspace prompts
 */
import { invoke } from '@tauri-apps/api/tauri';

/**
 * Save system prompt
 */
export const saveSystemPrompt = async (prompt) => {
  try {
    await invoke('save_system_prompt', { prompt });
    return true;
  } catch (error) {
    console.error('Failed to save system prompt:', error);
    throw error;
  }
};

/**
 * Load system prompt
 */
export const loadSystemPrompt = async () => {
  try {
    const prompt = await invoke('load_system_prompt');
    return prompt || '';
  } catch (error) {
    console.error('Failed to load system prompt:', error);
    return '';
  }
};

/**
 * Save workspace prompt for a specific project
 */
export const saveWorkspacePrompt = async (projectPath, prompt) => {
  try {
    await invoke('save_workspace_prompt', { projectPath, prompt });
    return true;
  } catch (error) {
    console.error('Failed to save workspace prompt:', error);
    throw error;
  }
};

/**
 * Load workspace prompt for a specific project
 */
export const loadWorkspacePrompt = async (projectPath) => {
  try {
    const prompt = await invoke('load_workspace_prompt', { projectPath });
    return prompt || '';
  } catch (error) {
    console.error('Failed to load workspace prompt:', error);
    return '';
  }
};

/**
 * Save a custom system prompt preset
 */
export const savePromptPreset = async (name, prompt) => {
  try {
    await invoke('save_prompt_preset', { name, prompt });
    return true;
  } catch (error) {
    console.error('Failed to save prompt preset:', error);
    throw error;
  }
};

/**
 * Load all saved prompt presets
 */
export const loadPromptPresets = async () => {
  try {
    const presets = await invoke('load_prompt_presets');
    return presets || [];
  } catch (error) {
    console.error('Failed to load prompt presets:', error);
    return [];
  }
};

/**
 * Delete a custom prompt preset
 */
export const deletePromptPreset = async (name) => {
  try {
    await invoke('delete_prompt_preset', { name });
    return true;
  } catch (error) {
    console.error('Failed to delete prompt preset:', error);
    throw error;
  }
};

/**
 * Export prompts to JSON
 */
export const exportPrompts = async () => {
  try {
    const systemPrompt = await loadSystemPrompt();
    const presets = await loadPromptPresets();
    
    return {
      systemPrompt,
      customPresets: presets,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  } catch (error) {
    console.error('Failed to export prompts:', error);
    throw error;
  }
};

/**
 * Import prompts from JSON
 */
export const importPrompts = async (data) => {
  try {
    if (data.systemPrompt) {
      await saveSystemPrompt(data.systemPrompt);
    }
    
    if (data.customPresets && Array.isArray(data.customPresets)) {
      for (const preset of data.customPresets) {
        await savePromptPreset(preset.name, preset.prompt);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import prompts:', error);
    throw error;
  }
};
