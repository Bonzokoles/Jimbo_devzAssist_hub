# 🚀 BONZO DevAssist AI - Advanced Features Guide

This document provides detailed information about the advanced features added to BONZO DevAssist AI.

## Table of Contents
- [System Prompts](#system-prompts)
- [Workspace Prompts](#workspace-prompts)
- [MOA (Mixture of Agents)](#moa-mixture-of-agents)
- [MOA Scenarios](#moa-scenarios)
- [Usage Examples](#usage-examples)

---

## System Prompts

### Overview
System Prompts define your AI assistant's core personality and behavior across all conversations. This global setting affects how the AI responds to every query.

### Features
- **5 Built-in Presets**:
  - **Professional Developer**: Expert software engineer focused on clean, maintainable code
  - **Security Expert**: Cybersecurity specialist analyzing for vulnerabilities
  - **Teaching Mode**: Patient teacher breaking down complex concepts
  - **Code Reviewer**: Thorough reviewer providing constructive feedback
  - **Creative Designer**: UX/UI designer focused on beautiful interfaces

- **Custom Presets**: Save your own system prompts for reuse
- **Import/Export**: Share system prompts as JSON files
- **Character Counter**: Track prompt length in real-time

### How to Use
1. Open Settings (⚙️ icon)
2. Navigate to "System Prompt" tab
3. Select a preset OR write your own
4. Click "Save Settings"

### Quick Edit
Click the "✏️ System Prompt" button in the AI Assistant panel to quickly edit without opening full settings.

---

## Workspace Prompts

### Overview
Workspace Prompts provide project-specific context that is automatically included in all AI queries for that project. Each project can have its own unique prompt.

### Features
- **Project-Specific**: Different prompts for different projects
- **Template Library**: Pre-built templates for:
  - Next.js Projects
  - React Applications
  - Node.js/Express APIs
  - Python Projects
  - Full Stack Applications

- **Auto-Detection**: Can extract information from README.md (future feature)
- **Per-Project Storage**: Prompts are saved based on project path

### How to Use
1. Open Settings → "Workspace" tab
2. Set your project path
3. Choose a template OR write custom context
4. Describe:
   - Tech stack and frameworks
   - Coding conventions
   - Project structure
   - Business requirements
5. Click "Save Settings"

### Example Workspace Prompt
```
This is a Next.js 14 e-commerce app using:
- TypeScript, React Server Components
- Prisma with PostgreSQL
- Tailwind CSS
- Stripe for payments

Conventions:
- Use 'use server' for server actions
- Prefix API routes with /api/
- Use camelCase for variables
- Add JSDoc comments to all functions
```

---

## MOA (Mixture of Agents)

### Overview
MOA (Mixture of Agents) allows you to run multiple AI models on the same query, each with different roles and purposes. Combine their strengths to get better results.

### Execution Strategies

#### Sequential (Pipeline)
Models process one after another, each building on the previous model's output.

**Example Use Case: Code Generation → Review → Optimization**
1. Model 1 (GPT-4) generates initial code
2. Model 2 (Claude) reviews and finds issues
3. Model 3 (Gemini) optimizes performance

#### Parallel (Multi-Perspective)
All models process the user query simultaneously, providing different perspectives.

**Example Use Case: Multi-Expert Analysis**
1. Model 1 analyzes from technical perspective
2. Model 2 analyzes from security perspective
3. Model 3 analyzes from UX perspective
4. Aggregator combines all three viewpoints

### Response Aggregation
Optionally combine all individual responses into a single, coherent answer using a designated aggregation model.

---

## MOA Scenarios

### Overview
Save complete MOA configurations as reusable scenarios. Build once, use many times.

### Creating a Scenario

1. Open Settings → "MOA Scenarios" tab
2. Click "Create New Scenario"
3. Configure:
   - **Scenario Name**: Descriptive name
   - **Description**: What it does
   - **Strategy**: Sequential or Parallel
   - **Models**: Add and configure each model
   - **Aggregation**: Enable/disable and configure

### Model Configuration
For each model in your scenario, specify:
- **Role/Purpose**: What this model does (e.g., "Code Generator", "Security Reviewer")
- **Provider**: OpenAI or Claude
- **Model**: Specific model (GPT-4, Claude 3 Opus, etc.)
- **System Prompt**: Custom instructions for this model's role
- **Temperature**: Creativity level (0-2)
- **Max Tokens**: Response length limit

### Managing Scenarios
- **Edit**: Modify existing scenarios
- **Duplicate**: Copy and modify scenarios
- **Export**: Save as JSON file
- **Import**: Load scenarios from JSON
- **Delete**: Remove unwanted scenarios

### Using Scenarios in AI Assistant
1. Open AI Assistant panel
2. Check "MOA Mode"
3. Select your scenario from dropdown
4. Ask your question
5. View individual and aggregated responses

---

## Usage Examples

### Example 1: Full Stack Code Review

**Scenario**: "Full Stack Code Review"
- **Strategy**: Parallel
- **Model 1**: "Frontend Reviewer" (React/TypeScript focus)
- **Model 2**: "Backend Reviewer" (Node.js/API focus)
- **Model 3**: "Security Auditor" (Security focus)
- **Aggregator**: Combines all three reviews

**User Query**: "Review this user authentication code"

**Result**: Get comprehensive feedback from three different perspectives, then a combined summary.

---

### Example 2: Progressive Code Development

**Scenario**: "Code Pipeline v1"
- **Strategy**: Sequential
- **Model 1**: "Fast Drafter" (GPT-3.5, quick first draft)
- **Model 2**: "Code Enhancer" (Claude, adds details and fixes)
- **Model 3**: "Production Polisher" (GPT-4, final quality check)

**User Query**: "Create a login form with email and password"

**Result**: Iteratively refined code that goes through multiple improvement stages.

---

### Example 3: Learning Assistant

**Scenario**: "Teaching Pipeline"
- **Strategy**: Sequential
- **Model 1**: "Simple Explainer" (breaks down concept)
- **Model 2**: "Example Generator" (provides code examples)
- **Model 3**: "Practice Creator" (suggests exercises)

**User Query**: "Explain React hooks"

**Result**: Explanation → Examples → Practice exercises, all in one flow.

---

## Tips and Best Practices

### System Prompts
- ✅ Keep prompts focused and specific
- ✅ Test different presets to find what works
- ✅ Combine with workspace prompts for maximum context
- ❌ Don't make prompts too long (affects token usage)

### Workspace Prompts
- ✅ Include tech stack details
- ✅ Specify coding conventions clearly
- ✅ Mention business context when relevant
- ✅ Update when project requirements change
- ❌ Don't include sensitive information or secrets

### MOA Scenarios
- ✅ Start with 2-3 models, not too many
- ✅ Give each model a clear, distinct role
- ✅ Use sequential for iterative refinement
- ✅ Use parallel for multi-perspective analysis
- ✅ Test scenarios with simple queries first
- ❌ Don't over-complicate scenarios initially

### Performance
- Sequential MOA takes longer (models run in order)
- Parallel MOA is faster (models run simultaneously)
- Aggregation adds one additional API call
- More models = higher API costs

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Settings | `Ctrl/Cmd + ,` (future) |
| Toggle AI Assistant | `Ctrl/Cmd + K` (future) |
| Quick Edit System Prompt | Click ✏️ button |
| Quick Edit Workspace | Click ✏️ button |

---

## Troubleshooting

### Scenario Not Saving
- Check that scenario name is valid (alphanumeric characters)
- Ensure all required fields are filled
- Check browser console for errors

### Workspace Prompt Not Loading
- Verify project path is set correctly
- Check that path is consistent across sessions
- Try refreshing the application

### MOA Execution Fails
- Verify API keys are configured for all providers used
- Check that models are available (some require specific API access)
- Ensure no rate limits are exceeded

### Copy to Clipboard Not Working
- Modern browsers require HTTPS for clipboard API
- Fallback method may require user interaction
- Check browser permissions

---

## Future Enhancements

Planned features for future releases:
- [ ] Keyboard shortcuts
- [ ] Auto-detect project type from package.json
- [ ] MOA result comparison view
- [ ] Scenario marketplace/sharing
- [ ] Cost estimation per scenario
- [ ] Custom aggregation strategies
- [ ] Real-time progress indicators
- [ ] Scenario performance analytics

---

## Need Help?

For questions, issues, or feature requests:
- Check the main README.md
- Open an issue on GitHub
- Review code documentation in source files

---

**Last Updated**: January 2026  
**Version**: 2.0.0
