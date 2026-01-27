import { invoke } from '@tauri-apps/api/tauri';

// Default Ollama models (can be auto-detected)
export const DEFAULT_OLLAMA_MODELS = [
  { id: 'llama2', name: 'Llama 2' },
  { id: 'llama3', name: 'Llama 3' },
  { id: 'codellama', name: 'Code Llama' },
  { id: 'mistral', name: 'Mistral' },
  { id: 'mixtral', name: 'Mixtral' },
  { id: 'phi', name: 'Phi' },
  { id: 'gemma', name: 'Gemma' },
  { id: 'qwen', name: 'Qwen' },
];

export const callOllama = async (baseUrl, model, messages) => {
  try {
    const response = await invoke('call_ollama_api', {
      baseUrl,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('Ollama API call failed:', error);
    throw error;
  }
};

export const getOllamaModels = async (baseUrl) => {
  try {
    const models = await invoke('get_ollama_models', {
      baseUrl,
    });
    return models;
  } catch (error) {
    console.error('Failed to get Ollama models:', error);
    return [];
  }
};

export const testOllamaConnection = async (baseUrl) => {
  try {
    await getOllamaModels(baseUrl);
    return true;
  } catch (error) {
    return false;
  }
};
