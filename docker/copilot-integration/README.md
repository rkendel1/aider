# GitHub Copilot + Aider Integration for Code Server

This directory contains all the files needed for a turnkey Docker solution that integrates GitHub Copilot with Aider in a Code Server environment.

## What's Included

- **Dockerfile** (`../Dockerfile.copilot`): Complete Docker image with all dependencies
- **Startup Script** (`start.sh`): Automated initialization of all services
- **Settings Configuration** (`settings.json`): Optimized VS Code settings for Copilot + Aider
- **Integration Hooks**: Configuration for seamless Copilot <-> Aider communication

## Quick Start

### One-Command Build and Run

From the root of the aider repository:

```bash
docker build -f docker/Dockerfile.copilot -t code-server-aider . && \
docker run -p 8080:8080 \
  -v $(pwd)/workspace:/workspace \
  -e OPENAI_API_KEY=your-key-here \
  -e PASSWORD=your-password \
  code-server-aider
```

### With Environment File

Create a `.env` file:

```bash
# API Keys (at least one required)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Code Server Password
PASSWORD=your-secure-password

# Optional: Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

Then run:

```bash
docker build -f docker/Dockerfile.copilot -t code-server-aider . && \
docker run -p 8080:8080 \
  -v $(pwd)/workspace:/workspace \
  --env-file .env \
  code-server-aider
```

## Features

### 1. Pre-Installed Extensions

- **GitHub Copilot**: Official Copilot extension for code completion
- **GitHub Copilot Chat**: Conversational AI assistance
- **Aider VS Code Extension**: Multi-file reasoning and code generation

### 2. Operating Modes

#### Copilot Only Mode
Use GitHub Copilot directly in the editor for:
- Inline code completions
- Code suggestions
- Documentation generation

#### Copilot + Aider Mode (Default)
Combines both tools for enhanced capabilities:
- Copilot provides inline suggestions
- Aider handles multi-file refactoring
- Shared context between both tools
- Unified API endpoint for AI requests

Toggle between modes via VS Code settings:
```json
{
  "aider.aiProvider.default": "copilot"  // or "default" for Aider only
}
```

### 3. Secure Communication

All communication between Copilot and the local Aider API happens inside the container:
- Copilot API requests are proxied through `http://localhost:5000`
- No external API calls required (when using local models)
- Aider can intercept and enhance Copilot requests with multi-file context

### 4. Multi-File Reasoning

The integration enables:
- Cross-file code understanding
- Refactoring across multiple files
- Context-aware suggestions
- Project-wide code generation

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Code Server (Port 8080)                            │
│  ┌──────────────┐        ┌──────────────────────┐  │
│  │   GitHub     │        │  Aider Extension     │  │
│  │   Copilot    │◄──────►│  (Multi-file AI)     │  │
│  └──────┬───────┘        └──────────┬───────────┘  │
│         │                           │               │
│         └───────────┬───────────────┘               │
│                     ▼                               │
│         ┌───────────────────────┐                   │
│         │  Integration Layer    │                   │
│         │  localhost:5000       │                   │
│         └───────────┬───────────┘                   │
└─────────────────────┼───────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │   Aider API Server    │
          │   (Python Backend)    │
          └───────────────────────┘
