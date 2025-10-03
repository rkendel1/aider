# Aider VS Code Extension - Complete Guide

## Overview

This guide provides comprehensive documentation for setting up and using the Aider VS Code extension with the Python backend API.

## Architecture

The solution consists of two main components:

1. **VS Code Extension** (TypeScript) - Frontend UI running in VS Code
2. **Python API Backend** - REST API server integrating with Aider core

```
┌─────────────────────┐
│   VS Code Editor    │
│                     │
│  ┌───────────────┐  │
│  │   Extension   │  │
│  │   (WebView)   │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ HTTP/REST
           │
┌──────────▼──────────┐
│   Python Backend    │
│   (Flask API)       │
│  ┌───────────────┐  │
│  │  Aider Core   │  │
│  │    (Coder)    │  │
│  └───────────────┘  │
└─────────────────────┘
```

## Installation

### 1. Install Python Backend Dependencies

```bash
cd /path/to/aider
pip install flask flask-cors
```

### 2. Build VS Code Extension

```bash
cd vscode-extension
npm install
npm run compile
```

### 3. Install Extension in VS Code

#### Option A: Development Mode
1. Open VS Code
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new window

#### Option B: Package and Install
```bash
cd vscode-extension
npm run package
```

This creates `aider-vscode-0.1.0.vsix`. Install it via:
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Click `...` menu → "Install from VSIX..."
4. Select the `.vsix` file

## Usage

### Starting the Backend API Server

#### Method 1: Programmatically

```python
from aider.main import main as cli_main
from aider.api import create_api_server

# Create coder instance
coder = cli_main(return_coder=True)

# Start API server
server = create_api_server(coder, host='0.0.0.0', port=5000)
server.run(debug=True)
```

#### Method 2: Integration with Existing Aider Code

Add to your existing Aider setup:

```python
from aider.api import create_api_server
import threading

# After creating your coder
api_server = create_api_server(coder, host='localhost', port=5000)

# Run in background thread
api_thread = threading.Thread(target=api_server.run, kwargs={'debug': False})
api_thread.daemon = True
api_thread.start()
```

### Using the Extension

1. **Open a Project in VS Code**
   ```bash
   code /path/to/your/project
   ```

2. **Start the Backend Server** (in a separate terminal)
   ```bash
   cd /path/to/your/project
   python start_aider_api.py
   ```

3. **Configure the Extension**
   - Open VS Code Settings (Ctrl+,)
   - Search for "Aider"
   - Set `aider.apiEndpoint` to `http://localhost:5000`

4. **Open Aider Chat**
   - Click Aider icon in Activity Bar
   - Or run `Aider: Start Chat` from Command Palette (Ctrl+Shift+P)

5. **Chat with Aider**
   - Type your request in the input field
   - Press Enter or click Send
   - Aider will analyze your code and suggest changes

6. **Add Files to Chat**
   - Open a file in VS Code
   - Run `Aider: Add File to Chat` from Command Palette
   - Or click the file in the Files view and use context menu

## Examples

### Example 1: Simple Code Generation

1. Add a Python file to chat
2. Send message: "Create a function to calculate factorial"
3. Aider generates the code
4. Changes are automatically applied
5. Review the diff and commit

### Example 2: Refactoring

1. Add files you want to refactor
2. Send: "Refactor this code to use async/await"
3. Review the changes
4. If you don't like them, click "Undo"

### Example 3: Bug Fix

1. Add the buggy file
2. Send: "Fix the bug where the loop doesn't terminate"
3. Aider analyzes and fixes
4. View the diff to understand the fix

## API Reference

### Extension Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `aider.apiEndpoint` | string | `http://localhost:8501` | Backend API URL |
| `aider.modelName` | string | `""` | AI model to use |
| `aider.autoCommit` | boolean | `true` | Auto-commit changes |
| `aider.showDiffs` | boolean | `true` | Show diffs for changes |

### Commands

All commands are accessible via Command Palette (Ctrl+Shift+P):

- `Aider: Start Chat` - Open chat panel
- `Aider: Send Message` - Quick message dialog
- `Aider: Add File to Chat` - Add current file
- `Aider: Remove File from Chat` - Remove file
- `Aider: Clear Chat History` - Clear all messages
- `Aider: Undo Last Changes` - Revert commit
- `Aider: Show Diff` - View recent changes

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Send message |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/chat/clear` | Clear chat |
| GET | `/api/files` | List files in chat |
| POST | `/api/files/add` | Add file |
| POST | `/api/files/remove` | Remove file |
| POST | `/api/undo` | Undo last commit |
| GET | `/api/diff` | Get diff |

## Troubleshooting

### Extension Can't Connect

**Problem**: Extension shows connection errors

**Solutions**:
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check `aider.apiEndpoint` setting
3. Check firewall settings
4. Look for errors in Output panel (View → Output → Aider)

### Changes Not Applied

**Problem**: Aider suggests changes but they don't appear

**Solutions**:
1. Check if files are in a Git repository
2. Verify files aren't read-only
3. Check Output panel for errors
4. Try manually: `git status` to see if changes were made

### Chat Not Responding

**Problem**: Messages sent but no response

**Solutions**:
1. Check backend logs for errors
2. Verify model configuration
3. Check API key is set (if using cloud model)
4. Try restarting both backend and VS Code

### TypeScript Compilation Errors

**Problem**: Extension won't compile

**Solutions**:
```bash
cd vscode-extension
rm -rf node_modules package-lock.json
npm install
npm run compile
```

## VS Code Web Support

The extension works in VS Code Web (vscode.dev, github.dev):

1. Ensure backend is accessible from your browser
2. May need to configure CORS on the backend
3. Use public URL or tunnel service (ngrok, etc.) for backend

Example with ngrok:
```bash
# Start backend on localhost
python start_api.py

# In another terminal, create tunnel
ngrok http 5000

# Use the ngrok URL in extension settings
```

## Development

### Building from Source

```bash
git clone https://github.com/Aider-AI/aider.git
cd aider/vscode-extension
npm install
npm run compile
```

### Running Tests

```bash
npm run test
```

### Debugging

1. Open `vscode-extension` folder in VS Code
2. Press F5
3. Extension Development Host launches
4. Set breakpoints in TypeScript files
5. Debug normally

### Making Changes

1. Modify TypeScript files in `src/`
2. Run `npm run compile`
3. Reload Extension Development Host (Ctrl+R)
4. Test your changes

## Security Considerations

⚠️ **Important**: The API server does not include authentication.

- Only run on localhost or trusted networks
- Do not expose to the internet without authentication
- Consider implementing API key authentication for production use

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Apache-2.0 - See LICENSE file for details

## Support

- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Documentation](https://aider.chat)
- [Discord Community](https://discord.gg/aider)
