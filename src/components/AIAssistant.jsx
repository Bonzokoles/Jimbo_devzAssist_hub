import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiZap, FiEdit2 } from 'react-icons/fi';
import useStore from '../store/useStore';
import { callOpenAI, callClaude } from '../utils/aiClient';
import { loadMOAScenarios } from '../utils/moa/scenarioStorage';
import { runMOAScenario } from '../utils/moa/scenarioRunner';
import { loadSystemPrompt, loadWorkspacePrompt } from '../utils/prompts/promptStorage';
import './AIAssistant.css';

const AIAssistant = () => {
  const { 
    openaiKey, 
    claudeKey, 
    toggleSettings, 
    currentFileContent,
    moaMode,
    selectedScenario,
    setMOAMode,
    setSelectedScenario,
    togglePromptEditor,
    currentProjectPath
  } = useStore();
  const [provider, setProvider] = useState('openai');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moaScenarios, setMoaScenarios] = useState([]);
  const [moaResults, setMoaResults] = useState(null);
  const [showMOAResults, setShowMOAResults] = useState(false);
  const [systemPromptPreview, setSystemPromptPreview] = useState('');
  const [workspacePromptPreview, setWorkspacePromptPreview] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const scenarios = await loadMOAScenarios();
        setMoaScenarios(scenarios);
      } catch (err) {
        console.error('Failed to load MOA scenarios:', err);
      }
    };
    loadScenarios();
  }, []);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const systemPrompt = await loadSystemPrompt();
        setSystemPromptPreview(systemPrompt);
      } catch (err) {
        console.error('Failed to load system prompt:', err);
      }
    };
    loadPrompts();
  }, []);

  useEffect(() => {
    const loadWorkspace = async () => {
      if (currentProjectPath) {
        try {
          const workspacePrompt = await loadWorkspacePrompt(currentProjectPath);
          setWorkspacePromptPreview(workspacePrompt);
        } catch (err) {
          console.error('Failed to load workspace prompt:', err);
        }
      }
    };
    loadWorkspace();
  }, [currentProjectPath]);

  const hasApiKey = provider === 'openai' ? openaiKey : claudeKey;

  const handleScenarioSelect = (e) => {
    const scenarioName = e.target.value;
    const scenario = moaScenarios.find(s => s.name === scenarioName);
    setSelectedScenario(scenario || null);
  };

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
      if (moaMode && selectedScenario) {
        // MOA Mode - use scenario runner
        const results = await runMOAScenario(
          selectedScenario,
          userMessage.content,
          { openai: openaiKey, claude: claudeKey }
        );
        
        setMoaResults(results);
        setShowMOAResults(true);

        // Add aggregated result to messages if available
        const aggregatedMessage = {
          role: 'assistant',
          content: results.aggregated || 'MOA processing complete. See results panel below.',
        };
        setMessages((prev) => [...prev, aggregatedMessage]);
      } else {
        // Normal mode
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
      }
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
        <div className="prompt-controls">
          <button 
            className="prompt-edit-btn" 
            onClick={() => togglePromptEditor('system')}
            title="Edit System Prompt"
          >
            <FiEdit2 /> System
          </button>
          <button 
            className="prompt-edit-btn" 
            onClick={() => togglePromptEditor('workspace')}
            title="Edit Workspace Prompt"
          >
            <FiEdit2 /> Workspace
          </button>
        </div>
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

      <div className="moa-mode-section">
        <label className="moa-mode-label">
          <input 
            type="checkbox" 
            checked={moaMode} 
            onChange={(e) => setMOAMode(e.target.checked)} 
          />
          <span>MOA Mode</span>
        </label>
        {moaMode && (
          <select 
            className="scenario-selector"
            value={selectedScenario?.name || ''} 
            onChange={handleScenarioSelect}
          >
            <option value="">-- Select Scenario --</option>
            {moaScenarios.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </select>
        )}
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

      {showMOAResults && moaResults && (
        <div className="moa-results">
          <div className="moa-results-header">
            <h3>MOA Results</h3>
            <button 
              className="close-results-btn"
              onClick={() => setShowMOAResults(false)}
            >
              ✕
            </button>
          </div>
          
          {moaResults.responses && moaResults.responses.length > 0 && (
            <div className="moa-individual-responses">
              <h4>Individual Model Responses</h4>
              {moaResults.responses.map((resp, idx) => (
                <div key={idx} className="moa-response-item">
                  <div className="moa-response-header">
                    <span className="moa-model-name">{resp.model}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => navigator.clipboard.writeText(resp.response)}
                      title="Copy response"
                    >
                      📋
                    </button>
                  </div>
                  <div className="moa-response-content">
                    {resp.response}
                  </div>
                </div>
              ))}
            </div>
          )}

          {moaResults.aggregated && (
            <div className="moa-aggregated-response">
              <h4>Aggregated Response</h4>
              <div className="moa-response-content">
                {moaResults.aggregated}
              </div>
              <button 
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(moaResults.aggregated)}
              >
                📋 Copy Aggregated
              </button>
            </div>
          )}
        </div>
      )}

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
