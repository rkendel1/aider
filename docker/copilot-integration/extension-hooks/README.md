# Copilot Extension Integration Hooks

This directory contains integration hooks and configuration for seamless GitHub Copilot + Aider interaction.

## Overview

The integration works by:

1. **Proxy Configuration**: Copilot API requests can be proxied through the local Aider API
2. **Context Sharing**: Both extensions share file context and project information
3. **Mode Switching**: Users can toggle between "Copilot only" and "Copilot + Aider" modes
4. **Multi-file Reasoning**: Aider enhances Copilot with cross-file context

## Files

### `integration-config.json`
Core configuration for the integration layer

### `copilot-proxy.js` (Future Enhancement)
Optional proxy middleware for intercepting and enhancing Copilot requests

### `context-bridge.ts` (Future Enhancement)
TypeScript module for sharing context between Copilot and Aider extensions

## How It Works

```
User Types in Editor
        |
        v
GitHub Copilot Extension
        |
        ├──> Inline Suggestions (Copilot native)
        |
        └──> API Request
                |
                v
        [Optional Proxy Layer]
                |
                ├──> Direct to GitHub (Copilot only mode)
                |
                └──> Aider API (Copilot + Aider mode)
                        |
                        └──> Enhanced with multi-file context
                                |
                                └──> Response with better suggestions
```

## Configuration

The integration is configured via:

1. **VS Code Settings**: `settings.json`
   ```json
   {
     "aider.aiProvider.default": "copilot",
     "github.copilot.advanced.debug.overrideProxyUrl": "http://localhost:5000"
   }
   ```

2. **Integration Config**: `integration-config.json`
   ```json
   {
     "mode": "copilot+aider",
     "aiderEndpoint": "http://localhost:5000",
     "copilotEnabled": true,
     "multiFileReasoning": true,
     "contextSharing": true
   }
   ```

## Usage Modes

### Mode 1: Copilot Only
- Copilot works as normal
- No Aider integration
- Fast inline suggestions
- Limited to single-file context

### Mode 2: Copilot + Aider (Default)
- Copilot provides inline suggestions
- Aider enhances with multi-file context
- Better understanding of project structure
- More accurate suggestions for refactoring

### Mode 3: Auto-Select
- System chooses best provider based on query
- Simple completions -> Copilot
- Complex refactoring -> Aider
- Best of both worlds

## Extension Communication

Both extensions communicate through:

1. **Shared Settings**: VS Code configuration API
2. **Local API**: Aider API at `http://localhost:5000`
3. **File System**: Project context in `.aider/` directory
4. **VS Code Events**: Extension activation and messaging

## Customization

Users can customize behavior by editing:

- `~/.config/copilot-aider/integration.json`
- Workspace `.vscode/settings.json`
- User settings in Code Server

## Future Enhancements

Potential improvements:

1. **Real-time Sync**: Sync Copilot chat history with Aider
2. **Smart Context**: Automatically add relevant files to Aider context
3. **Unified UI**: Single chat interface for both tools
4. **Performance Optimization**: Cache and reuse context
5. **Advanced Routing**: Route different types of requests to different providers

## Development

To modify the integration:

1. Edit configuration files in this directory
2. Update `start.sh` to apply new configurations
3. Rebuild the Docker image
4. Test the integration

## Troubleshooting

### Integration Not Working

Check configuration files:
```bash
cat ~/.config/copilot-aider/integration.json
cat ~/.local/share/code-server/User/settings.json
```

### Copilot Not Using Aider Context

1. Ensure `aider.aiProvider.copilot.enabled` is `true`
2. Check Aider API is running: `curl http://localhost:5000/api/health`
3. Verify proxy settings in Copilot advanced configuration

### Performance Issues

1. Disable multi-file reasoning if too slow
2. Reduce context window size
3. Use "Copilot only" mode for simple tasks

## References

- Aider Documentation: https://aider.chat
- GitHub Copilot API: https://docs.github.com/copilot
- VS Code Extension API: https://code.visualstudio.com/api