```

## Service Endpoints

After starting the container, access:

- **Code Server**: http://localhost:8080
  - Username: N/A (uses password only)
  - Password: Value of `PASSWORD` environment variable (default: `aider`)

- **Aider API**: http://localhost:5000
  - Health check: http://localhost:5000/api/health
  - Chat endpoint: http://localhost:5000/api/chat

## Authentication

### GitHub Copilot Authentication

1. Open Code Server in your browser (http://localhost:8080)
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Run command: `GitHub Copilot: Sign In`
4. Follow the authentication flow in your browser
5. Return to Code Server - Copilot is now authenticated

### GitHub CLI (Optional)

For GitHub integration features:

```bash
# Inside the container
docker exec -it <container-name> bash
gh auth login
```

## Configuration

### Workspace Settings

The container automatically configures workspace settings in `/workspace/.vscode/settings.json`:

- Copilot enabled for all file types
- Aider API endpoint configured
- Auto-commit and diff viewing enabled
- Integration mode set to "copilot+aider"

### User Settings

User-level settings are configured at:
`/home/coder/.local/share/code-server/User/settings.json`

### Integration Configuration

Integration settings are stored at:
`/home/coder/.config/copilot-aider/integration.json`

```json
{
  "mode": "copilot+aider",
  "aiderEndpoint": "http://localhost:5000",
  "copilotEnabled": true,
  "multiFileReasoning": true,
  "contextSharing": true
}
```

## Customization

### Change AI Provider

Edit the workspace settings:

```json
{
  "aider.aiProvider.default": "copilot",  // or "ollama", "default"
  "aider.aiProvider.autoSelect": true      // auto-select based on query
}
```

### Add Custom Models

For Ollama integration (alternative to Copilot):

```json
{
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
  "aider.aiProvider.ollama.model": "codellama"
}
```

## Troubleshooting

### Copilot Extension Not Installed

If the Copilot extension fails to auto-install:

1. Open Code Server
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "GitHub Copilot"
4. Click "Install"

### Copilot Not Authenticated

Error: "GitHub Copilot could not connect to server"

Solution:
1. Run `GitHub Copilot: Sign In` from Command Palette
2. Complete authentication in browser
3. Reload VS Code window

### Aider API Not Responding

Check if the API is running:

```bash
docker exec -it <container-name> curl http://localhost:5000/api/health
```

View logs:

```bash
docker logs <container-name>
```

### Permission Issues

If you encounter permission errors with the workspace:

```bash
docker run -p 8080:8080 \
  -v $(pwd)/workspace:/workspace \
  -e PUID=1000 \
  -e PGID=1000 \
  --env-file .env \
  code-server-aider
```

## Development

### Rebuilding After Changes

```bash
# Rebuild the image
docker build -f docker/Dockerfile.copilot -t code-server-aider .

# Remove old container
docker rm -f code-server-aider-container

# Run new container
docker run -d --name code-server-aider-container \
  -p 8080:8080 \
  -v $(pwd)/workspace:/workspace \
  --env-file .env \
  code-server-aider
```

### Accessing Container Shell

```bash
docker exec -it <container-name> bash
```

### Viewing Service Logs

```bash
# All services
docker logs -f <container-name>

# Specific service (via supervisor)
docker exec -it <container-name> supervisorctl tail -f code-server
docker exec -it <container-name> supervisorctl tail -f aider-api
```

## What Makes This Different

### vs. Standard Copilot
- Multi-file reasoning across entire codebase
- Integration with local AI models (Ollama)
- Aider's advanced refactoring capabilities
- Persistent chat history and context

### vs. Standard Aider
- Inline code suggestions as you type (via Copilot)
- GitHub Copilot Chat integration
- Code Server web-based environment
- Pre-configured turnkey solution

### vs. Separate Installations
- Single container deployment
- Pre-configured integration
- One-command startup
- Optimized settings out of the box

## Production Considerations

### Security

1. **Change default password**: Always set `PASSWORD` environment variable
2. **Use HTTPS**: Put Code Server behind a reverse proxy with SSL
3. **Network isolation**: Run in isolated Docker network
4. **API key management**: Use Docker secrets for sensitive keys

### Persistence

Mount volumes for important data:

```bash
docker run -p 8080:8080 \
  -v $(pwd)/workspace:/workspace \
  -v aider-cache:/home/coder/.aider \
  -v code-server-config:/home/coder/.config/code-server \
  --env-file .env \
  code-server-aider
```

### Resource Limits

Set resource limits for production:

```bash
docker run -p 8080:8080 \
  --memory=4g \
  --cpus=2 \
  -v $(pwd)/workspace:/workspace \
  --env-file .env \
  code-server-aider
```

## License

Apache-2.0 - See LICENSE file in the root of the repository for details.

## Support

- **Aider Documentation**: https://aider.chat
- **GitHub Copilot Docs**: https://docs.github.com/copilot
- **Code Server Docs**: https://coder.com/docs/code-server
- **Report Issues**: https://github.com/rkendel1/aider/issues
