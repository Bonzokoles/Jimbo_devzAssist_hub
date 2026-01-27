import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiZap } from 'react-icons/fi';
import useStore from '../store/useStore';
import { callOpenAI, callClaude, callOpenRouter } from '../utils/aiClient';
import './AIAssistant.css';

const AIAssistant = () => {
  const { 
    openaiKey, 
    claudeKey, 
    openrouterKey, 
    selectedModels, 
    setSelectedModel,
    toggleSettings, 
    currentFileContent 
  } = useStore();
  const [provider, setProvider] = useState('openai');
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

  const hasApiKey = 
    provider === 'openai' ? openaiKey : 
    provider === 'claude' ? claudeKey : 
    openrouterKey;

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
      let response;

      if (provider === 'openai') {
        response = await callOpenAI(
          openaiKey,
          selectedModels.openai,
          chatMessages
        );
      } else if (provider === 'claude') {
        response = await callClaude(
          claudeKey,
          selectedModels.claude,
          chatMessages
        );
      } else if (provider === 'openrouter') {
        response = await callOpenRouter(
          openrouterKey,
          selectedModels.openrouter,
          chatMessages
        );
      }

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
            <p>No API key configured for {provider === 'openai' ? 'OpenAI' : 'Claude'}.</p>
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
          <button
            className={`provider-btn ${provider === 'openai' ? 'active' : ''}`}
            onClick={() => setProvider('openai')}
            disabled={!openaiKey}
          >
            OpenAI
          </button>
          <button
            className={`provider-btn ${provider === 'claude' ? 'active' : ''}`}
            onClick={() => setProvider('claude')}
            disabled={!claudeKey}
          >
            Claude
          </button>
          <button
            className={`provider-btn ${provider === 'openrouter' ? 'active' : ''}`}
            onClick={() => setProvider('openrouter')}
            disabled={!openrouterKey}
          >
            OpenRouter
          </button>
        </div>
        <div className="model-selector-mini">
           {provider === 'openai' && (
             <select value={selectedModels.openai} onChange={(e) => setSelectedModel('openai', e.target.value)}>
               <option value="gpt-4">GPT-4</option>
               <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
               <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
             </select>
           )}
           {provider === 'claude' && (
             <select value={selectedModels.claude} onChange={(e) => setSelectedModel('claude', e.target.value)}>
               <option value="claude-3-opus-20240229">Claude 3 Opus</option>
               <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
               <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
             </select>
           )}
           {provider === 'openrouter' && (
             <select value={selectedModels.openrouter} onChange={(e) => setSelectedModel('openrouter', e.target.value)}>
               <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
               <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
               <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B</option>
               <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
               <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</option>
             </select>
           )}
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
