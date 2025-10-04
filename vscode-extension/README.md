# Aider VS Code Extension

AI pair programming with Aider directly in VS Code. This extension enables seamless interaction with the Aider backend for collaborative app building.

## Features

- **Visual-First Workflow**: Full-page app preview as the primary view with Aider sidebar for quick access
- **Screenshot-to-Code Generation**: Upload or paste screenshots to automatically generate React/Next.js components
  - Drag-and-drop support for images
  - Clipboard integration for quick screenshot pasting
  - AI-powered analysis using Ollama or GitHub Copilot
  - Automatic file creation and code preview
- **Project-Level Context Storage**: Store and manage project-specific rules, design principles, goals, and coding patterns
  - Define coding standards and constraints
  - Set design principles and guidelines
  - Track project goals and objectives
  - Create reusable coding patterns
  - Persistent storage in `.aider/project-context.json`
- **Context-Aware Suggestions**: AI incorporates your project context in all code generation
  - Validates against project rules
  - Follows design principles
  - Uses established coding patterns
  - Aligns with project goals
- **Real-time Chat**: Interact with Aider through a built-in chat interface
- **Multi-AI Provider Support**: Choose between Default, Ollama, and GitHub Copilot
  - **Ollama**: Fast, local AI models for lightweight tasks
  - **GitHub Copilot**: Advanced AI for complex, context-heavy work
  - **Automatic Selection**: Let Aider choose the best provider based on task complexity
- **Live Preview with Inspector**: View your application in full-page panel and click elements to identify React components or CSS
- **Bidirectional Communication**: Preview can trigger file opens, AI edits; Aider can highlight/scroll elements
- **Auto-Open Preview**: Automatically opens the app preview when VS Code starts
- **Route Change Detection**: Monitor navigation in your app and get notified of route changes
- **Source Code Navigation**: Jump from preview elements directly to source files (when available)
- **File Management**: Add/remove files from the chat context
- **Live Changes**: Apply code changes directly to your project
- **Diff Viewing**: See exactly what changes Aider makes
- **Undo Support**: Easily revert changes with one click
- **Clipboard Integration**: Copy component/CSS info and paste into chat for targeted updates
- **Web Compatible**: Works in VS Code Web and Desktop versions

## Requirements

### Prerequisites

1. **VS Code**: Version 1.85.0 or higher
2. **Node.js**: Version 16.x or higher (for building the extension)
3. **Git**: Required for version control and Aider operations
4. **Aider Backend**: Running locally or accessible remotely (see setup below)
5. **GitHub CLI (Optional)**: Required for GitHub integration features
   - Install from: https://cli.github.com/
   - Run `gh auth login` to authenticate

### Aider Backend Setup

The extension requires a running Aider backend API server. You have two options:

#### Option 1: Using Aider CLI (Recommended)

```bash
# Install Aider
pip install aider-chat

# Navigate to your project directory
cd /path/to/your/project

# Start Aider with web interface
aider --browser
```

This starts the backend on `http://localhost:8501` (default).

#### Option 2: Custom Backend API

If you're developing a custom backend, ensure it implements the following endpoints:
- `POST /api/chat` - Send messages
- `POST /api/files/add` - Add files to context
- `POST /api/files/remove` - Remove files from context
- `GET /api/files` - List files in context
- `POST /api/chat/clear` - Clear chat history
- `POST /api/undo` - Undo last commit
- `GET /api/diff` - Get diff of changes
- `GET /api/chat/history` - Get chat history
- `POST /api/apply` - Apply changes
- `GET /api/health` - Health check

See [vscode-extension/examples/](examples/) for sample backend implementations.

### GitHub CLI Setup (Optional)

For GitHub integration features (push, pull, create PR, etc.):

```bash
# Install GitHub CLI
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux
# See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate
gh auth login
```

The extension will gracefully disable GitHub features if the CLI is not installed.

## Installation

### Option 1: From VSIX Package (Recommended)

