# Aider VS Code Extension

AI pair programming with Aider directly in VS Code. This extension enables seamless interaction with the Aider backend for collaborative app building.

## Features

- **Real-time Chat**: Interact with Aider through a built-in chat interface
- **File Management**: Add/remove files from the chat context
- **Live Changes**: Apply code changes directly to your project
- **Diff Viewing**: See exactly what changes Aider makes
- **Undo Support**: Easily revert changes with one click
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

### Starting a Chat

1. Click on the Aider icon in the Activity Bar
2. Type your request in the chat input
3. Aider will analyze your code and suggest changes

### Adding Files to Chat

- **Option 1**: Open a file and run "Aider: Add File to Chat" from the command palette (Ctrl+Shift+P)
- **Option 2**: Right-click a file and select "Add to Aider Chat"

### Applying Changes

Aider will automatically apply changes to your files. You'll see:
- A notification showing which files were modified
- A diff view (if enabled in settings)
- An option to undo the changes

### Undoing Changes

Click "Undo" in the notification, or run "Aider: Undo Last Changes" from the command palette.

## Configuration

Access settings via File > Preferences > Settings, then search for "Aider":

- `aider.apiEndpoint`: Backend API endpoint URL (default: `http://localhost:8501`)
- `aider.modelName`: AI model to use (e.g., `claude-3-7-sonnet-20250219`, `gpt-4o`)
- `aider.autoCommit`: Automatically commit changes (default: `true`)
- `aider.showDiffs`: Show diffs when changes are applied (default: `true`)

## Commands

All commands are available through the Command Palette (Ctrl+Shift+P):

- `Aider: Start Chat` - Open the Aider chat panel
- `Aider: Send Message` - Send a message to Aider
- `Aider: Add File to Chat` - Add current file to chat context
- `Aider: Remove File from Chat` - Remove file from chat context
- `Aider: Clear Chat History` - Clear all messages
- `Aider: Undo Last Changes` - Revert last commit
- `Aider: Show Diff` - Display changes since last message

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
