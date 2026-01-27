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

  // Current File
  currentFile: null,
  currentFileContent: '',
  setCurrentFile: (file) => set({ currentFile: file }),
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

  // System Stats
  systemStats: null,
  setSystemStats: (stats) => set({ systemStats: stats }),

  // Projects
  projects: [
    { id: 1, name: 'Project Alpha', status: 'active', files: 127, lastModified: '2 hours ago' },
    { id: 2, name: 'Beta Dashboard', status: 'idle', files: 89, lastModified: '1 day ago' },
    { id: 3, name: 'Gamma API', status: 'active', files: 234, lastModified: '30 min ago' },
  ],

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
