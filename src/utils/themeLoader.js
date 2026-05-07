/**
 * Theme Loader Utility
 * 
 * Loads and applies theme JSON files to the application.
 * Converts theme vars to CSS custom properties for use throughout the app.
 * 
 * Based on pi-mono coding-agent schema with TechDev extensions.
 */

/**
 * Available themes in src/themes/
 */
export const AVAILABLE_THEMES = [
  'warp',
  'techdev-dark'
];

/**
 * Default theme configuration
 */
const DEFAULT_THEME = 'techdev-dark';

/**
 * Load a theme by name
 * @param {string} themeName - Name of theme file (without .json)
 * @returns {Promise<Object>} Theme data
 */
export async function loadTheme(themeName = DEFAULT_THEME) {
  try {
    // Vite serves src/ files from root, so /themes/file.json maps to src/themes/file.json
    const response = await fetch(`/themes/${themeName}.json`);
    if (!response.ok) {
      throw new Error(`Theme not found: ${themeName}`);
    }
    const themeData = await response.json();
    console.log(`✓ Loaded theme: ${themeName}`, themeData);
    return themeData;
  } catch (error) {
    console.error(`Failed to load theme ${themeName}:`, error);
    // Fallback to default theme if available
    if (themeName !== DEFAULT_THEME) {
      console.log(`Falling back to ${DEFAULT_THEME}`);
      return loadTheme(DEFAULT_THEME);
    }
    throw error;
  }
}

/**
 * Apply theme variables to CSS custom properties
 * @param {Object} themeData - Theme JSON data
 */
export function applyThemeVars(themeData) {
  const root = document.documentElement;
  
  // Apply color vars from theme.vars
  if (themeData.vars) {
    Object.entries(themeData.vars).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
    console.log(`✓ Applied ${Object.keys(themeData.vars).length} theme variables`);
  }
  
  // Apply export vars (page backgrounds, etc.)
  if (themeData.export) {
    Object.entries(themeData.export).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
    console.log(`✓ Applied ${Object.keys(themeData.export).length} export variables`);
  }
  
  // Set TechDev border-radius enforcement
  root.style.setProperty('--border-radius', '0px');
  root.style.setProperty('--border-radius-small', '0px');
  root.style.setProperty('--border-radius-medium', '0px');
  root.style.setProperty('--border-radius-large', '0px');
  
  // Store current theme name in localStorage
  localStorage.setItem('jimbo-current-theme', themeData.name);
  console.log(`✓ Theme applied: ${themeData.name}`);
}

/**
 * Load and apply theme in one call
 * @param {string} themeName - Name of theme to load and apply
 */
export async function loadAndApplyTheme(themeName = DEFAULT_THEME) {
  try {
    const themeData = await loadTheme(themeName);
    applyThemeVars(themeData);
    return themeData;
  } catch (error) {
    console.error('Failed to load and apply theme:', error);
    throw error;
  }
}

/**
 * Get currently active theme name from localStorage
 * @returns {string} Current theme name
 */
export function getCurrentTheme() {
  return localStorage.getItem('jimbo-current-theme') || DEFAULT_THEME;
}

/**
 * Initialize theme system on app load
 * Loads last used theme from localStorage or defaults to techdev-dark
 */
export async function initThemeSystem() {
  const currentTheme = getCurrentTheme();
  console.log(`🎨 Initializing theme system with: ${currentTheme}`);
  
  try {
    await loadAndApplyTheme(currentTheme);
    console.log('✓ Theme system initialized');
  } catch (error) {
    console.error('Theme system initialization failed:', error);
  }
}

/**
 * Get theme variable value
 * @param {string} varName - Variable name (e.g., 'accent', 'cyan', 'pageBg')
 * @returns {string} CSS variable value
 */
export function getThemeVar(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${varName}`)
    .trim();
}

/**
 * Export for React components to easily switch themes
 */
export default {
  AVAILABLE_THEMES,
  loadTheme,
  applyThemeVars,
  loadAndApplyTheme,
  getCurrentTheme,
  initThemeSystem,
  getThemeVar
};
