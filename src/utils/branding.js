// Custom Branding Utilities

/**
 * Load custom logo from localStorage
 * @returns {string|null} Logo data URL or null if not set
 */
export const loadCustomLogo = () => {
  try {
    const logo = localStorage.getItem('bonzo_custom_logo');
    return logo || null;
  } catch (error) {
    console.error('Failed to load custom logo:', error);
    return null;
  }
};

/**
 * Save custom logo to localStorage
 * @param {string} logoData - Base64 encoded logo data or file path
 * @returns {boolean} Success status
 */
export const saveCustomLogo = (logoData) => {
  try {
    localStorage.setItem('bonzo_custom_logo', logoData);
    return true;
  } catch (error) {
    console.error('Failed to save custom logo:', error);
    return false;
  }
};

/**
 * Reset logo to default
 * @returns {boolean} Success status
 */
export const resetLogo = () => {
  try {
    localStorage.removeItem('bonzo_custom_logo');
    return true;
  } catch (error) {
    console.error('Failed to reset logo:', error);
    return false;
  }
};

/**
 * Validate logo file
 * @param {File} file - Logo file to validate
 * @returns {object} Validation result
 */
export const validateLogoFile = (file) => {
  const errors = [];
  
  // Check file type (SVG only)
  if (!file.type.includes('svg')) {
    errors.push('Only SVG files are supported');
  }
  
  // Check file size (max 500KB)
  const maxSize = 500 * 1024; // 500KB
  if (file.size > maxSize) {
    errors.push('File size must be less than 500KB');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Convert file to data URL
 * @param {File} file - Logo file
 * @returns {Promise<string>} Data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get current branding configuration
 * @returns {object} Branding config
 */
export const getBrandingConfig = () => {
  try {
    const stored = localStorage.getItem('bonzo_branding_config');
    if (!stored) {
      return {
        customLogo: null,
        appName: 'BONZO DevAssist',
        primaryColor: '#00f0ff',
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get branding config:', error);
    return {
      customLogo: null,
      appName: 'BONZO DevAssist',
      primaryColor: '#00f0ff',
    };
  }
};

/**
 * Save branding configuration
 * @param {object} config - Branding config
 * @returns {boolean} Success status
 */
export const saveBrandingConfig = (config) => {
  try {
    localStorage.setItem('bonzo_branding_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save branding config:', error);
    return false;
  }
};
