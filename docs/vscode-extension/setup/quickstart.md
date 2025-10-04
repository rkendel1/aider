# VS Code Extension Quick Start

Get the Aider VS Code extension up and running in 5 minutes.

## Prerequisites

- **VS Code**: 1.85.0 or higher
- **Python**: 3.10+
- **Node.js**: 20.x+ (for building extension)
- **Git**: Repository for your project

## Installation

### Step 1: Install Dependencies

```bash
# Install Aider
pip install aider-chat

# Install API server dependencies
pip install flask flask-cors
```

### Step 2: Build the Extension

```bash
cd vscode-extension
npm install
npm run compile
```

### Step 3: Install Extension

Choose one of these methods:

**Option A: Development Mode (Recommended for Testing)**
1. Open `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window opens with the extension loaded

**Option B: Package and Install**
```bash
npm run package
# Install the .vsix file through VS Code Extensions panel
```

### Step 4: Start the API Server

```bash
# Option 1: Using example script
cd vscode-extension/examples
python start_aider_api.py

# Option 2: Minimal version
python minimal_api.py
```

You should see:
```
Aider API Server is running at http://localhost:5000
```

### Step 5: Configure Extension

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "Aider"
3. Set `aider.apiEndpoint` to `http://localhost:5000`
4. (Optional) Set `aider.modelName` to your preferred model

## First Steps

### 1. Open the Chat

1. Click the Aider icon in the Activity Bar (left sidebar)
2. Chat panel opens on the side

### 2. Add Files

**Method 1: Command Palette**
1. Open a file you want to work with
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "Aider: Add File to Chat"
4. Press Enter

**Method 2: File Explorer**
1. Right-click a file in Explorer
2. Select "Add to Aider Chat"

### 3. Start Chatting

1. Type your request in the chat: "Add a function to calculate fibonacci numbers"
2. Press Enter
3. Watch Aider analyze and make changes!
4. Review the diff to see what changed

## Common Commands

Open Command Palette (Ctrl+Shift+P) and type:

| Command | Description |
|---------|-------------|
| `Aider: Start Chat` | Open chat panel |
| `Aider: Add File to Chat` | Add current file to context |
| `Aider: Remove File from Chat` | Remove file from context |
| `Aider: Clear Chat History` | Start fresh conversation |
| `Aider: Undo Last Changes` | Revert Aider's changes |
| `Aider: Show Diff` | View what changed |
| `Aider: Open Live Preview` | Open app preview |

## Example Workflow

```
1. Open your project in VS Code
2. Start API server in terminal
3. Open a file you want to modify
4. Add it to chat (Ctrl+Shift+P → "Aider: Add File to Chat")
5. Type your request in the chat
6. Aider analyzes and makes changes
7. Review the diff
8. Commit or undo as needed
```

## Quick Tips

1. **Start Simple**: Add one file, make one change, see how it works
2. **Use Undo**: Don't like a change? Just undo it with one click
3. **View Diffs**: Always review what Aider changed before committing
4. **Iterate**: Refine your requests based on results
5. **Commit Often**: Use Git to track Aider's changes
6. **Add Context**: Add related files to help Aider understand your project

## Troubleshooting

### Extension Doesn't Start

**Problem**: Extension fails to load or activate

**Solutions**:
- Check Extension Development Host console for errors
- Verify TypeScript compiled successfully: `npm run compile`
- Try rebuilding: `npm run clean && npm run compile`
- Check VS Code version is 1.85.0 or higher

### Can't Connect to Backend

**Problem**: "Failed to connect to Aider API" error

**Solutions**:
- Verify API server is running: `curl http://localhost:5000/api/health`
- Check `aider.apiEndpoint` setting matches server URL
- Look for errors in Output panel (View → Output → Aider)
- Ensure no firewall is blocking port 5000

### No AI Responses

**Problem**: Aider doesn't respond to messages

**Solutions**:
- Check API key is set:
  ```bash
  echo $OPENAI_API_KEY
  # or
  echo $ANTHROPIC_API_KEY
  ```
- Verify model name is correct in settings
- Check API server logs for errors
- Ensure you have sufficient API credits

### Files Not Being Modified

**Problem**: Aider responds but doesn't modify files

**Solutions**:
- Ensure files are added to chat context (check Files panel)
- Verify files are not read-only
- Check that Aider has permission to write to your project directory
- Try with a simple request first: "Add a comment to this function"

## Using with Docker Container

If using the Docker development container:

1. Container automatically starts Ollama and Aider API
2. Extension connects to `http://localhost:5000` by default
3. Vision model (`llama3.2-vision`) is preloaded for screenshots
4. No additional setup needed!

See [Docker Documentation](../../docker/README.md) for details.

## Next Steps

### Learn More Features

- **[AI Providers](../features/ai-providers.md)** - Use Ollama or GitHub Copilot
- **[Live Preview](../features/live-preview.md)** - Preview your app with inspector
- **[Vision Models](../features/vision-models.md)** - Screenshot-to-code generation
- **[GitHub Integration](../features/github-integration.md)** - Push and create PRs

### Detailed Guides

- **[Full Usage Guide](../usage/getting-started.md)** - Comprehensive usage documentation
- **[Chat Interface](../usage/chat-interface.md)** - Advanced chat features
- **[Common Workflows](../usage/workflows.md)** - Typical usage patterns

### Development

- **[Architecture](../development/architecture.md)** - How the extension works
- **[Contributing](../development/contributing.md)** - Development guide

## Support

- **Issues**: [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- **Documentation**: [Aider Docs](https://aider.chat/docs)
- **Community**: [Aider Discord](https://discord.gg/aider)

---

**Ready to go?** Start with a simple request and explore from there! 🚀

*Having trouble? Check [Troubleshooting](#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).*
