import { invoke } from '@tauri-apps/api/tauri';

// Available Cohere models
export const COHERE_MODELS = [
  { id: 'command-r-plus', name: 'Command R+' },
  { id: 'command-r', name: 'Command R' },
  { id: 'command', name: 'Command' },
  { id: 'command-light', name: 'Command Light' },
];

export const callCohere = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_cohere_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('Cohere API call failed:', error);
    throw error;
  }
};

export const testCohereConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callCohere(apiKey, 'command', messages);
    return true;
  } catch (error) {
    return false;
  }
};
