import { invoke } from '@tauri-apps/api/tauri';

const isTauri = window.__TAURI_IPC__ !== undefined;

export const callOpenAI = async (apiKey, model, messages) => {
  try {
    if (isTauri) {
      return await invoke('call_openai_api', { apiKey, model, messages });
    } else {
      // Web Mode: Direct fetch
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages })
      });
      const data = await response.json();
      if (data.error) throw data.error;
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

export const callClaude = async (apiKey, model, messages) => {
  try {
    if (isTauri) {
      return await invoke('call_claude_api', { apiKey, model, messages });
    } else {
      // Web Mode: Direct fetch (May hit CORS, warned user)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
          'dangerouslyAllowBrowser': 'true' // Some libs need this
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages
        })
      });
      const data = await response.json();
      if (data.error) throw data.error;
      return data.content[0].text;
    }
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
};

export const callOpenRouter = async (apiKey, model, messages) => {
  try {
    // OpenRouter works well with fetch in both environments
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/Bonzokoles/Jimbo_devzAssist_hub',
        'X-Title': 'JIMBO DevAssist'
      },
      body: JSON.stringify({ model, messages })
    });
    const data = await response.json();
    if (data.error) throw data.error;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
};

export const testOpenRouterConnection = async (apiKey) => {
  try {
    await callOpenRouter(apiKey, 'openai/gpt-3.5-turbo', [{ role: 'user', content: 'Hello' }]);
    return true;
  } catch (error) {
    return false;
  }
};

export const testOpenAIConnection = async (apiKey) => {
  try {
    await callOpenAI(apiKey, 'gpt-3.5-turbo', [{ role: 'user', content: 'Hello' }]);
    return true;
  } catch (error) {
    return false;
  }
};

export const testClaudeConnection = async (apiKey) => {
  try {
    await callClaude(apiKey, 'claude-3-haiku-20240307', [{ role: 'user', content: 'Hello' }]);
    return true;
  } catch (error) {
    return false;
  }
};
