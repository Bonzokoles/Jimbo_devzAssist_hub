import { invoke } from '@tauri-apps/api/tauri';

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
