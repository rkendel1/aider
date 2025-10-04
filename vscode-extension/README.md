# Aider VS Code Extension

AI pair programming with Aider directly in VS Code. This extension enables seamless interaction with the Aider backend for collaborative app building.

## Features

- **Visual-First Workflow**: Full-page app preview as the primary view with Aider sidebar for quick access
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

- VS Code 1.85.0 or higher
- Aider backend running (locally or remote)
- Git repository for your project

## Installation

### From VSIX (Development)

1. Download the `.vsix` file
2. In VS Code, go to Extensions view (Ctrl+Shift+X)
3. Click the `...` menu and select "Install from VSIX..."
4. Select the downloaded `.vsix` file

### From Source

1. Clone the repository
2. Navigate to `vscode-extension` directory
3. Run `npm install`
4. Run `npm run compile`
5. Press F5 to launch extension in debug mode

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
- `aider.aiProvider.ollama.model`: Ollama model to use (e.g., `llama2`, `codellama`)
- `aider.aiProvider.copilot.enabled`: Enable GitHub Copilot provider

For detailed provider configuration, see [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md).

## Commands

All commands are available through the Command Palette (Ctrl+Shift+P):

- `Aider: Start Chat` - Open the Aider chat panel
- `Aider: Send Message` - Send a message to Aider
- `Aider: Add File to Chat` - Add current file to chat context
- `Aider: Remove File from Chat` - Remove file from chat context
- `Aider: Clear Chat History` - Clear all messages
- `Aider: Undo Last Changes` - Revert last commit
- `Aider: Show Diff` - Display changes since last message
- `Aider: Open App Preview` - Open full-page app preview panel
- `Aider: Refresh Preview` - Reload the preview panel
- `Aider: Highlight Element in Preview` - Highlight a specific element by XPath
- `Aider: Scroll to Element in Preview` - Scroll to and highlight an element
- `Aider: Set Preview URL` - Set the URL for live preview
- `Aider: Paste to Chat` - Paste clipboard content into chat input

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

1. Verify Aider is running: Visit the endpoint URL in your browser
2. Check the `aider.apiEndpoint` setting
3. Ensure no firewall is blocking the connection

### Changes not being applied

1. Ensure you're in a Git repository
2. Check that files are not read-only
3. Verify Aider has write permissions

### Chat not responding

1. Check the Output panel (View > Output) and select "Aider" from the dropdown
2. Look for error messages
3. Try restarting the extension

## Development

### Building

```bash
npm install
npm run compile
```

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
