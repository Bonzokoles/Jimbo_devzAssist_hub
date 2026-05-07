import { 
  FiFile, 
  FiFolder
} from 'react-icons/fi';
import { 
  SiJavascript, 
  SiPython, 
  SiRust, 
  SiReact, 
  SiHtml5, 
  SiCss3,
  SiJson,
  SiMarkdown,
  SiTypescript,
  SiCplusplus,
  SiGo
} from 'react-icons/si';

export const getFileIcon = (file) => {
  if (file.is_dir) {
    return FiFolder;
  }
  
  const ext = file.name.split('.').pop().toLowerCase();
  
  const iconMap = {
    'js': SiJavascript,
    'jsx': SiReact,
    'ts': SiTypescript,
    'tsx': SiReact,
    'py': SiPython,
    'rs': SiRust,
    'html': SiHtml5,
    'css': SiCss3,
    'json': SiJson,
    'md': SiMarkdown,
    'cpp': SiCplusplus,
    'c': SiCplusplus,
    'h': SiCplusplus,
    'hpp': SiCplusplus,
    'java': FiFile, // Use generic file icon for Java
    'go': SiGo,
    'toml': FiFile,
    'yaml': FiFile,
    'yml': FiFile,
    'txt': FiFile,
  };
  
  return iconMap[ext] || FiFile;
};

export const getFolderIcon = (isOpen) => {
  return FiFolder; // Use same icon for open/closed folders
};
