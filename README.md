# 🎯 BONZO DevAssist AI - Intelligent Development Environment

```
██████╗  ██████╗ ███╗   ██╗███████╗ ██████╗     ██████╗ ███████╗██╗   ██╗
██╔══██╗██╔═══██╗████╗  ██║╚══███╔╝██╔═══██╗    ██╔══██╗██╔════╝██║   ██║
██████╔╝██║   ██║██╔██╗ ██║  ███╔╝ ██║   ██║    ██║  ██║█████╗  ██║   ██║
██╔══██╗██║   ██║██║╚██╗██║ ███╔╝  ██║   ██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
██████╔╝╚██████╔╝██║ ╚████║███████╗╚██████╔╝    ██████╔╝███████╗ ╚████╔╝ 
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝     ╚═════╝ ╚══════╝  ╚═══╝  
                    ASSIST AI - Cyberpunk Edition ⚡
```

A **production-ready, visually stunning desktop application** built with React, Vite, and Tauri featuring a Cyberpunk/Glassmorphism UI aesthetic. Your intelligent development companion with AI-powered assistance, system monitoring, and seamless integrations.

## ✨ Features

### 🎨 Stunning Cyberpunk UI
- **Glassmorphism Design** - Frosted glass cards with backdrop blur effects
- **Neon Glow Effects** - Animated neon borders, text, and buttons
- **Animated Grid Background** - Dynamic cyberpunk-style grid overlay
- **Glitch Text Effects** - Retro glitch animations on titles
- **Smooth Animations** - Powered by Framer Motion
- **Custom Scrollbars** - Neon-themed scrollbars

### 🤖 AI Assistant (Multi-Provider)
- **OpenAI Integration** - GPT-4, GPT-4 Turbo, GPT-3.5 Turbo support
- **Anthropic Claude** - Claude 3 Opus, Sonnet, and Haiku models
- **Easy API Key Management** - Secure storage with test connections
- **Context-Aware** - Sends current file content for better assistance
- **Real-time Chat** - Typing indicators and message history
- **Quick Actions** - Explain Code, Find Bugs, Optimize buttons
- **Code Highlighting** - Syntax-highlighted code in responses

### 💻 Code Editor
- **Monaco Editor** - Full-featured VS Code editor engine
- **Multi-Language Support** - JavaScript, TypeScript, Python, Rust, C++, Java, Go
- **Syntax Highlighting** - Beautiful syntax coloring for all languages
- **Line Numbers & Minimap** - Professional editing experience
- **AI Complete** - Send code directly to AI for assistance

### 📁 File Explorer
- **Tauri File System** - Native file browsing with dialog API
- **Directory Tree** - Expandable folder structure
- **File Icons** - Visual file/folder indicators
- **Open in Editor** - Click to open files for editing

### 📊 System Monitor
- **Real-time Stats** - CPU, RAM, Disk usage updated every 2 seconds
- **Circular Progress Rings** - Beautiful animated progress indicators
- **Live Charts** - CPU and RAM history with Recharts
- **Optimization Tools** - Cache cleanup and memory optimization
- **Performance Metrics** - Detailed system information

### 🔌 Integrations
- **GitHub** - Connect with Personal Access Token
- **Database** - PostgreSQL, MySQL, SQLite support
- **Jira** - Coming soon

### ⚙️ Settings
- **AI Provider Config** - Manage API keys for OpenAI and Claude
- **Connection Testing** - Verify API keys before saving
- **Secure Storage** - API keys saved to Tauri app data directory
- **Theme Customization** - Font size and appearance settings
- **System Preferences** - Auto-optimization and GPU acceleration

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tauri** - Lightweight desktop framework (NOT Electron)
- **Framer Motion** - Smooth animations
- **Monaco Editor** - Code editing engine
- **Recharts** - Beautiful charts
- **React Icons** - Icon library
- **Zustand** - State management

