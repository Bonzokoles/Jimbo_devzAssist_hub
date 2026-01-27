import { invoke } from '@tauri-apps/api/tauri';

// Available Gemini models
export const GEMINI_MODELS = [
  { id: 'gemini-pro', name: 'Gemini Pro' },
  { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
];

export const callGemini = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_gemini_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
};

export const testGeminiConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callGemini(apiKey, 'gemini-pro', messages);
    return true;
  } catch (error) {
    return false;
  }
};
