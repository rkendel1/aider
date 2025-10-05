# GitHub Copilot + Aider - Quick Start Guide

Get up and running with the integrated Code Server + GitHub Copilot + Aider environment in minutes.

## Prerequisites

- Docker installed on your system
- At least one AI API key (OpenAI or Anthropic)
- GitHub account (for Copilot authentication)

## One-Command Start

### Option 1: Using the Helper Script (Recommended)

```bash
# Navigate to the repository
cd /path/to/aider

# Create and edit your .env file
cp docker/copilot-integration/.env.example docker/copilot-integration/.env
# Edit .env and add your API keys

# Build and run
./docker/copilot-integration/run.sh run
```

### Option 2: Direct Docker Command

```bash
# From the repository root
docker build -f docker/Dockerfile.copilot -t code-server-aider . && \
docker run -d \
  --name code-server-aider-container \
  -p 8080:8080 \
  -p 5000:5000 \
  -v $(pwd)/workspace:/workspace \
  -e OPENAI_API_KEY=your-key-here \
  -e PASSWORD=your-password \
  code-server-aider
```

## Access the Environment

1. **Open your browser**: http://localhost:8080
2. **Enter password**: The value you set in the `PASSWORD` environment variable (default: `aider`)
3. **You're in!** Code Server is now running with both Copilot and Aider pre-configured

## Authenticate with GitHub Copilot

Once inside Code Server:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `GitHub Copilot: Sign In`
3. Follow the authentication flow
4. Return to Code Server - Copilot is now active!

## First Steps

### 1. Create a New Project

```bash
# In the Code Server terminal
cd /workspace
mkdir my-project
cd my-project
git init
```

### 2. Test GitHub Copilot

- Create a new file: `test.py`
- Start typing a function, e.g., `def calculate_fibonacci(`
- Watch Copilot suggest completions!

### 3. Use Aider

- Open the Aider sidebar (click the chat icon in the left panel)
- Add files to the chat context
- Ask Aider to help with multi-file refactoring or generation

### 4. Use Copilot + Aider Together

The integration allows:
- Copilot provides inline suggestions while typing
- Aider handles complex multi-file changes
- Both share context for better results

## Configuration

### Toggle Between Modes

Edit settings (File > Preferences > Settings, search "aider"):

```json
{
  // Use Copilot only
  "aider.aiProvider.default": "copilot",
  
  // Use Aider's default model
  "aider.aiProvider.default": "default",
  
  // Auto-select based on query complexity
  "aider.aiProvider.autoSelect": true
}
```

## Common Tasks

### View Logs

```bash
./docker/copilot-integration/run.sh logs
# Or
docker logs -f code-server-aider-container
```

### Restart Services

```bash
./docker/copilot-integration/run.sh restart
```

### Access Container Shell

```bash
./docker/copilot-integration/run.sh shell
# Or
docker exec -it code-server-aider-container bash
```

### Stop Container

```bash
./docker/copilot-integration/run.sh stop
# Or
docker stop code-server-aider-container
```

### Rebuild After Updates

```bash
./docker/copilot-integration/run.sh rebuild
```

## Troubleshooting

### Can't Access Code Server

- Check if container is running: `docker ps`
- Check logs: `docker logs code-server-aider-container`
- Try accessing: http://127.0.0.1:8080

### Copilot Not Working

1. Ensure you're authenticated (see "Authenticate with GitHub Copilot" above)
2. Check if extension is installed: Extensions > Search "GitHub Copilot"
3. Reload window: Ctrl+Shift+P > "Developer: Reload Window"

### Aider API Not Responding

- Check API health: `curl http://localhost:5000/api/health`
- View supervisor status in container:
  ```bash
  docker exec -it code-server-aider-container supervisorctl status
  ```

### Permission Issues with Workspace

```bash
# Fix permissions on host
sudo chown -R 1000:1000 ./workspace
```

## Next Steps

- Read the full README: `docker/copilot-integration/README.md`
- Explore Aider documentation: https://aider.chat
- Learn about Copilot: https://docs.github.com/copilot
- Configure advanced settings in `.vscode/settings.json`

## Tips for Best Results

1. **Use descriptive file names**: Helps both Copilot and Aider understand context
2. **Add comments**: Explain your intent to get better suggestions
3. **Leverage both tools**: Use Copilot for quick completions, Aider for complex refactoring
4. **Enable auto-select**: Let the system choose the best provider for each task
5. **Keep files in chat**: Add relevant files to Aider's chat context for better multi-file reasoning

## Support

- Report issues: https://github.com/rkendel1/aider/issues
- Aider docs: https://aider.chat
- Copilot docs: https://docs.github.com/copilot
