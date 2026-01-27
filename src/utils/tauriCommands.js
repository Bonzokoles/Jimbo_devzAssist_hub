import { invoke } from '@tauri-apps/api/tauri';

export const getSystemStats = async () => {
  try {
    return await invoke('get_system_stats');
  } catch (error) {
    console.error('Failed to get system stats:', error);
    throw error;
  }
};

export const cleanCache = async () => {
  try {
    return await invoke('clean_cache');
  } catch (error) {
    console.error('Failed to clean cache:', error);
    throw error;
  }
};

export const optimizeMemory = async () => {
  try {
    return await invoke('optimize_memory');
  } catch (error) {
    console.error('Failed to optimize memory:', error);
    throw error;
  }
};

export const saveAPIKey = async (provider, key) => {
  try {
    return await invoke('save_api_key', { provider, key });
  } catch (error) {
    console.error('Failed to save API key:', error);
    throw error;
  }
};

export const getAPIKey = async (provider) => {
  try {
    return await invoke('get_api_key', { provider });
  } catch (error) {
    console.error('Failed to get API key:', error);
    return '';
  }
};

export const readFileContent = async (path) => {
  try {
    return await invoke('read_file_content', { pathStr: path });
  } catch (error) {
    console.error('Failed to read file:', error);
    throw error;
  }
};

export const writeFileContent = async (path, content) => {
  try {
    return await invoke('write_file_content', { pathStr: path, content });
  } catch (error) {
    console.error('Failed to write file:', error);
    throw error;
  }
};

export const readDir = async (path) => {
  try {
    return await invoke('read_dir', { pathStr: path });
  } catch (error) {
    console.error('Failed to read directory:', error);
    throw error;
  }
};
