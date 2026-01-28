import { invoke } from '@tauri-apps/api/tauri';

// Available Mistral models
export const MISTRAL_MODELS = [
  { id: 'mistral-large-latest', name: 'Mistral Large' },
  { id: 'mistral-medium-latest', name: 'Mistral Medium' },
  { id: 'mistral-small-latest', name: 'Mistral Small' },
  { id: 'open-mistral-7b', name: 'Open Mistral 7B' },
  { id: 'open-mixtral-8x7b', name: 'Open Mixtral 8x7B' },
  { id: 'open-mixtral-8x22b', name: 'Open Mixtral 8x22B' },
];

export const callMistral = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_mistral_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('Mistral API call failed:', error);
    throw error;
  }
};

export const testMistralConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callMistral(apiKey, 'mistral-small-latest', messages);
    return true;
  } catch (error) {
    return false;
  }
};
