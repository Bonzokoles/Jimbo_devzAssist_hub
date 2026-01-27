/**
 * Workspace prompt management utilities
 */

/**
 * Example workspace prompt templates
 */
export const WORKSPACE_TEMPLATES = {
  nextjs: {
    name: "Next.js Project",
    template: `This is a Next.js application using:
- TypeScript
- React Server Components
- Tailwind CSS

Follow these conventions:
- Use 'use server' for server actions
- Prefix API routes with /api/
- Use camelCase for variables
- Add JSDoc comments to all functions`
  },
  
  react: {
    name: "React Project",
    template: `This is a React application using:
- React 18+
- Modern hooks (useState, useEffect, etc.)
- Component-based architecture

Follow these conventions:
- Use functional components
- Keep components small and focused
- Use PropTypes or TypeScript for type checking
- Follow React best practices`
  },
  
  node: {
    name: "Node.js/Express API",
    template: `This is a Node.js backend API using:
- Express.js
- RESTful architecture
- JWT authentication

Follow these conventions:
- Use async/await for async operations
- Implement proper error handling
- Validate all inputs
- Use environment variables for config`
  },
  
  python: {
    name: "Python Project",
    template: `This is a Python project using:
- Python 3.x
- Virtual environment

Follow these conventions:
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all functions
- Use snake_case for naming`
  },
  
  fullstack: {
    name: "Full Stack Application",
    template: `This is a full-stack application with:
- Frontend: React/Next.js
- Backend: Node.js/Express
- Database: PostgreSQL/MongoDB
- Authentication: JWT

Follow these conventions:
- Separate frontend and backend concerns
- Use consistent naming across stack
- Implement proper security measures
- Document API endpoints`
  }
};

/**
 * Get all workspace template names
 */
export const getTemplateNames = () => {
  return Object.keys(WORKSPACE_TEMPLATES);
};

/**
 * Get a template by key
 */
export const getTemplate = (key) => {
  return WORKSPACE_TEMPLATES[key];
};

/**
 * Get all templates as array
 */
export const getAllTemplates = () => {
  return Object.entries(WORKSPACE_TEMPLATES).map(([key, value]) => ({
    key,
    ...value
  }));
};

/**
 * Auto-detect project type from package.json or other files
 */
export const detectProjectType = async (projectPath) => {
  // This would need to be implemented with Tauri commands
  // to read files from the project directory
  // For now, return null
  return null;
};

/**
 * Generate workspace prompt from README.md
 */
export const generateFromReadme = async (readmeContent) => {
  // Simple extraction of key information from README
  const lines = readmeContent.split('\n');
  const techStack = [];
  const conventions = [];
  
  let inTechSection = false;
  let inConventionsSection = false;
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (lower.includes('tech') || lower.includes('stack') || lower.includes('dependencies')) {
      inTechSection = true;
      inConventionsSection = false;
      continue;
    }
    
    if (lower.includes('convention') || lower.includes('style') || lower.includes('guide')) {
      inConventionsSection = true;
      inTechSection = false;
      continue;
    }
    
    if (line.startsWith('#')) {
      inTechSection = false;
      inConventionsSection = false;
    }
    
    if (inTechSection && line.trim()) {
      techStack.push(line.trim());
    }
    
    if (inConventionsSection && line.trim()) {
      conventions.push(line.trim());
    }
  }
  
  let prompt = 'This project:\n\n';
  
  if (techStack.length > 0) {
    prompt += 'Tech Stack:\n';
    techStack.forEach(tech => {
      prompt += `${tech}\n`;
    });
    prompt += '\n';
  }
  
  if (conventions.length > 0) {
    prompt += 'Coding Conventions:\n';
    conventions.forEach(conv => {
      prompt += `${conv}\n`;
    });
  }
  
  return prompt;
};
