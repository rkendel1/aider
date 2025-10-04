# AI Provider Integration Guide

This document describes the multi-provider AI integration features in the Aider VS Code extension.

## Overview

The Aider VS Code extension now supports multiple AI providers, allowing you to leverage different AI models for different tasks:

- **Default Provider**: Uses the configured Aider backend model (e.g., GPT-4, Claude)
- **Ollama**: Local AI models running inside the development container for quick, lightweight tasks
- **GitHub Copilot**: Advanced AI for complex, context-heavy tasks

## Features

### 1. Manual Provider Selection

You can manually select which AI provider to use for each chat message:

1. Open the Aider chat view in VS Code
2. Use the dropdown menu at the top to select your preferred provider
3. Type your message and send
4. The response will be generated using the selected provider

### 2. Automatic Provider Selection

Enable automatic provider selection to let Aider intelligently choose the best provider based on query complexity:

1. Go to VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Aider"
3. Enable `Aider > AI Provider: Auto Select`

When enabled, the extension will analyze your query and:
- Use **Ollama** for simple tasks like:
  - Boilerplate code generation
  - Simple comments and documentation
  - Basic code fixes
  - Template generation
  
- Use **Copilot** (or Default) for complex tasks like:
  - Architecture design
  - Refactoring
  - Performance optimization
  - Security analysis
  - Complex algorithm implementation

### 3. Provider Configuration

#### Ollama Configuration

To use Ollama as a provider:

1. Ensure Ollama is running (it's automatically started in the dev container)
2. Configure Ollama in VS Code settings:
   ```json
   {
     "aider.aiProvider.ollama.enabled": true,
     "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
     "aider.aiProvider.ollama.model": "llama2"
   }
   ```

Available Ollama models (must be pulled first):
- `llama2` - General purpose
- `codellama` - Code-focused
- `mistral` - Fast and efficient
- `deepseek-coder` - Code generation specialist
- `llama3.2-vision` - Vision-capable model for screenshot analysis (preloaded in container)

To pull a model in the container:
```bash
ollama pull llama2
```

**Note**: The `llama3.2-vision` model is automatically preloaded when the container starts, so you don't need to manually pull it for screenshot-to-code generation.

#### GitHub Copilot Configuration

To use GitHub Copilot as a provider:

1. Ensure you have an active GitHub Copilot subscription
2. Enable Copilot in VS Code settings:
   ```json
   {
     "aider.aiProvider.copilot.enabled": true
   }
   ```

3. Authenticate with GitHub (if not already authenticated):
   - Use the command palette: `Aider GitHub: Authenticate`
   - Or run `gh auth login` in the terminal

#### Default Provider

Set your default provider:
```json
{
  "aider.aiProvider.default": "ollama"  // or "copilot" or "default"
}
```

## Development Container Setup

The development container is pre-configured with Ollama:

### What's Included

1. **Ollama Installation**: Ollama is automatically installed and configured
2. **Automatic Startup**: Ollama service starts automatically with supervisord
3. **Port Exposure**: Port 11434 is exposed for Ollama API access
4. **Model Storage**: Models are stored in `/home/coder/.ollama/models`

### Using Ollama in the Container

1. Start your development container
2. The vision model (`llama3.2-vision`) is automatically preloaded on startup
3. Pull additional models if needed:
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

5. Test vision model:
   ```bash
   # List available models
   ollama list
   
   # Should show llama3.2-vision in the list
   ```

6. Enable Ollama in VS Code settings as described above

### Vision Model Support

The container includes automatic support for vision-enabled models:

**Preloaded Model**: `llama3.2-vision`
- Automatically pulled on container startup
- Ready for screenshot-to-code generation
- Supports image analysis and code generation

**Configuration**:
```json
{
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision",
  "aider.aiProvider.ollama.preloadVisionModel": true,
  "aider.screenshot.defaultProvider": "ollama",
  "aider.screenshot.autoSelectVisionModel": true
}
```

**Features**:
- Automatic model selection for screenshot tasks
- Fallback to other providers if model unavailable
- Context-aware code generation
- Structured output (JSX, CSS suggestions)

**Manual Model Pull** (if needed):
```bash
ollama pull llama3.2-vision
```

### Environment Variables

The following environment variables are configured:

- `OLLAMA_HOST`: `0.0.0.0:11434` - Allows external connections
- `OLLAMA_MODELS`: `/home/coder/.ollama/models` - Model storage location
- `OLLAMA_VISION_MODEL`: `llama3.2-vision` - Default vision model for screenshots

## Usage Examples

### Example 1: Simple Boilerplate with Ollama

1. Select "Ollama" from the provider dropdown
2. Message: "Create a simple Express.js server with a hello world endpoint"
3. Ollama will generate basic boilerplate code quickly

### Example 2: Complex Refactoring with Copilot

1. Select "GitHub Copilot" from the provider dropdown
2. Message: "Refactor this React component to use hooks and optimize performance"
3. Copilot will provide context-aware, sophisticated refactoring

### Example 3: Auto-Select Mode

1. Enable auto-select in settings
2. Message: "Add a comment to this function" → Automatically uses Ollama
3. Message: "Design a scalable microservices architecture" → Automatically uses Copilot

## Provider Indicators

Each chat message displays which provider generated it:

- User messages show the selected provider
- Assistant responses include a provider badge (e.g., "(ollama)", "(copilot)")
- This helps you understand which AI generated each response

## Troubleshooting

### Ollama Not Available

If Ollama is not responding:

1. Check if Ollama is running:
   ```bash
   ps aux | grep ollama
   ```

2. Restart Ollama service:
   ```bash
   supervisorctl restart ollama
   ```

3. Check Ollama logs:
   ```bash
   supervisorctl tail -f ollama
   ```

### Copilot Authentication Issues

If Copilot authentication fails:

1. Run `gh auth status` to check authentication
2. Re-authenticate: `gh auth login`
3. Verify your Copilot subscription is active

### Provider Not Listed

If a provider is not showing in the dropdown:

1. Check that the provider is enabled in settings
2. Restart the VS Code window
3. Check the extension output for errors

## Architecture

### Provider Manager

The `ProviderManager` class handles:
- Provider registration and configuration
- Provider selection (manual and automatic)
- Query complexity analysis for auto-selection

### Query Complexity Analysis

The auto-selection logic uses heuristics to determine query complexity:

- **Pattern matching**: Identifies keywords like "refactor", "optimize", "architecture"
- **Length analysis**: Short queries → Ollama, long queries → Copilot
- **Context needs**: Simple tasks → Ollama, context-heavy → Copilot

### API Integration

The `AiderClient` now supports provider parameters:
```typescript
await aiderClient.sendMessage(message, AIProvider.Ollama);
```

Messages and responses include provider metadata for tracking.

## Future Enhancements

Planned improvements:

1. **Provider Performance Metrics**: Track response time and quality per provider
2. **Custom Selection Rules**: User-defined rules for provider selection
3. **Cost Tracking**: Monitor API usage and costs per provider
4. **Provider Fallback**: Automatic fallback if primary provider fails
5. **Model Selection**: Choose specific models within each provider
6. **Hybrid Responses**: Combine insights from multiple providers

## Contributing

To add a new provider:

1. Add the provider type to `AIProvider` enum in `providerManager.ts`
2. Update `ProviderManager` constructor with default configuration
3. Update the UI dropdown in `chatProvider.ts`
4. Update settings in `package.json`
5. Document the provider in this guide

## References

- [Ollama Documentation](https://ollama.ai/docs)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Aider Documentation](https://aider.chat/docs)
