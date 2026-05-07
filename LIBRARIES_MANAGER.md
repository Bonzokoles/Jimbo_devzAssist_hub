# Libraries & Frameworks Manager

A comprehensive package management system for the BONZO DevAssist application that allows users to search, install, manage packages, and get AI-powered recommendations.

## Features

### 📦 Package Search
- Search packages across multiple package managers (npm, pip, cargo, etc.)
- View detailed package information including:
  - Package name and version
  - Description
  - Author information
  - Download statistics
  - Keywords/tags
  - License information
- Real-time search with loading states
- Grid layout for easy browsing

### 💾 Installed Packages
- View all currently installed packages
- Quick access to package details
- Version management
- Uninstall functionality (coming soon)

### 🤖 AI Package Advisor
- Get AI-powered package recommendations
- Ask natural language questions like:
  - "What library should I use for state management in React?"
  - "Best authentication library for Node.js?"
  - "Which testing framework should I use for Python?"
- Receive detailed recommendations with:
  - Package pros and cons
  - When to use each package
  - Comparative analysis
  - Installation instructions

## Components

### PackageCard.jsx
A reusable card component for displaying package information.

**Props:**
- `pkg` - Package object containing name, version, description, etc.
- `onInstall` - Callback function when install button is clicked
- `onViewDetails` - Callback function when details button is clicked
- `isInstalling` - Boolean to show loading state during installation
- `aiExplanation` - Optional AI explanation/recommendation text

**Features:**
- Glassmorphism design with neon cyberpunk styling
- Hover effects with glow
- Version badge with gradient
- Download count formatting (1.2M, 45K, etc.)
- Keyword tags
- License badge
- AI insight section (when available)
- Install and Details action buttons

### PackageSearch.jsx
A comprehensive search interface for finding packages.

**Features:**
- Search input with magnifying glass icon
- Package manager dropdown selector
- Real-time search results
- Loading spinner during searches
- "No results" state
- Grid layout for results
- "Ask AI for Recommendations" button
- Keyboard support (Enter to search)

**Supported Package Managers:**
- npm, yarn, pnpm, bun (JavaScript/TypeScript)
- pip, pipenv, poetry (Python)
- cargo (Rust)
- bundler (Ruby)
- composer (PHP)

### LibrariesManager.jsx
The main component that orchestrates the entire libraries management system.

**Features:**
- Three main tabs:
  1. **Search Packages** - Package search interface
  2. **Installed** - View installed packages
  3. **AI Recommendations** - AI-powered package advisor

**AI Integration:**
- Automatically detects configured AI provider (OpenAI, Claude, Gemini, Mistral)
- Sends structured prompts to AI for package recommendations
- Parses AI responses into structured recommendation cards
- Displays pros, cons, and use cases for each recommendation

## Usage

### Searching for Packages

1. Click on the "Libraries" icon (📦) in the sidebar
2. Select your package manager from the dropdown
3. Enter a search term (e.g., "react-router")
4. Click "Search" or press Enter
5. Browse the results in the grid layout
6. Click "Install" to install a package
7. Click "Details" to view more information

### Getting AI Recommendations

1. Navigate to the "AI Recommendations" tab
2. Type your question in the text area
   - Example: "What's the best library for data visualization in React?"
3. Click "Get Recommendations"
4. Wait for AI to analyze your request
5. Review the recommendations with pros, cons, and use cases
6. Click "Install" on any recommended package

### Viewing Installed Packages

1. Navigate to the "Installed" tab
2. View all installed packages in your project
3. See version numbers and descriptions
4. Access quick actions for each package

## Styling

All components follow the cyberpunk theme with:
- Neon cyan (#00f0ff) and pink (#ff006e) accent colors
- Purple (#b000ff) for AI-related elements
- Glassmorphism effects with backdrop blur
- Smooth transitions and hover effects
- Responsive grid layouts
- Custom scrollbars with neon glow

## Integration Points

### Package Manager Utilities
Located in `/src/utils/package/packageManager.js`:
- `searchPackages(packageManager, query)` - Search for packages
- `getPackageInfo(packageManager, packageName)` - Get detailed package info
- `detectPackageManager(projectPath)` - Auto-detect package manager

### Package Installer
Located in `/src/utils/package/installer.js`:
- `installPackage(packageManager, packageName, options)` - Install a package
- `uninstallPackage(packageManager, packageName, options)` - Uninstall a package
- `updatePackage(packageManager, packageName, options)` - Update a package
- `listInstalledPackages(packageManager, options)` - List installed packages

### AI Client
Located in `/src/utils/aiClient.js`:
- `callAI(provider, apiKey, model, messages, baseUrl)` - Unified AI call function
- Supports OpenAI, Claude, Gemini, Mistral, and more

## Future Enhancements

- [ ] Package version history and changelog viewer
- [ ] Dependency tree visualization
- [ ] Security vulnerability scanning
- [ ] Update notifications for outdated packages
- [ ] Batch install/uninstall operations
- [ ] Package comparison tool
- [ ] Integration with package.json editor
- [ ] Real-time package statistics
- [ ] Community ratings and reviews
- [ ] Custom package sources/registries
- [ ] Offline package cache
- [ ] Package usage analytics

## Development Notes

### Adding New Package Managers

To add support for a new package manager:

1. Update `packageManager.js`:
   - Add registry URL in `getRegistry()`
   - Add install command in `getInstallCommand()`
   - Add search logic in `searchPackages()`

2. Update `installer.js`:
   - Add install command in `installPackage()`
   - Add uninstall command in `uninstallPackage()`
   - Add list command in `listInstalledPackages()`

3. Add to dropdown in `PackageSearch.jsx`

### Customizing AI Prompts

The AI recommendation prompt is in `LibrariesManager.jsx` within the `handleAIRecommendation()` function. Customize it to:
- Request different information formats
- Add specific evaluation criteria
- Include project context
- Filter by specific requirements

## API Examples

### Search for Packages
```javascript
import { searchPackages } from '../utils/package/packageManager';

const results = await searchPackages('npm', 'react-router');
// Returns array of package objects with name, version, description, etc.
```

### Install a Package
```javascript
import { installPackage } from '../utils/package/installer';

const result = await installPackage('npm', 'react-router-dom', {
  isDev: false,
  version: '6.0.0'
});
```

### Get AI Recommendations
```javascript
import { callAI } from '../utils/aiClient';

const messages = [{
  role: 'user',
  content: 'What library should I use for form validation in React?'
}];

const response = await callAI('openai', apiKey, 'gpt-4', messages);
```

## Contributing

When adding new features to the Libraries Manager:
1. Follow the existing cyberpunk styling patterns
2. Maintain responsive design principles
3. Add proper loading and error states
4. Update this documentation
5. Test with multiple package managers
6. Ensure AI integration compatibility

## License

Part of the BONZO DevAssist application.
