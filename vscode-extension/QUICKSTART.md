# VS Code Extension Quick Start Guide

This is a quick start guide to get the Aider VS Code extension up and running in 5 minutes.

## Prerequisites

- VS Code 1.85.0 or higher
- Python 3.10+
- Node.js 20.x+ (for building extension)
- Git repository (for your project)

## Step 1: Install Dependencies

```bash
# Install Aider
pip install aider-chat

# Install API server dependencies
pip install flask flask-cors
```

## Step 2: Build the Extension

```bash
cd vscode-extension
npm install
npm run compile
```

## Step 3: Install Extension (Choose One)

### Option A: Development Mode (Recommended for Testing)
1. Open `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window opens with the extension loaded

### Option B: Package and Install
```bash
npm run package
# Install the .vsix file through VS Code Extensions panel
```

## Step 4: Start the API Server

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

## Step 5: Configure Extension

1. Open VS Code Settings (Ctrl+,)
2. Search for "Aider"
3. Set `aider.apiEndpoint` to `http://localhost:5000`
4. (Optional) Set `aider.modelName` to your preferred model

## Step 6: Start Using Aider

1. Click the Aider icon in the Activity Bar (left sidebar)
2. Chat panel opens
3. Add files: Open a file, then run "Aider: Add File to Chat" from Command Palette
4. Type your request: "Add a function to calculate fibonacci numbers"
5. Press Enter and watch Aider work!

## Common Commands

Open Command Palette (Ctrl+Shift+P) and type:
- `Aider: Start Chat` - Open chat panel
- `Aider: Add File to Chat` - Add current file
- `Aider: Clear Chat History` - Start fresh
- `Aider: Undo Last Changes` - Revert changes
- `Aider: Show Diff` - View what changed

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

## Troubleshooting

### Extension doesn't start
- Check Extension Development Host console for errors
- Verify TypeScript compiled successfully (`npm run compile`)

### Can't connect to backend
- Verify API server is running: `curl http://localhost:5000/api/health`
- Check `aider.apiEndpoint` setting matches server URL
- Look for errors in Output panel (View → Output → Aider)

### No AI responses
- Check API key is set: `echo $OPENAI_API_KEY` or `echo $ANTHROPIC_API_KEY`
- Verify model name is correct in settings
- Check API server logs for errors

## Next Steps

- Read [USAGE.md](USAGE.md) for detailed documentation
- Check [examples/README.md](examples/README.md) for more examples
- See [EXTENSION.md](EXTENSION.md) for architecture details

## Quick Tips

1. **Start Simple**: Add one file, make one change, see how it works
2. **Use Undo**: Don't like a change? Just undo it
3. **View Diffs**: Always review what Aider changed
4. **Iterate**: Refine your requests based on results
5. **Commit Often**: Use Git to track Aider's changes

## Support

- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Aider Documentation](https://aider.chat)
- [VS Code Extension Docs](https://code.visualstudio.com/api)

Happy coding with Aider! 🚀
