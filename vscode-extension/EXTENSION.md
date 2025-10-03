# VS Code Extension for Aider

This directory contains the VS Code extension for Aider, enabling seamless interaction with the Aider backend directly from VS Code.

## Features

- **Interactive Chat**: Real-time conversations with Aider through a webview panel
- **File Management**: Add and remove files from chat context
- **Live Updates**: Apply code changes directly to your project
- **VS Code Web Support**: Works in both desktop and web versions of VS Code
- **Git Integration**: Automatic commits and undo support

## Development

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- VS Code 1.85.0 or higher

### Setup

```bash
cd vscode-extension
npm install
```

### Building

```bash
npm run compile
```

### Running in Debug Mode

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. Test the extension in the new window

### Testing

```bash
npm run test
```

### Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be installed in VS Code.

## Architecture

The extension consists of several key components:

- **extension.ts**: Main entry point, handles activation and command registration
- **aiderClient.ts**: HTTP client for communicating with Aider backend
- **chatProvider.ts**: Webview provider for the chat interface
- **filesProvider.ts**: Tree view provider for managing files in chat

## API Integration

The extension communicates with the Aider backend through a REST API. The expected endpoints are:

- `POST /api/chat` - Send a message
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/clear` - Clear chat
- `POST /api/files/add` - Add file to chat
- `POST /api/files/remove` - Remove file from chat
- `GET /api/files` - List files in chat
- `POST /api/undo` - Undo last commit
- `GET /api/diff` - Get diff of changes
- `GET /api/health` - Health check

## Configuration

The extension can be configured through VS Code settings:

- `aider.apiEndpoint`: Backend API URL
- `aider.modelName`: AI model to use
- `aider.autoCommit`: Auto-commit changes
- `aider.showDiffs`: Show diffs when applying changes

## Contributing

Contributions are welcome! Please follow the standard VS Code extension development guidelines.

## License

Apache-2.0
