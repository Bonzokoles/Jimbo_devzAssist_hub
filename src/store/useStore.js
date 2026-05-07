import { create } from 'zustand';

const useStore = create((set) => ({
  // Current view
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  // AI Panel
  aiPanelOpen: false,
  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),

  // Settings Modal
  settingsOpen: false,
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),

  // Workspace
  workspaceRoot: null,
  projectHandle: null,
  setWorkspaceRoot: (path) => set({ workspaceRoot: path }),
  setProjectHandle: (handle) => set({ projectHandle: handle }),

  // Current File
  currentFile: null,
  currentFileHandle: null,
  currentFileContent: '',
  setCurrentFile: (file) => set({ currentFile: file }),
  setCurrentFileHandle: (handle) => set({ currentFileHandle: handle }),
  setCurrentFileContent: (content) => set({ currentFileContent: content }),

  // AI Providers
  openaiKey: '',
  claudeKey: '',
  openrouterKey: '',
  geminiKey: '',
  mistralKey: '',
  cohereKey: '',
  ollamaUrl: 'http://localhost:11434',
  
  setOpenAIKey: (key) => set({ openaiKey: key }),
  setClaudeKey: (key) => set({ claudeKey: key }),
  setOpenRouterKey: (key) => set({ openrouterKey: key }),
  setGeminiKey: (key) => set({ geminiKey: key }),
  setMistralKey: (key) => set({ mistralKey: key }),
  setCohereKey: (key) => set({ cohereKey: key }),
  setOllamaUrl: (url) => set({ ollamaUrl: url }),

  // Model Selection
  selectedModels: {
    openai: 'gpt-4',
    claude: 'claude-3-sonnet-20240229',
    openrouter: 'openai/gpt-3.5-turbo',
    gemini: 'gemini-pro',
    mistral: 'mistral-medium',
    cohere: 'command-r',
    ollama: 'llama3',
  },
  setSelectedModel: (provider, model) => set((state) => ({
    selectedModels: { ...state.selectedModels, [provider]: model }
  })),

  // System Stats
  systemStats: null,
  setSystemStats: (stats) => set({ systemStats: stats }),

  // Projects
  projects: [
    { id: 1, name: 'Project Alpha', status: 'active', files: 127, lastModified: '2 hours ago' },
    { id: 2, name: 'Beta Dashboard', status: 'idle', files: 89, lastModified: '1 day ago' },
    { id: 3, name: 'Gamma API', status: 'active', files: 234, lastModified: '30 min ago' },
  ],
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects],
    stats: { ...state.stats, totalProjects: state.stats.totalProjects + 1 }
  })),

  // Stats
  stats: {
    totalProjects: 3,
    aiQueries: 1247,
    linesOfCode: 45782,
    gitCommits: 892,
  },

  // MOA Configuration
  moaEnabled: false,
  moaConfig: null,
  setMOAEnabled: (enabled) => set({ moaEnabled: enabled }),
  setMOAConfig: (config) => set({ moaConfig: config }),
}));

export default useStore;
