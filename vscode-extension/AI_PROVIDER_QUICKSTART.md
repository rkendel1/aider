# AI Provider Quick Start Guide

Get up and running with multi-provider AI in 5 minutes!

## Prerequisites

- Aider VS Code extension installed
- Aider backend running
- Development container (for Ollama) OR local Ollama installation

## Quick Setup

### Option 1: Use Default Provider (No Setup Required)

Already working! Your existing Aider configuration continues to work with no changes.

### Option 2: Enable Ollama (Local AI)

**In Development Container (Recommended):**

1. Start your dev container - Ollama is already installed!

2. Pull a model (one-time setup):
   ```bash
   # Open terminal in VS Code
   ollama pull llama2
   # or for code-focused tasks:
   ollama pull codellama
   ```

3. Enable Ollama in VS Code:
   - Open Settings (Ctrl+,)
   - Search for "aider"
   - Check: `Aider > AI Provider: Ollama: Enabled`
   - Verify endpoint is: `http://localhost:11434`

4. Done! Select "Ollama" from the chat dropdown.

**On Your Local Machine:**

1. Install Ollama: https://ollama.com/download

2. Pull a model:
   ```bash
   ollama pull llama2
   ```

3. Start Ollama:
   ```bash
   ollama serve
   ```

4. Enable in VS Code (same as above)

### Option 3: Enable GitHub Copilot

1. Ensure you have an active GitHub Copilot subscription

2. Authenticate with GitHub:
   - Command Palette (Ctrl+Shift+P)
   - Run: `Aider GitHub: Authenticate`
   - Follow the prompts

3. Enable Copilot in VS Code:
   - Open Settings (Ctrl+,)
   - Search for "aider"
   - Check: `Aider > AI Provider: Copilot: Enabled`

4. Done! Select "GitHub Copilot" from the chat dropdown.

## Using the Extension

### Manual Provider Selection

1. Open Aider chat (click Aider icon in sidebar)
2. Look for the dropdown at the top: `AI Provider: [Default ▼]`
3. Click to select:
   - **Default** - Your configured backend model
   - **Ollama** - Local, fast AI
   - **GitHub Copilot** - Advanced AI
4. Type your message and send!

### Automatic Provider Selection

Let Aider choose the best provider for each task:

1. Open Settings (Ctrl+,)
2. Search for "aider auto select"
3. Check: `Aider > AI Provider: Auto Select`
4. Now just type and send - Aider picks the best provider!

**How it works:**
- Simple tasks (comments, boilerplate) → Uses Ollama
- Complex tasks (refactoring, architecture) → Uses Copilot/Default

## Example Workflows

### Workflow 1: Quick Boilerplate (Ollama)

**Task:** Generate a simple Express.js route

1. Select "Ollama" from dropdown
2. Type: "Create a simple GET route for /api/users"
3. Send → Get fast, local response!

**Why Ollama?** 
- Fast local response
- No API costs
- Perfect for simple, common patterns

### Workflow 2: Complex Refactoring (Copilot)

**Task:** Optimize a React component

1. Add your component file to chat
2. Select "GitHub Copilot" from dropdown
3. Type: "Refactor this component to use React hooks and optimize re-renders"
4. Send → Get sophisticated, context-aware refactoring!

**Why Copilot?**
- Understands complex context
- Better at architectural changes
- Handles nuanced requirements

### Workflow 3: Auto-Select Mode

**Task:** Mixed simple and complex work

1. Enable auto-select in settings
2. Type: "Add JSDoc comments" → Auto-uses Ollama
3. Type: "Design a scalable data layer" → Auto-uses Copilot
4. No manual switching needed!

## Provider Indicators

Watch for provider badges in the chat:

```
You: "Create a simple function"
(You selected: ollama)

Assistant (ollama): "Here's the function..."
[Response from Ollama]

You: "Optimize the database queries"
(You selected: copilot)

Assistant (copilot): "I'll refactor for performance..."
[Response from Copilot]
```

## Recommended Settings

For the best experience, copy this into your VS Code settings.json:

```json
{
  "aider.aiProvider.default": "default",
  "aider.aiProvider.autoSelect": false,
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
  "aider.aiProvider.ollama.model": "codellama",
  "aider.aiProvider.copilot.enabled": true
}
```

**Customize:**
- Set `autoSelect: true` if you want automatic provider selection
- Change `ollama.model` to your preferred model
- Set `default` to your most-used provider

## Troubleshooting

### Ollama shows "disabled" in dropdown

**Check:**
1. Is Ollama running? `ps aux | grep ollama`
2. Is it enabled in settings? Search "aider ollama enabled"
3. Try restarting VS Code

**Fix:**
```bash
# In dev container or local machine
ollama serve
```

### Copilot shows "disabled" in dropdown

**Check:**
1. Is Copilot enabled in settings?
2. Are you authenticated? Run: `gh auth status`

**Fix:**
```bash
gh auth login
```

### Provider selection not working

**Try:**
1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Check extension output for errors
3. Verify Aider backend is running

## Next Steps

- Read [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) for comprehensive documentation
- Try different Ollama models: https://ollama.com/library
- Experiment with auto-select mode
- Check [AI_PROVIDER_IMPLEMENTATION.md](AI_PROVIDER_IMPLEMENTATION.md) for technical details

## Tips

✅ **Use Ollama for**: Comments, boilerplate, simple fixes, templates, documentation

✅ **Use Copilot for**: Refactoring, architecture, optimization, complex algorithms, security

✅ **Use Auto-select when**: You want to focus on coding, not provider management

✅ **Pull multiple Ollama models**: Have specialized models for different tasks
```bash
ollama pull codellama      # For code
ollama pull mistral        # Fast general purpose
ollama pull deepseek-coder # Advanced coding
```

## Support

Having issues? 
1. Check the [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) troubleshooting section
2. Review extension output logs
3. Open an issue on GitHub with provider info and error messages

Happy coding with multi-provider AI! 🚀
