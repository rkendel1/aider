# AI Provider Integration

The Aider VS Code extension supports multiple AI providers, allowing you to leverage different AI models for different tasks. Choose the best provider for your needs, or let Aider choose automatically.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Supported Providers](#supported-providers)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development Container](#development-container)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

## Overview

### Available Providers

- **Default Provider**: Uses your configured Aider backend model (GPT-4, Claude, etc.)
- **Ollama**: Local AI models for fast, lightweight tasks
- **GitHub Copilot**: Advanced AI for complex, context-heavy work

### Key Features

- **Manual Selection**: Choose your provider per message
- **Automatic Selection**: Let Aider pick based on task complexity
- **Visual Indicators**: See which provider generated each response
- **Seamless Switching**: Change providers without restarting

## Quick Start

### Option 1: Use Default Provider (No Setup)

Already working! Your existing Aider configuration continues to work with no changes.

### Option 2: Enable Ollama (Local AI)

**In Development Container (Recommended):**

1. Start your dev container - Ollama is pre-installed
2. Pull a model (one-time):
   ```bash
   ollama pull llama2
   # or for code tasks:
   ollama pull codellama
   ```
3. Enable in VS Code Settings (Ctrl+,):
   - Search for "aider"
   - Check: `Aider > AI Provider: Ollama: Enabled`
4. Select "Ollama" from chat dropdown

**On Your Local Machine:**

1. Install Ollama: https://ollama.com/download
2. Pull a model: `ollama pull llama2`
3. Start Ollama: `ollama serve`
4. Enable in VS Code settings as above

### Option 3: Enable GitHub Copilot

1. Ensure you have an active GitHub Copilot subscription
2. Authenticate: Run `Aider GitHub: Authenticate` from Command Palette
3. Enable in settings: `Aider > AI Provider: Copilot: Enabled`
4. Select "GitHub Copilot" from chat dropdown

## Supported Providers

### Default Provider

Uses your Aider backend configuration.

**Best for:**
- General purpose tasks
- When you want consistent behavior
- Tasks requiring your specific model

**Configuration:**
```json
{
  "aider.apiUrl": "http://localhost:5000"
}
```

### Ollama

Local AI models running on your machine or in the dev container.

**Best for:**
- Simple boilerplate generation
- Quick documentation
- Basic code fixes
- Template creation
- Offline work

**Available Models:**
- `llama2` - General purpose
- `codellama` - Code-focused
- `mistral` - Fast and efficient
- `deepseek-coder` - Code generation specialist
- `llama3.2-vision` - Vision-capable (preloaded in container)

**Configuration:**
```json
{
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
  "aider.aiProvider.ollama.model": "llama2",
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision"
}
```

### GitHub Copilot

Advanced AI using GitHub's infrastructure.

**Best for:**
- Complex refactoring
- Architecture design
- Performance optimization
- Security analysis
- Advanced algorithms

**Configuration:**
```json
{
  "aider.aiProvider.copilot.enabled": true
}
```

## Configuration

### Manual Provider Selection

1. Open Aider chat view
2. Use the dropdown at the top to select provider
3. Type message and send
4. Response generated using selected provider

### Automatic Provider Selection

Enable smart provider selection based on task complexity:

1. Go to VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "Aider"
3. Enable: `Aider > AI Provider: Auto Select`

**How it works:**

The extension analyzes your query and automatically selects:

- **Ollama** for simple tasks:
  - Boilerplate code
  - Comments and documentation
  - Basic fixes
  - Templates

- **Copilot/Default** for complex tasks:
  - Architecture design
  - Refactoring
  - Performance optimization
  - Security analysis
  - Complex algorithms

### Set Default Provider

```json
{
  "aider.aiProvider.default": "ollama"  // or "copilot" or "default"
}
```

## Usage

### Example 1: Simple Boilerplate with Ollama

1. Select "Ollama" from provider dropdown
2. Message: "Create a simple Express.js server with a hello world endpoint"
3. Ollama generates basic code quickly

### Example 2: Complex Refactoring with Copilot

1. Select "GitHub Copilot" from provider dropdown
2. Message: "Refactor this React component to use hooks and optimize performance"
3. Copilot provides sophisticated, context-aware refactoring

### Example 3: Auto-Select Mode

1. Enable auto-select in settings
2. Simple query: "Add a comment to this function" → Uses Ollama
3. Complex query: "Design a scalable microservices architecture" → Uses Copilot

### Provider Indicators

Each message shows which provider was used:
- User messages display selected provider
- Assistant responses include provider badge (e.g., "(ollama)", "(copilot)")

## Development Container

The development container includes pre-configured Ollama support.

### What's Included

1. **Ollama Installation**: Pre-installed and configured
2. **Automatic Startup**: Starts with supervisord
3. **Port Exposure**: Port 11434 for API access
4. **Model Storage**: `/home/coder/.ollama/models`
5. **Vision Model**: `llama3.2-vision` auto-preloaded

### Using Ollama in Container

1. Start development container
2. Vision model loads automatically on startup
3. Pull additional models:
   ```bash
   ollama pull llama2
   ollama pull codellama
   ```

4. Test Ollama:
   ```bash
   curl http://localhost:11434/api/generate -d '{
     "model": "llama2",
     "prompt": "Hello, world!"
   }'
   ```

5. Verify vision model:
   ```bash
   ollama list  # Should show llama3.2-vision
   ```

### Vision Model Support

**Preloaded Model**: `llama3.2-vision`
- Automatically pulled on container startup
- Ready for screenshot-to-code generation
- Supports image analysis

**Configuration:**
```json
{
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision",
  "aider.screenshot.defaultProvider": "ollama",
  "aider.screenshot.autoSelectVisionModel": true
}
```

### Environment Variables

- `OLLAMA_HOST`: `0.0.0.0:11434`
- `OLLAMA_MODELS`: `/home/coder/.ollama/models`
- `OLLAMA_VISION_MODEL`: `llama3.2-vision`

## Troubleshooting

### Ollama Not Available

If Ollama is not responding:

1. Check if running:
   ```bash
   ps aux | grep ollama
   ```

2. Restart service:
   ```bash
   supervisorctl restart ollama
   ```

3. Check logs:
   ```bash
   supervisorctl tail -f ollama
   ```

### Copilot Authentication Issues

If authentication fails:

1. Check status: `gh auth status`
2. Re-authenticate: `gh auth login`
3. Verify Copilot subscription is active

### Provider Not Listed

If provider missing from dropdown:

1. Check it's enabled in settings
2. Restart VS Code window
3. Check extension output for errors

### Vision Model Not Working

If vision model unavailable:

1. Verify it's installed:
   ```bash
   ollama list
   ```

2. Pull manually if needed:
   ```bash
   ollama pull llama3.2-vision
   ```

3. Check container logs:
   ```bash
   supervisorctl tail -f ollama
   ```

## Architecture

### Provider Manager

The `ProviderManager` class (`providerManager.ts`) handles:
- Provider registration and configuration
- Provider selection (manual and automatic)
- Query complexity analysis

### Query Complexity Analysis

Auto-selection uses heuristics:
- **Pattern matching**: Keywords like "refactor", "optimize", "architecture"
- **Length analysis**: Short queries → Ollama, long → Copilot
- **Context needs**: Simple → Ollama, complex → Copilot

### API Integration

The `AiderClient` supports provider parameters:

```typescript
await aiderClient.sendMessage(message, AIProvider.Ollama);
```

Messages include provider metadata for tracking.

## Comparison Table

| Feature | Default | Ollama | GitHub Copilot |
|---------|---------|---------|----------------|
| **Setup Required** | Minimal | Medium | Medium |
| **Speed** | Medium | Fast | Medium |
| **Context Awareness** | High | Low-Medium | Very High |
| **Offline Support** | No | Yes | No |
| **Cost** | Pay-per-use | Free (local) | Subscription |
| **Best For** | General use | Quick tasks | Complex tasks |

## Future Enhancements

Planned improvements:
1. Provider performance metrics
2. Custom selection rules
3. Cost tracking per provider
4. Automatic provider fallback
5. Model selection within providers
6. Hybrid responses from multiple providers

## Contributing

To add a new provider:

1. Add provider type to `AIProvider` enum in `providerManager.ts`
2. Update `ProviderManager` constructor
3. Update UI dropdown in `chatProvider.ts`
4. Update settings in `package.json`
5. Document the provider

## References

- [Ollama Documentation](https://ollama.ai/docs)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Aider Documentation](https://aider.chat/docs)
- [Provider Manager Source](../../../vscode-extension/src/providerManager.ts)

---

*For quick reference, see [Quick Start](#quick-start). For implementation details, see [Architecture](../development/architecture.md).*
