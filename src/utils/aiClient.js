import { invoke } from '@tauri-apps/api/tauri';
import { loadSystemPrompt, loadWorkspacePrompt } from './prompts/promptStorage';

/**
 * Call AI with system and workspace prompts prepended
 */
export const callAI = async (provider, apiKey, model, userMessage, options = {}) => {
  const { 
    includeSystemPrompt = true, 
    includeWorkspacePrompt = true,
    projectPath = null 
  } = options;
  
  const messages = [];
  
  // Load and add system prompt
  if (includeSystemPrompt) {
    try {
      const systemPrompt = await loadSystemPrompt();
      if (systemPrompt && systemPrompt.trim()) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
    } catch (error) {
      console.warn('Failed to load system prompt:', error);
    }
  }
  
  // Load and add workspace prompt
  if (includeWorkspacePrompt && projectPath) {
    try {
      const workspacePrompt = await loadWorkspacePrompt(projectPath);
      if (workspacePrompt && workspacePrompt.trim()) {
        messages.push({
          role: 'system',
          content: `PROJECT CONTEXT:\n${workspacePrompt}`
        });
      }
    } catch (error) {
      console.warn('Failed to load workspace prompt:', error);
    }
  }
  
  // Add user message
  if (typeof userMessage === 'string') {
    messages.push({
      role: 'user',
      content: userMessage
    });
  } else if (Array.isArray(userMessage)) {
    // If userMessage is already an array of messages, append them
    messages.push(...userMessage);
  }
  
  // Call the appropriate provider
  if (provider === 'openai') {
    return await callOpenAI(apiKey, model, messages);
  } else if (provider === 'claude') {
    return await callClaude(apiKey, model, messages);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }
};

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
