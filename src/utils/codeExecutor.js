import { invoke } from '@tauri-apps/api/tauri';

export const executeCode = async (filePath, language, workingDir) => {
  // Determine command based on language/file extension
  let command;
  
  if (language === 'javascript' || filePath.endsWith('.js')) {
    command = `node "${filePath}"`;
  } else if (language === 'python' || filePath.endsWith('.py')) {
    command = `python "${filePath}"`;
  } else if (language === 'rust' || filePath.endsWith('.rs')) {
    // For Rust, we need to compile first
    const exeName = filePath.replace('.rs', '');
    command = `rustc "${filePath}" -o "${exeName}" && "${exeName}"`;
  } else if (language === 'java' || filePath.endsWith('.java')) {
    const className = filePath.split(/[/\\]/).pop().replace('.java', '');
    command = `javac "${filePath}" && java ${className}`;
  } else if (language === 'go' || filePath.endsWith('.go')) {
    command = `go run "${filePath}"`;
  } else if (language === 'cpp' || filePath.endsWith('.cpp')) {
    const exeName = filePath.replace('.cpp', '');
    command = `g++ "${filePath}" -o "${exeName}" && "${exeName}"`;
  } else {
    throw new Error(`Language ${language} not supported for execution`);
  }

  try {
    const result = await invoke('execute_code', { 
      command, 
      workingDir 
    });
    return result;
  } catch (error) {
    throw new Error(`Execution failed: ${error}`);
  }
};
