import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiZap } from 'react-icons/fi';
import useStore from '../store/useStore';
import { callOpenAI, callClaude } from '../utils/aiClient';
import './AIAssistant.css';

const AIAssistant = () => {
  const { openaiKey, claudeKey, toggleSettings, currentFileContent } = useStore();
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

  const hasApiKey = provider === 'openai' ? openaiKey : claudeKey;

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
          'gpt-3.5-turbo',
          chatMessages
        );
      } else {
        response = await callClaude(
          claudeKey,
          'claude-3-sonnet-20240229',
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
