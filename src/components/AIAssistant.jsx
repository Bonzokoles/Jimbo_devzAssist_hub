import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiZap } from 'react-icons/fi';
import useStore from '../store/useStore';
import { callAI } from '../utils/aiClient';
import { OPENROUTER_MODELS } from '../utils/providers/openrouter';
import { GEMINI_MODELS } from '../utils/providers/gemini';
import { MISTRAL_MODELS } from '../utils/providers/mistral';
import { COHERE_MODELS } from '../utils/providers/cohere';
import { DEFAULT_OLLAMA_MODELS } from '../utils/providers/ollama';
import './AIAssistant.css';

const AIAssistant = () => {
  const { 
    openaiKey, claudeKey, openrouterKey, geminiKey, mistralKey, cohereKey, ollamaUrl,
    toggleSettings, currentFileContent 
  } = useStore();
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Model options for each provider
  const getModelOptions = () => {
    switch (provider) {
      case 'openai':
        return [
          { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
          { id: 'gpt-4', name: 'GPT-4' },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        ];
      case 'claude':
        return [
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
        ];
      case 'openrouter':
        return OPENROUTER_MODELS;
      case 'gemini':
        return GEMINI_MODELS;
      case 'mistral':
        return MISTRAL_MODELS;
      case 'cohere':
        return COHERE_MODELS;
      case 'ollama':
        return DEFAULT_OLLAMA_MODELS;
      default:
        return [];
    }
  };

  // Get current API key based on provider
  const getCurrentApiKey = () => {
    switch (provider) {
      case 'openai':
        return openaiKey;
      case 'claude':
        return claudeKey;
      case 'openrouter':
        return openrouterKey;
      case 'gemini':
        return geminiKey;
      case 'mistral':
        return mistralKey;
      case 'cohere':
        return cohereKey;
      case 'ollama':
        return true; // Ollama doesn't need an API key
      default:
        return null;
    }
  };

  const hasApiKey = getCurrentApiKey();

  // Update model when provider changes
  useEffect(() => {
    const defaultModels = {
      openai: 'gpt-3.5-turbo',
      claude: 'claude-3-sonnet-20240229',
      openrouter: 'openai/gpt-3.5-turbo',
      gemini: 'gemini-pro',
      mistral: 'mistral-small-latest',
      cohere: 'command',
      ollama: 'llama2',
    };
    setModel(defaultModels[provider] || '');
  }, [provider]);

  const handleSend = async () => {
    if (!input.trim() || !hasApiKey) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatMessages = [...messages, userMessage];
      const currentApiKey = getCurrentApiKey();
      
      const response = await callAI(
        provider,
        currentApiKey,
        model,
        chatMessages,
        provider === 'ollama' ? ollamaUrl : null
      );

      const assistantMessage = {
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI API Error:', err);
      setError('Failed to get response: ' + err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    let prompt = '';
    switch (action) {
      case 'explain':
        prompt = currentFileContent
          ? `Explain this code:\n\n${currentFileContent}`
          : 'Explain how to write clean code.';
        break;
      case 'bugs':
        prompt = currentFileContent
          ? `Find bugs in this code:\n\n${currentFileContent}`
          : 'What are common coding bugs to watch out for?';
        break;
      case 'optimize':
        prompt = currentFileContent
          ? `Optimize this code:\n\n${currentFileContent}`
          : 'Give me tips on code optimization.';
        break;
      default:
        return;
    }
    setInput(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get provider display name
  const getProviderName = () => {
    const names = {
      openai: 'OpenAI',
      claude: 'Claude',
      openrouter: 'OpenRouter',
      gemini: 'Google Gemini',
      mistral: 'Mistral AI',
      cohere: 'Cohere',
      ollama: 'Ollama (Local)',
    };
    return names[provider] || provider;
  };

  if (!hasApiKey) {
    return (
      <div className="ai-assistant">
        <div className="ai-header">
          <h2>
            <FiZap />
            AI Assistant
          </h2>
        </div>
        <div className="ai-messages">
          <div className="no-api-key">
            <p>No API key configured for {getProviderName()}.</p>
            <p>Please configure your API keys in Settings.</p>
            <button className="neon-button" onClick={toggleSettings}>
              Open Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>
          <FiZap />
          AI Assistant
        </h2>
        <div className="ai-provider-selector">
          <select 
            className="provider-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="openai" disabled={!openaiKey}>OpenAI</option>
            <option value="claude" disabled={!claudeKey}>Claude</option>
            <option value="openrouter" disabled={!openrouterKey}>OpenRouter</option>
            <option value="gemini" disabled={!geminiKey}>Google Gemini</option>
            <option value="mistral" disabled={!mistralKey}>Mistral AI</option>
            <option value="cohere" disabled={!cohereKey}>Cohere</option>
            <option value="ollama">Ollama (Local)</option>
          </select>
          <select 
            className="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {getModelOptions().map((modelOption) => (
              <option key={modelOption.id} value={modelOption.id}>
                {modelOption.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="no-api-key">
            <p>Hello! I'm your AI assistant.</p>
            <p>How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-role">{msg.role}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="ai-quick-actions">
        <button className="quick-action-btn" onClick={() => handleQuickAction('explain')}>
          Explain Code
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('bugs')}>
          Find Bugs
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('optimize')}>
          Optimize
        </button>
      </div>

      <div className="ai-input-area">
        <div className="ai-input-wrapper">
          <textarea
            className="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