1. **Build the extension** (if you haven't already):
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   npm run package
   ```
   This creates `aider-vscode-0.1.0.vsix`

2. **Install in VS Code**:
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
   - Click the `...` menu at the top
   - Select "Install from VSIX..."
   - Choose the `aider-vscode-0.1.0.vsix` file

### Option 2: From Source (Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aider-AI/aider.git
   cd aider/vscode-extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run compile
   ```

4. **Launch Extension Development Host**:
   - Open the `vscode-extension` folder in VS Code
   - Press `F5` to launch the Extension Development Host
   - The extension will be active in the new window

### Option 3: Continuous Development

For active development with auto-compilation:

```bash
cd vscode-extension
npm install
npm run watch  # Watches for changes and recompiles automatically
```

Then press `F5` in VS Code to debug. The extension will reload automatically when you make changes.

### Post-Installation

1. **Configure the backend endpoint** (if not using default):
   - Open VS Code Settings (Ctrl+, / Cmd+,)
   - Search for "Aider"
   - Set `aider.apiEndpoint` to your backend URL (default: `http://localhost:8501`)

2. **Start the Aider backend**:
   ```bash
   cd /path/to/your/project
   aider --browser
   ```

3. **Open a project** in VS Code and click the Aider icon in the Activity Bar to start!

## Usage

### AI Provider Selection

The extension supports multiple AI providers. See [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) for complete details.

**Quick Start:**

1. **Manual Selection**: Use the dropdown at the top of the chat to select your provider
   - **Default**: Uses your configured Aider backend model
   - **Ollama**: Fast, local AI for simple tasks (requires setup)
   - **GitHub Copilot**: Advanced AI for complex work (requires subscription)

2. **Automatic Selection**: Enable in settings to let Aider choose based on task complexity
   - Simple tasks → Ollama
   - Complex tasks → Copilot/Default

### Starting a Chat

1. Click on the Aider icon in the Activity Bar
2. Select your AI provider from the dropdown
3. Type your request in the chat input
4. Aider will analyze your code and suggest changes

### Adding Files to Chat

- **Option 1**: Open a file and run "Aider: Add File to Chat" from the command palette (Ctrl+Shift+P)
- **Option 2**: Right-click a file and select "Add to Aider Chat"

### Applying Changes

Aider will automatically apply changes to your files. You'll see:
- A notification showing which files were modified
- A diff view (if enabled in settings)
- An option to undo the changes

### Using Live Preview with Inspector

The extension provides two ways to preview your application:

#### Full-Page Preview Panel (Recommended for Visual-First Workflow)

1. **Open the preview panel** by running "Aider: Open App Preview" from the command palette (or it opens automatically on startup)
2. **Enter your application URL** (e.g., `http://localhost:3000`) - auto-filled from settings
3. **Click "Load"** to display your application in full-page view
4. **Enable the Inspector** by clicking "Inspector Off" button (it will change to "Inspector On")
5. **Click on any element** to inspect it - data is automatically copied to clipboard
6. **Choose action**: "Paste to Chat" to insert into Aider, or "Open File" to jump to source code
7. **Use refresh button** to reload the preview or enable HMR for live updates
8. Aider stays in the sidebar for quick access while you work with the preview

#### Sidebar Preview (Compact View)

1. **Open the Live Preview panel** in the Aider sidebar
2. Follow steps 2-7 above

**Advanced Features:**
- **Route Detection**: Get notified when navigating in your app
- **Element Highlighting**: Use "Aider: Highlight Element in Preview" to highlight specific elements
- **Auto-Scroll**: Use "Aider: Scroll to Element in Preview" to navigate to elements
- **Source Mapping**: When available, jump directly from preview to source files

For detailed instructions, see [LIVE_PREVIEW_GUIDE.md](LIVE_PREVIEW_GUIDE.md).

**New Visual-First Workflow**: See [VISUAL_WORKFLOW_GUIDE.md](VISUAL_WORKFLOW_GUIDE.md) for the complete guide to using the full-page preview panel and bidirectional communication features. Also check [QUICK_REFERENCE_VISUAL.md](QUICK_REFERENCE_VISUAL.md) for a quick start guide.

### Screenshot-to-Code Generation

Transform UI screenshots into production-ready code using vision-enabled AI models:

1. **Open Aider Chat Panel** in the sidebar
2. **Upload a Screenshot** using one of these methods:
   - **Drag and Drop**: Drag an image file into the screenshot area
   - **Paste from Clipboard**: Copy a screenshot and press Ctrl+V (Cmd+V on Mac)
   - **File Browser**: Run "Aider: Upload Screenshot for Code Generation" command
3. **Click "Generate Code"** 
4. The AI analyzes the screenshot and generates corresponding React/Next.js code
5. Generated file is automatically created in `src/components/` and opened
6. Review the code and make any refinements using Aider chat

**Vision Model Features:**
- **Default Vision Model**: Uses `llama3.2-vision` by default for screenshot analysis
- **Automatic Selection**: Automatically selects vision-capable model when screenshot is detected
- **Model Preloading**: Vision model is preloaded on container startup for instant availability
- **Fallback Support**: Gracefully falls back to other providers if model isn't available
- **Context-Aware**: Uses your project context (rules, design principles) to generate compliant code
- **Validation**: Validates against project rules and warns of violations
- **Format Support**: Supports all image formats (PNG, JPG, WEBP, etc.)

**Configuration:**
```json
{
  "aider.screenshot.defaultProvider": "ollama",
  "aider.screenshot.autoSelectVisionModel": true,
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision",
  "aider.aiProvider.ollama.preloadVisionModel": true
}
```

For detailed instructions, see [SCREENSHOT_CONTEXT_GUIDE.md](SCREENSHOT_CONTEXT_GUIDE.md).

### Project Context Management

Define and manage project-specific rules, design principles, and patterns:

1. **Open Project Context Panel**: Run "Aider: View Project Context" command
2. **Add Your Project Context**:
   - Set framework (e.g., "Next.js 14", "React 18")
   - Add rules (e.g., "Use TypeScript", "No inline styles")
   - Define design principles (e.g., "Mobile-first", "WCAG 2.1 AA")
   - Set project goals (e.g., "Build MVP by Q2")
   - Create coding patterns (e.g., "API calls use custom hooks")
3. **Context is automatically applied** to all AI code generation
4. **Edit anytime** by clicking items or running "Aider: Edit Project Context"

**Storage:**
- Context saved in `.aider/project-context.json`
- Automatically created on first use
- Can be committed to version control for team sharing
- Updates persist automatically

**Benefits:**
- AI generates code that follows your standards
- Consistent code style across the project
- Reduces manual code review for style issues
- Easy onboarding for new team members

For detailed instructions, see [SCREENSHOT_CONTEXT_GUIDE.md](SCREENSHOT_CONTEXT_GUIDE.md).

### Undoing Changes

Click "Undo" in the notification, or run "Aider: Undo Last Changes" from the command palette.

## Configuration

Access settings via File > Preferences > Settings, then search for "Aider":

### General Settings
- `aider.apiEndpoint`: Backend API endpoint URL (default: `http://localhost:8501`)
- `aider.modelName`: AI model to use (e.g., `claude-3-7-sonnet-20250219`, `gpt-4o`)
- `aider.autoCommit`: Automatically commit changes (default: `true`)
- `aider.showDiffs`: Show diffs when changes are applied (default: `true`)
- `aider.previewUrl`: Default URL for live preview (default: `http://localhost:3000`)
- `aider.enableInspector`: Enable component/CSS inspector in live preview (default: `true`)
- `aider.autoOpenPreview`: Automatically open app preview panel on startup (default: `true`)

### AI Provider Settings
- `aider.aiProvider.default`: Default provider (`default`, `ollama`, `copilot`)
- `aider.aiProvider.autoSelect`: Automatically choose provider based on task complexity
- `aider.aiProvider.ollama.enabled`: Enable Ollama provider
- `aider.aiProvider.ollama.endpoint`: Ollama API endpoint (default: `http://localhost:11434`)
- `aider.aiProvider.ollama.model`: Ollama model to use (default: `llama2`)
- `aider.aiProvider.ollama.visionModel`: Vision model for screenshot analysis (default: `llama3.2-vision`)
- `aider.aiProvider.ollama.preloadVisionModel`: Preload vision model on startup (default: `true`)
- `aider.aiProvider.copilot.enabled`: Enable GitHub Copilot provider

### Screenshot & Context Settings
- `aider.screenshot.enabled`: Enable screenshot-to-code generation (default: `true`)
- `aider.screenshot.defaultProvider`: AI provider for screenshot analysis (default: `ollama`)
- `aider.screenshot.autoSelectVisionModel`: Auto-select vision model for screenshots (default: `true`)
- `aider.projectContext.enabled`: Enable project-level context storage (default: `true`)
- `aider.projectContext.autoUpdate`: Automatically update project context (default: `true`)

### GitHub Integration Settings
- `aider.aiProvider.ollama.endpoint`: Ollama API endpoint (default: `http://localhost:11434`)
- `aider.aiProvider.ollama.model`: Ollama model to use (e.g., `llama2`, `codellama`)
- `aider.aiProvider.copilot.enabled`: Enable GitHub Copilot provider

For detailed provider configuration, see [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md).

## Commands

All commands are available through the Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

### Chat Commands
- `Aider: Start Chat` - Open the Aider chat panel in the sidebar
- `Aider: Send Message` - Send a message to Aider via input box
- `Aider: Paste to Chat` - Paste clipboard content into chat input

### File Management Commands
- `Aider: Add File to Chat` - Add current file to chat context
- `Aider: Remove File from Chat` - Remove file from chat context
- `Aider: Clear Chat History` - Clear all chat messages

### Change Management Commands
- `Aider: Undo Last Changes` - Revert last commit made by Aider
- `Aider: Show Diff` - Display changes since last message

### Preview Commands
- `Aider: Open App Preview` - Open full-page app preview panel
- `Aider: Refresh Preview` - Reload the preview panel
- `Aider: Set Preview URL` - Set the URL for live preview
- `Aider: Highlight Element in Preview` - Highlight a specific element by XPath
- `Aider: Scroll to Element in Preview` - Scroll to and highlight an element

### Screenshot Commands
- `Aider: Upload Screenshot for Code Generation` - Upload a screenshot to generate code
- `Aider: Paste Screenshot from Clipboard` - Paste screenshot for code generation

### Project Context Commands
- `Aider: View Project Context` - Open project context panel
- `Aider: Edit Project Context` - Edit project rules, design principles, and patterns

### GitHub Integration Commands
- `Aider GitHub: Push Changes` - Push changes to remote repository
- `Aider GitHub: Pull Changes` - Pull changes from remote repository
- `Aider GitHub: Create Branch` - Create a new git branch
- `Aider GitHub: Create Pull Request` - Create a pull request on GitHub
- `Aider GitHub: Clone Repository` - Clone a GitHub repository
- `Aider GitHub: Fetch Template` - Fetch and apply a repository template
- `Aider GitHub: Natural Language Command` - Execute GitHub operations using natural language
- `Aider GitHub: Authenticate` - Authenticate with GitHub CLI

**Note**: GitHub commands require the GitHub CLI (`gh`) to be installed and authenticated. See [Prerequisites](#prerequisites) for setup instructions.

## Setting Up Aider Backend

The extension requires a running Aider backend. To start it:

```bash
# Install Aider
pip install aider-chat

# Start in your project directory
cd /path/to/your/project
aider --browser
```

This will start Aider with a web interface on `http://localhost:8501`.

## VS Code Web Support

This extension is fully compatible with VS Code Web (vscode.dev, github.dev). Make sure your Aider backend is accessible from your browser.

For remote development, configure the `aider.apiEndpoint` setting to point to your backend URL.

## Troubleshooting

### Extension not connecting to Aider

**Symptoms**: Error messages about "Cannot connect to Aider backend"

**Solutions**:
1. Verify Aider is running: Visit `http://localhost:8501` in your browser
2. Check the `aider.apiEndpoint` setting in VS Code (File > Preferences > Settings > Aider)
3. Ensure no firewall is blocking the connection
4. Check the Output panel (View > Output) and select "Aider" to see detailed logs
5. Try restarting the Aider backend with `aider --browser`

### Changes not being applied

**Symptoms**: Code changes suggested by Aider aren't appearing in files

**Solutions**:
1. Ensure you're in a Git repository (`git init` if needed)
2. Check that files are not read-only
3. Verify Aider has write permissions to the files
4. Check for error messages in the Output panel

### Chat not responding

**Symptoms**: Messages sent but no response from Aider

**Solutions**:
1. Check the Output panel (View > Output) and select "Aider" from the dropdown
2. Look for error messages or connection issues
3. Verify the backend is responding: `curl http://localhost:8501/api/health`
4. Try restarting the extension: Developer: Reload Window command
5. Check if the AI model is available and configured correctly

### GitHub CLI commands not working

**Symptoms**: GitHub commands fail with "gh is not installed" error

**Solutions**:
1. Install GitHub CLI: https://cli.github.com/
2. Authenticate with: `gh auth login`
3. Verify installation: `gh --version`
4. Restart VS Code after installing
5. Check the "Aider GitHub" output channel for detailed errors

The extension will gracefully disable GitHub features if the CLI is unavailable.

### TypeScript compilation errors

**Symptoms**: Build fails with TypeScript errors

**Solutions**:
```bash
cd vscode-extension
rm -rf node_modules package-lock.json
npm install
npm run compile
```

### Extension not loading

**Symptoms**: Aider icon doesn't appear in Activity Bar

**Solutions**:
1. Check VS Code version is 1.85.0 or higher
2. Look for activation errors: Developer: Show Logs > Extension Host
3. Try reinstalling the extension
4. Check that `out/extension.js` exists in the extension directory

### Preview panel not loading

**Symptoms**: Preview panel shows blank or error

**Solutions**:
1. Verify your app is running at the configured URL
2. Check CORS settings on your development server
3. Try refreshing the preview panel
4. Update the preview URL: "Aider: Set Preview URL" command

For more help:
- See [USAGE.md](USAGE.md) for detailed usage instructions
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if it exists
- Open an issue on GitHub with error logs from the Output panel

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Aider-AI/aider.git
cd aider/vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes (auto-recompile)
npm run watch
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Packaging

Create a `.vsix` package for distribution:

```bash
# Package the extension
npm run package

# This creates: aider-vscode-0.1.0.vsix
```

Install the package in VS Code:
1. Extensions view (Ctrl+Shift+X)
2. Click `...` menu → "Install from VSIX..."
3. Select the `.vsix` file

### Debugging

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Set breakpoints in TypeScript files
4. Use Debug Console to inspect variables
5. Reload with Ctrl+R (Cmd+R) to test changes

### Project Structure

```
vscode-extension/
├── src/                    # TypeScript source files
│   ├── extension.ts        # Main extension entry point
│   ├── aiderClient.ts      # Aider API client
│   ├── githubClient.ts     # GitHub CLI integration
│   ├── chatProvider.ts     # Chat webview provider
│   ├── filesProvider.ts    # Files tree view
│   ├── previewProvider.ts  # Preview webview provider
│   ├── providerManager.ts  # AI provider management
│   └── test/               # Test files
├── out/                    # Compiled JavaScript (gitignored)
├── package.json            # Extension manifest
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

### Making Changes

1. Modify TypeScript files in `src/`
2. Run `npm run compile` (or use watch mode)
3. Reload Extension Development Host (Ctrl+R / Cmd+R)
4. Test your changes
5. Run tests: `npm run test`
6. Run linter: `npm run lint`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Ensure linting passes
6. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

### Testing

```bash
npm run test
```

### Packaging

```bash
npm run package
```

This creates a `.vsix` file you can distribute or install locally.

## Contributing

Contributions are welcome! Please see the main Aider repository for contribution guidelines.

## License

Apache-2.0 - See LICENSE file for details

## Links

- [Aider GitHub](https://github.com/Aider-AI/aider)
- [Aider Documentation](https://aider.chat)
- [Report Issues](https://github.com/Aider-AI/aider/issues)
