// Context Builder - Build context from various sources for AI

import { MCP_SOURCES } from './mcpClient';

// Build context from selected sources
export const buildContext = async (sources, data = {}) => {
  const contextParts = [];
  
  for (const source of sources) {
    switch (source) {
      case MCP_SOURCES.CURRENT_FILE:
        if (data.currentFile && data.currentFileContent) {
          contextParts.push({
            source: 'Current File',
            content: `File: ${data.currentFile}\n\n\`\`\`\n${data.currentFileContent}\n\`\`\``,
          });
        }
        break;
        
      case MCP_SOURCES.PROJECT_STRUCTURE:
        if (data.projectStructure) {
          contextParts.push({
            source: 'Project Structure',
            content: `Project Files:\n${data.projectStructure}`,
          });
        }
        break;
        
      case MCP_SOURCES.GIT_HISTORY:
        if (data.gitHistory) {
          contextParts.push({
            source: 'Git History',
            content: `Recent Commits:\n${data.gitHistory}`,
          });
        }
        break;
        
      case MCP_SOURCES.OPEN_TABS:
        if (data.openTabs) {
          contextParts.push({
            source: 'Open Tabs',
            content: `Currently Open:\n${data.openTabs.join('\n')}`,
          });
        }
        break;
        
      case MCP_SOURCES.TERMINAL_OUTPUT:
        if (data.terminalOutput) {
          contextParts.push({
            source: 'Terminal Output',
            content: `Latest Terminal Output:\n\`\`\`\n${data.terminalOutput}\n\`\`\``,
          });
        }
        break;
        
      case MCP_SOURCES.CLIPBOARD:
        if (data.clipboard) {
          contextParts.push({
            source: 'Clipboard',
            content: `Clipboard Content:\n${data.clipboard}`,
          });
        }
        break;
        
      default:
        break;
    }
  }
  
  return contextParts;
};

// Format context for AI prompt
export const formatContextForAI = (contextParts) => {
  if (contextParts.length === 0) {
    return '';
  }
  
  const formatted = contextParts
    .map(part => `## ${part.source}\n\n${part.content}`)
    .join('\n\n---\n\n');
  
  return `\n\n### Context Information\n\n${formatted}\n\n---\n\n`;
};

// Combine user prompt with context
export const buildPromptWithContext = async (userPrompt, sources, data) => {
  const contextParts = await buildContext(sources, data);
  const contextString = formatContextForAI(contextParts);
  
  return `${userPrompt}${contextString}`;
};

// Preview context (for UI display)
export const previewContext = async (sources, data) => {
  const contextParts = await buildContext(sources, data);
  
  return {
    parts: contextParts,
    totalSize: contextParts.reduce((sum, part) => sum + part.content.length, 0),
    formatted: formatContextForAI(contextParts),
  };
};
