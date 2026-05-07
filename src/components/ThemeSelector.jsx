import React, { useState, useEffect } from 'react';
import { AVAILABLE_THEMES, getCurrentTheme, loadAndApplyTheme } from '../utils/themeLoader';
import './ThemeSelector.css';

/**
 * ThemeSelector Component
 * 
 * Allows users to select and apply themes from AVAILABLE_THEMES.
 * Displays live preview of current theme colors.
 */
export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState(getCurrentTheme());
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update current theme when component mounts
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    setError(null);
  };

  const handleLoadTheme = async () => {
    if (selectedTheme === currentTheme) {
      return; // Already loaded
    }

    setIsLoading(true);
    setError(null);

    try {
      await loadAndApplyTheme(selectedTheme);
      setCurrentTheme(selectedTheme);
      console.log(`✓ Theme loaded: ${selectedTheme}`);
    } catch (err) {
      console.error('Failed to load theme:', err);
      setError(`Failed to load theme: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDefault = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loadAndApplyTheme('techdev-dark');
      setSelectedTheme('techdev-dark');
      setCurrentTheme('techdev-dark');
      console.log('✓ Theme reset to default');
    } catch (err) {
      console.error('Failed to reset theme:', err);
      setError(`Failed to reset theme: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeDescription = (themeName) => {
    const descriptions = {
      'warp': 'Purple accent, classic dark theme',
      'techdev-dark': 'MongoDB green, TechDev default',
      'lamborghini-aggressive': 'Gold accent, pure black, hexagonal feel',
      'terminal-neon': 'Neon green, MongoDB teal-black, terminal-focused',
      'vercel-minimal': 'Vercel Blue, workflow colors, minimal shadows'
    };
    return descriptions[themeName] || 'Custom theme';
  };

  return (
    <div className="theme-selector">
      <div className="theme-selector-header">
        <h3>▸ Theme Selection</h3>
        <div className="current-theme-indicator">
          Current: <span className="theme-name">{currentTheme}</span>
        </div>
      </div>

      <div className="theme-dropdown-section">
        <label htmlFor="theme-select">Select Theme:</label>
        <select 
          id="theme-select"
          value={selectedTheme} 
          onChange={(e) => handleThemeChange(e.target.value)}
          disabled={isLoading}
        >
          {AVAILABLE_THEMES.map(theme => (
            <option key={theme} value={theme}>
              {theme} {theme === currentTheme ? '✓' : ''}
            </option>
          ))}
        </select>
        <p className="theme-description">{getThemeDescription(selectedTheme)}</p>
      </div>

      <div className="theme-actions">
        <button 
          onClick={handleLoadTheme}
          disabled={isLoading || selectedTheme === currentTheme}
          className="btn-load"
        >
          {isLoading ? '⏳ Loading...' : 'Load Theme'}
        </button>
        <button 
          onClick={handleResetDefault}
          disabled={isLoading}
          className="btn-reset"
        >
          Reset to Default
        </button>
      </div>

      {error && (
        <div className="theme-error">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="theme-preview">
        <h4>▪ Live Preview</h4>
        <div className="preview-card">
          <div className="preview-row">
            <span className="preview-label">Accent:</span>
            <div 
              className="preview-swatch" 
              style={{ 
                background: 'var(--accent)',
                boxShadow: 'var(--shadow-flat)'
              }}
            />
          </div>
          <div className="preview-row">
            <span className="preview-label">Success:</span>
            <div 
              className="preview-swatch" 
              style={{ 
                background: 'var(--success)',
                boxShadow: 'var(--shadow-flat)'
              }}
            />
          </div>
          <div className="preview-row">
            <span className="preview-label">Error:</span>
            <div 
              className="preview-swatch" 
              style={{ 
                background: 'var(--error)',
                boxShadow: 'var(--shadow-flat)'
              }}
            />
          </div>
          <div className="preview-row">
            <span className="preview-label">Warning:</span>
            <div 
              className="preview-swatch" 
              style={{ 
                background: 'var(--warning)',
                boxShadow: 'var(--shadow-flat)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
