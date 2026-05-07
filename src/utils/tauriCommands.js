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

export const readDirRecursive = async (path) => {
  try {
    return await invoke('read_dir_recursive', { pathStr: path });
  } catch (error) {
    console.error('Failed to read directory recursively:', error);
    throw error;
  }
};

export const createFile = async (path, content = '') => {
  try {
    return await invoke('create_file', { pathStr: path, content });
  } catch (error) {
    console.error('Failed to create file:', error);
    throw error;
  }
};

export const createFolder = async (path) => {
  try {
    return await invoke('create_folder', { pathStr: path });
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
};

export const deletePath = async (path) => {
  try {
    return await invoke('delete_path', { pathStr: path });
  } catch (error) {
    console.error('Failed to delete path:', error);
    throw error;
  }
};

export const renamePath = async (oldPath, newPath) => {
  try {
    return await invoke('rename_path', { oldPath, newPath });
  } catch (error) {
    console.error('Failed to rename path:', error);
    throw error;
  }
};

export const executeCode = async (command, workingDir) => {
  try {
    return await invoke('execute_code', { command, workingDir });
  } catch (error) {
    console.error('Failed to execute code:', error);
    throw error;
  }
};

