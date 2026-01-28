import React, { useState } from 'react';
import { FiPackage, FiSearch, FiBox, FiCpu } from 'react-icons/fi';
import PackageSearch from './PackageSearch';
import PackageCard from './PackageCard';
import { callAI } from '../utils/aiClient';
import useStore from '../store/useStore';
import './LibrariesManager.css';

const LibrariesManager = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  
  const { openaiKey, claudeKey, geminiKey, mistralKey } = useStore();

  // Mock installed packages (in production, this would be fetched from the system)
  const installedPackages = [
    {
      name: 'react',
      version: '18.2.0',
      description: 'A JavaScript library for building user interfaces',
      author: 'React Team',
      license: 'MIT',
      keywords: ['react', 'ui', 'components'],
    },
    {
      name: 'zustand',
      version: '4.4.1',
      description: 'A small, fast and scalable bearbones state-management solution',
      author: 'Poimandres',
      license: 'MIT',
      keywords: ['state', 'management', 'react'],
    },
    {
      name: 'react-icons',
      version: '4.11.0',
      description: 'Popular icons for React',
      author: 'react-icons',
      license: 'MIT',
      keywords: ['icons', 'react', 'svg'],
    },
  ];

  const tabs = [
    { id: 'search', label: 'Search Packages', icon: FiSearch },
    { id: 'installed', label: 'Installed', icon: FiBox },
    { id: 'ai', label: 'AI Recommendations', icon: FiCpu },
  ];

  const getAIProvider = () => {
    if (openaiKey) return { provider: 'openai', apiKey: openaiKey, model: 'gpt-4' };
    if (claudeKey) return { provider: 'claude', apiKey: claudeKey, model: 'claude-3-sonnet-20240229' };
    if (geminiKey) return { provider: 'gemini', apiKey: geminiKey, model: 'gemini-pro' };
    if (mistralKey) return { provider: 'mistral', apiKey: mistralKey, model: 'mistral-large-latest' };
    return null;
  };

  const handleAIRecommendation = async () => {
    if (!aiPrompt.trim()) return;

    const aiConfig = getAIProvider();
    if (!aiConfig) {
      alert('Please configure an AI provider in Settings first');
      return;
    }

    setIsLoadingAI(true);
    try {
      const messages = [
        {
          role: 'user',
          content: `You are a software development expert. The user is asking for library/package recommendations.

User question: ${aiPrompt}

Please provide 3-5 recommended packages/libraries. For each recommendation, provide:
1. Package name (exact name as it appears in npm/pip/cargo/etc.)
2. A brief description (1-2 sentences)
3. Key pros
4. Key cons
5. When to use it

Format your response as a JSON array like this:
[
  {
    "name": "package-name",
    "description": "Brief description",
    "pros": ["Pro 1", "Pro 2"],
    "cons": ["Con 1", "Con 2"],
    "whenToUse": "Explanation of when to use this package",
    "packageManager": "npm" // or "pip", "cargo", etc.
  }
]

Only return the JSON array, no other text.`
        }
      ];

      const response = await callAI(
        aiConfig.provider,
        aiConfig.apiKey,
        aiConfig.model,
        messages
      );

      // Parse the AI response
      let recommendations;
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback: create a simple recommendation object
        recommendations = [{
          name: 'recommendation',
          description: response.substring(0, 200),
          pros: ['See full response for details'],
          cons: [],
          whenToUse: 'Check AI response for guidance',
          packageManager: 'npm'
        }];
      }

      setAiRecommendations({
        query: aiPrompt,
        packages: recommendations,
        rawResponse: response
      });
    } catch (error) {
      console.error('AI recommendation failed:', error);
      alert('Failed to get AI recommendations. Please try again.');
    } finally {
      setIsLoadingAI(false);
      setShowAIPrompt(false);
    }
  };

  const handleOpenAIPrompt = () => {
    setShowAIPrompt(true);
    setActiveTab('ai');
  };

  return (
    <div className="libraries-manager">
      <div className="libraries-header">
        <div className="header-content">
          <FiPackage className="header-icon" size={32} />
          <div>
            <h1 className="header-title neon-text cyan">Libraries Manager</h1>
            <p className="header-subtitle">Search, install, and manage packages</p>
          </div>
        </div>
      </div>

      <div className="libraries-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="libraries-content">
        {activeTab === 'search' && (
          <PackageSearch onAskAI={handleOpenAIPrompt} />
        )}

        {activeTab === 'installed' && (
          <div className="installed-packages">
            <div className="installed-header">
              <h2>Installed Packages</h2>
              <div className="installed-count">{installedPackages.length} packages</div>
            </div>
            <div className="installed-grid">
              {installedPackages.map((pkg, index) => (
                <PackageCard
                  key={`installed-${pkg.name}-${index}`}
                  pkg={pkg}
                  onInstall={() => {}}
                  onViewDetails={(p) => console.log('View details:', p)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-recommendations">
            <div className="ai-prompt-section">
              <h2 className="neon-text purple">🤖 AI Package Advisor</h2>
              <p className="ai-subtitle">
                Ask AI to recommend the best libraries for your needs
              </p>

              <div className="ai-input-wrapper">
                <textarea
                  className="ai-prompt-input"
                  placeholder="E.g., What library should I use for state management in React?"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
                <button
                  className="ai-submit-button neon-button pink"
                  onClick={handleAIRecommendation}
                  disabled={isLoadingAI || !aiPrompt.trim()}
                >
                  {isLoadingAI ? 'Analyzing...' : 'Get Recommendations'}
                </button>
              </div>
            </div>

            {isLoadingAI && (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>AI is analyzing your request...</p>
              </div>
            )}

            {aiRecommendations && !isLoadingAI && (
              <div className="ai-results">
                <div className="ai-results-header">
                  <h3>Recommendations for: "{aiRecommendations.query}"</h3>
                </div>
                
                <div className="ai-recommendations-grid">
                  {aiRecommendations.packages.map((rec, index) => (
                    <div key={index} className="ai-recommendation-card glass-card">
                      <h3 className="neon-text cyan">{rec.name}</h3>
                      <p className="rec-description">{rec.description}</p>
                      
                      <div className="rec-section">
                        <h4 className="rec-section-title">✅ Pros</h4>
                        <ul className="rec-list">
                          {rec.pros.map((pro, i) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>

                      {rec.cons && rec.cons.length > 0 && (
                        <div className="rec-section">
                          <h4 className="rec-section-title">⚠️ Cons</h4>
                          <ul className="rec-list">
                            {rec.cons.map((con, i) => (
                              <li key={i}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="rec-section">
                        <h4 className="rec-section-title">💡 When to Use</h4>
                        <p className="rec-when-to-use">{rec.whenToUse}</p>
                      </div>

                      <div className="rec-footer">
                        <div className="rec-package-manager">{rec.packageManager}</div>
                        <button className="neon-button cyan">Install</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrariesManager;
