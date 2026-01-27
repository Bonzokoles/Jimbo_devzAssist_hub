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
  setOpenAIKey: (key) => set({ openaiKey: key }),
  setClaudeKey: (key) => set({ claudeKey: key }),

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
  
  // Prompts
  systemPrompt: '',
  workspacePrompt: '',
  currentProjectPath: '',
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setWorkspacePrompt: (prompt) => set({ workspacePrompt: prompt }),
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),
  
  // MOA
  moaMode: false,
  selectedScenario: null,
  moaScenarios: [],
  setMOAMode: (enabled) => set({ moaMode: enabled }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setMOAScenarios: (scenarios) => set({ moaScenarios: scenarios }),
  
  // Prompt Editor Modal
  promptEditorOpen: false,
  promptEditorType: 'system', // 'system' or 'workspace'
  togglePromptEditor: (type) => set((state) => ({ 
    promptEditorOpen: !state.promptEditorOpen,
    promptEditorType: type || state.promptEditorType
  })),
}));

export default useStore;