### Backend (Rust)
- **Tauri** - Desktop application framework
- **Sysinfo** - System statistics
- **Reqwest** - HTTP client for AI APIs
- **Serde** - JSON serialization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Rust** 1.70+ ([Install via rustup](https://rustup.rs/))
- **Platform-specific dependencies**:
  - **Windows**: [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Usually pre-installed on Windows 10/11)
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: webkit2gtk (`sudo apt install libwebkit2gtk-4.0-dev` on Debian/Ubuntu)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bonzokoles/Jimbo_devzAssist_hub.git
cd Jimbo_devzAssist_hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Build Rust dependencies** (automatic on first run)
```bash
cd src-tauri
cargo build
cd ..
```

## 💻 Development

Run the application in development mode with hot-reload:

```bash
npm run tauri:dev
```

This will:
- Start the Vite dev server on `http://localhost:5173`
- Launch the Tauri application window
- Enable hot module replacement for instant updates

## 🏗️ Building

Build the production-ready executable:

```bash
npm run tauri:build
```

The built application will be located in:
- **Windows**: `src-tauri/target/release/bundle/msi/`
- **macOS**: `src-tauri/target/release/bundle/dmg/`
- **Linux**: `src-tauri/target/release/bundle/deb/` or `/appimage/`

## ☁️ Web Deployment (Cloudflare Pages)

You can also deploy this application as a web app on Cloudflare Pages! The app automatically detects web mode and works without the Tauri backend.

### Quick Deploy

1. **Via Cloudflare Dashboard** (Recommended)
   - Login to [Cloudflare Pages](https://dash.cloudflare.com/pages)
   - Click "Create a project" → "Connect to Git"
   - Select this repository
   - Use these settings:
     ```
     Build command: npm run build
     Build output directory: dist
     ```
   - Click "Save and Deploy"

2. **Via Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   npm run build
   wrangler pages deploy dist --project-name=jimbo-devassist-hub
   ```

📚 **Full deployment guide**: See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) (English) or [CLOUDFLARE_DEPLOYMENT_PL.md](CLOUDFLARE_DEPLOYMENT_PL.md) (Polish)

### Web Mode Features

When deployed on Cloudflare Pages:
- ✅ **Blog System**: Fully functional with localStorage
- ✅ **Code Editor**: Full Monaco Editor support
- ✅ **AI Assistant**: Direct API calls to AI providers
- ✅ **Dashboard & UI**: Complete cyberpunk interface
- ⚠️ **Terminal**: Not available (desktop-only)
- ⚠️ **File System**: Limited to browser APIs

## 🤖 AI Configuration Guide

### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. In BONZO DevAssist:
   - Click Settings (⚙️ icon in sidebar)
   - Go to "AI Providers" tab
   - Paste key in OpenAI API Key field
   - Click "Test Connection"
   - Click "Save Settings"

### Getting Anthropic Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-...`)
6. In BONZO DevAssist:
   - Click Settings (⚙️ icon in sidebar)
   - Go to "AI Providers" tab
   - Paste key in Claude API Key field
   - Click "Test Connection"
   - Click "Save Settings"

### Using the AI Assistant

1. **Open AI Panel**: Click "AI Assistant" button in top bar
2. **Select Provider**: Choose OpenAI or Claude
3. **Start Chatting**: Type your question and press Enter
4. **Quick Actions**:
   - **Explain Code**: Get explanations of your code
   - **Find Bugs**: Detect potential issues
   - **Optimize**: Get performance improvement suggestions

## 🎨 Screenshots

_Screenshots will be added here showcasing the cyberpunk UI, dashboard, code editor, system monitor, and AI assistant._

## 📁 Project Structure

```
Jimbo_devzAssist_hub/
├── src/
│   ├── components/         # React components
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── FileExplorer.jsx
│   │   ├── SystemMonitor.jsx
│   │   ├── Integrations.jsx
│   │   └── Settings.jsx
│   ├── styles/
│   │   └── cyberpunk.css  # Global styles
│   ├── utils/
│   │   ├── aiClient.js    # AI API wrapper
│   │   └── tauriCommands.js
│   ├── store/
│   │   └── useStore.js    # Zustand store
│   ├── App.jsx
│   └── main.jsx
├── src-tauri/
│   ├── src/
│   │   └── main.rs        # Rust backend
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
│   └── bonzo-logo.svg
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Supported AI Providers

| Provider | Models | Status |
|----------|--------|--------|
| **OpenAI** | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo | ✅ Supported |
| **Anthropic Claude** | Claude 3 Opus, Sonnet, Haiku | ✅ Supported |
| **Local LLM** | Ollama, LM Studio | 🔜 Coming Soon |

## 💾 System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB
- **Storage**: 500MB free space
- **CPU**: Dual-core 2GHz+

### Recommended
- **OS**: Windows 11, macOS 13+, or Linux (Ubuntu 22.04+)
- **RAM**: 8GB
- **Storage**: 1GB free space
- **CPU**: Quad-core 3GHz+

## 🐛 Troubleshooting

### Build Errors

**Issue**: `cargo build` fails with missing dependencies
```bash
# Linux (Debian/Ubuntu)
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# macOS
xcode-select --install
```

**Issue**: Vite dev server won't start
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Issue**: API calls fail with CORS errors
- Ensure API keys are correctly configured in Settings
- Check that your internet connection is active
- Verify API key permissions on provider dashboard

**Issue**: System stats not updating
- Check if Tauri backend is running
- Restart the application
- Check console for error messages

### Performance Issues

**Issue**: Application is slow or laggy
- Close unnecessary applications
- Run "Free Memory" in System Monitor
- Reduce animation settings
- Disable GPU acceleration if having issues

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tauri Team** - For the amazing desktop framework
- **React Team** - For the powerful UI library
- **OpenAI & Anthropic** - For AI API access
- **Cyberpunk Aesthetic** - Inspired by cyberpunk culture and neon aesthetics

## 📚 Additional Resources

- **[RAG, Agent & Vector DB Visualization Resources](RAG_AGENT_VISUALIZATION_RESOURCES.md)** - Comprehensive guide to tools for visualizing RAG databases, agent workflows, and vector database resources
- **[🇵🇱 Przewodnik Wizualizacji (Polski)](PRZEWODNIK_WIZUALIZACJA_RAG_PL.md)** - Polish quick reference guide for RAG and agent visualization tools

## 📧 Support

For issues, questions, or suggestions:
- **GitHub Issues**: [Create an issue](https://github.com/Bonzokoles/Jimbo_devzAssist_hub/issues)
- **Discussions**: [Join the discussion](https://github.com/Bonzokoles/Jimbo_devzAssist_hub/discussions)

---

<div align="center">

**Made with ⚡ by Bonzo**

*Make it EPIC, make it CYBERPUNK, make it FUNCTIONAL!* 🔥

</div>
