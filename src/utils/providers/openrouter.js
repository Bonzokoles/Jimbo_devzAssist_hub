import { invoke } from '@tauri-apps/api/tauri';

// Available OpenRouter models
export const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'openai/gpt-4', name: 'GPT-4' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large' },
  { id: 'mistralai/mistral-medium', name: 'Mistral Medium' },
  { id: 'mistralai/mistral-small', name: 'Mistral Small' },
  { id: 'cohere/command-r-plus', name: 'Cohere Command R+' },
  { id: 'cohere/command-r', name: 'Cohere Command R' },
  { id: 'perplexity/llama-3-sonar-large-32k-online', name: 'Perplexity Sonar Large' },
  { id: 'databricks/dbrx-instruct', name: 'DBRX Instruct' },
  { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM 2 8x22B' },
  { id: 'qwen/qwen-2-72b-instruct', name: 'Qwen 2 72B' },
  { id: 'deepseek/deepseek-coder', name: 'DeepSeek Coder' },
];

export const callOpenRouter = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_openrouter_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
};

export const testOpenRouterConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callOpenRouter(apiKey, 'openai/gpt-3.5-turbo', messages);
    return true;
  } catch (error) {
    return false;
  }
};
