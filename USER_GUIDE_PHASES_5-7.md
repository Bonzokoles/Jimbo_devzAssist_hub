# User Guide: New Features (Phases 5-7)

## 📋 Model Context Protocol (MCP)

### How to Use
1. Open Settings (click gear icon in sidebar)
2. Click the **MCP** tab
3. Check **"Enable MCP"**
4. (Optional) Enter MCP Server URL for future WebSocket connections
5. Select context sources you want to include:
   - 📄 Current File - Currently open file content
   - 📁 Project Structure - Directory tree
   - 🔀 Git History - Git commit history
   - 📑 Open Tabs - All open editor tabs
   - 💻 Terminal Output - Recent terminal commands
   - 📋 System Clipboard - Clipboard content
6. Click **"Show Context Preview"** to see what will be included
7. Click **"Save Context Settings"** and **"Save MCP Settings"**

### What It Does
MCP (Model Context Protocol) allows the AI to understand your project better by including relevant context when you ask questions or request code generation.

---

## 🌐 Network & Tunnel Settings

### Development Server Configuration
1. Open Settings → **Network** tab
2. Set **Dev Server Port** (default: 5173)
3. (Optional) Set **Backend Port** if you have an API server
4. Click **"Save Network Settings"**

### Cloudflare Tunnel
Share your local development server with others securely!

#### To Start a Tunnel:
1. Enable **"Enable Cloudflare Tunnel"** checkbox
2. Set **Cloudflared Path** (leave as "cloudflared" if installed globally)
3. Click **"Start Tunnel"**
4. Wait for tunnel to initialize (~1-2 seconds)
5. Copy the generated URL (e.g., `https://abc123.trycloudflare.com`)
6. Share this URL with teammates or for testing

#### To Stop a Tunnel:
1. Click **"Stop Tunnel"**
2. The URL will become inactive

#### Status Indicator:
- 🟢 **Active** - Tunnel is running, URL is accessible
- ⚫ **Inactive** - Tunnel is stopped

### Note
This is a simulated tunnel interface. In production:
- Install cloudflared: `npm install -g cloudflared` or download from Cloudflare
- The app will use the real cloudflared binary
- Tunnels will be actual secure connections

---

## 🎨 Custom Logo & Branding

### Upload a Custom Logo

1. Open Settings → **Appearance** tab
2. Find the **"Custom Logo"** section at the top
3. Click **"Upload Logo"** button
4. Select an SVG file from your computer
   - Must be SVG format
   - Maximum size: 500KB
   - Recommended size: 64x64 pixels
5. Preview will update immediately
6. Your logo will appear in the sidebar

### Reset to Default Logo

1. Open Settings → **Appearance** tab
2. Click **"Reset to Default"** button
3. Confirm the action
4. Sidebar will show the default "B" logo

### Logo Guidelines

✅ **Do:**
- Use SVG format for best quality
- Keep it simple (icon-style works best)
- Use 64x64px or similar square dimensions
- Use transparent backgrounds
- Test with light/dark themes

❌ **Don't:**
- Use PNG/JPG (not supported yet)
- Upload files larger than 500KB
- Use complex illustrations
- Include text (may not scale well)

### Logo Storage
Your logo is stored securely in your browser's localStorage and will persist across sessions.

---

## 💡 Tips & Tricks

### MCP Context
- Enable only the sources you need to reduce context size
- "Current File" and "Project Structure" are most useful for coding tasks
- Git History helps AI understand project evolution
- Preview context before saving to verify what's included

### Network Tunnel
- Use tunnels for quick demos without deployment
- Perfect for showing work-in-progress to clients
- Each tunnel gets a unique random URL
- Tunnels are temporary (stop when you close the app)

### Custom Logo
- Match your company/project branding
- Create cohesive development environment
- Export SVG from design tools like Figma, Illustrator, or Inkscape
- Simple, bold designs work best at small sizes

---

## 🔒 Privacy & Data Storage

All settings are stored locally in your browser using localStorage:
- `bonzo_mcp_config` - MCP settings
- `bonzo_tunnel_config` - Network configuration
- `bonzo_tunnel_status` - Active tunnel state
- `bonzo_custom_logo` - Your uploaded logo (base64)

**No data is sent to external servers** (except when you explicitly start a tunnel).

---

## 🐛 Troubleshooting

### MCP Not Working?
- Check that "Enable MCP" is checked
- Verify at least one context source is selected
- Try refreshing the page

### Tunnel Won't Start?
- This is a simulated tunnel in the current version
- Check that a port number is entered
- In production, ensure cloudflared is installed

### Logo Not Showing?
- Verify file is SVG format
- Check file size is under 500KB
- Try refreshing the page
- Reset to default and try uploading again

### Settings Not Saving?
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing cache and re-entering settings

---

## 🚀 Coming Soon

### MCP Enhancements
- Real-time WebSocket connection
- Additional context sources
- Smart context optimization
- Context size limits

### Network Improvements
- Real cloudflared integration
- Ngrok support
- Custom domain configuration
- Tunnel health monitoring

### Branding Features
- PNG/JPG logo support
- App name customization
- Custom color themes
- Font selection
- Branding presets

---

**Need help?** Open an issue on GitHub or check the documentation in `PHASES_5-7_IMPLEMENTATION.md`
