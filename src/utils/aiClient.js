import { invoke } from '@tauri-apps/api/tauri';
import { callOpenRouter, testOpenRouterConnection } from './providers/openrouter';
import { callGemini, testGeminiConnection } from './providers/gemini';
import { callMistral, testMistralConnection } from './providers/mistral';
import { callCohere, testCohereConnection } from './providers/cohere';
import { callOllama, testOllamaConnection } from './providers/ollama';

export const callOpenAI = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_openai_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

export const callClaude = async (apiKey, model, messages) => {
  try {
    const response = await invoke('call_claude_api', {
      apiKey,
      model,
      messages,
    });
    return response;
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
};

export const testOpenAIConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callOpenAI(apiKey, 'gpt-3.5-turbo', messages);
    return true;
  } catch (error) {
    return false;
  }
};

export const testClaudeConnection = async (apiKey) => {
  try {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    await callClaude(apiKey, 'claude-3-sonnet-20240229', messages);
    return true;
  } catch (error) {
    return false;
  }
};

// Export provider functions
export { callOpenRouter, testOpenRouterConnection };
export { callGemini, testGeminiConnection };
export { callMistral, testMistralConnection };
export { callCohere, testCohereConnection };
export { callOllama, testOllamaConnection };

// Unified AI call function
export const callAI = async (provider, apiKey, model, messages, baseUrl = null) => {
  switch (provider) {
    case 'openai':
      return await callOpenAI(apiKey, model, messages);
    case 'claude':
      return await callClaude(apiKey, model, messages);
    case 'openrouter':
      return await callOpenRouter(apiKey, model, messages);
    case 'gemini':
      return await callGemini(apiKey, model, messages);
    case 'mistral':
      return await callMistral(apiKey, model, messages);
    case 'cohere':
      return await callCohere(apiKey, model, messages);
    case 'ollama':
      return await callOllama(baseUrl || 'http://localhost:11434', model, messages);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};
