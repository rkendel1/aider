# Installation Guide

Complete installation guide for the Aider VS Code extension.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

### Required

- **VS Code**: Version 1.85.0 or higher
- **Python**: 3.10 or higher
- **Git**: For version control and repository management
- **Aider**: Install via pip

### Optional

- **Node.js**: 20.x+ (required if building from source)
- **Docker**: For containerized development environment
- **Ollama**: For local AI models
- **GitHub Copilot**: Subscription for advanced AI features

## Installation Methods

### Method 1: From Marketplace (Recommended)

*Note: Once published to VS Code Marketplace*

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Search for "Aider"
4. Click "Install"

### Method 2: From VSIX File

1. Download the latest `.vsix` file from [releases](https://github.com/Aider-AI/aider/releases)
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click the `...` menu → "Install from VSIX..."
5. Select the downloaded file

### Method 3: Build from Source

**Step 1: Clone Repository**

```bash
git clone https://github.com/Aider-AI/aider.git
cd aider/vscode-extension
```

**Step 2: Install Dependencies**

```bash
npm install
```

**Step 3: Compile TypeScript**

```bash
npm run compile
```

**Step 4: Package Extension**

```bash
npm run package
```

This creates a `.vsix` file in the current directory.

**Step 5: Install**

- Open VS Code
- Extensions view → `...` → "Install from VSIX..."
- Select the generated `.vsix` file

### Method 4: Development Mode

For testing or contributing:

1. Clone repository and navigate to `vscode-extension`
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` in VS Code to launch Extension Development Host
5. A new VS Code window opens with extension loaded

## Backend Setup

The extension requires the Aider API backend.

### Option 1: Quick Setup (Local)

```bash
# Install Aider
pip install aider-chat

# Install API dependencies
pip install flask flask-cors

# Start API server
cd vscode-extension/examples
python start_aider_api.py
```

The API will run at `http://localhost:5000`.

### Option 2: Docker Container

Use the pre-configured development container:

```bash
cd docker
cp .env.example .env
# Edit .env and add your API key
docker compose up -d
```

The container includes:
- Aider API at `http://localhost:5000`
- Code-Server at `http://localhost:8443`
- Ollama for local AI models
- All dependencies pre-installed

See [Docker Setup Guide](../../docker/README.md) for details.

### Option 3: Minimal API

For basic testing:

```bash
cd vscode-extension/examples
python minimal_api.py
```

This provides core functionality without all features.

## Configuration

### Step 1: Set API Endpoint

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "aider"
3. Set `aider.apiEndpoint` to your backend URL:
   - Local: `http://localhost:5000`
   - Docker: `http://localhost:5000`
   - Remote: `https://your-server:5000`

### Step 2: Configure API Key

**Method A: Environment Variable (Recommended)**

```bash
# For OpenAI
export OPENAI_API_KEY=sk-your-key-here

# For Anthropic Claude
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Add to your `~/.bashrc` or `~/.zshrc` to persist.

**Method B: VS Code Settings**

```json
{
  "aider.apiKey": "your-api-key-here"
}
```

⚠️ **Warning**: Storing API keys in settings is less secure.

### Step 3: Choose AI Model (Optional)

```json
{
  "aider.modelName": "gpt-4"
}
```

Supported models:
- `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo` (OpenAI)
- `claude-3-opus`, `claude-3-sonnet` (Anthropic)
- `deepseek-chat`, `deepseek-coder` (DeepSeek)

### Step 4: Additional Settings

```json
{
  // Enable auto-save
  "aider.autoSave": true,
  
  // Enable auto-commit
  "aider.autoCommit": false,
  
  // Enable Ollama
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
  
  // Enable GitHub Copilot
  "aider.aiProvider.copilot.enabled": true
}
```

## Verification

### 1. Check Extension Status

1. Open Command Palette (Ctrl+Shift+P)
2. Type "Aider: Show Status"
3. Verify extension is active

### 2. Test API Connection

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status": "ok"}
```

### 3. Open Chat Interface

1. Click Aider icon in Activity Bar (left sidebar)
2. Chat panel should open
3. Try sending a test message

### 4. Test File Operations

1. Open a file in your project
2. Run "Aider: Add File to Chat"
3. File should appear in Files panel

## Troubleshooting

### Extension Won't Activate

**Symptoms**: Extension doesn't appear or commands unavailable

**Solutions**:
1. Check VS Code version: `Help` → `About`
2. Reload window: `Developer: Reload Window`
3. Check Output panel: `View` → `Output` → select "Aider"
4. Reinstall extension

### Can't Connect to Backend

**Symptoms**: "Failed to connect to Aider API" error

**Solutions**:
1. Verify API server is running:
   ```bash
   curl http://localhost:5000/api/health
   ```
2. Check `aider.apiEndpoint` setting matches your server
3. Verify firewall not blocking port 5000
4. Check API server logs for errors

### TypeScript Compilation Errors

**Symptoms**: Build fails with TypeScript errors

**Solutions**:
1. Clean and rebuild:
   ```bash
   npm run clean
   npm install
   npm run compile
   ```
2. Check Node.js version: `node --version` (should be 20.x+)
3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### API Key Issues

**Symptoms**: "Invalid API key" or authentication errors

**Solutions**:
1. Verify API key is set:
   ```bash
   echo $OPENAI_API_KEY
   ```
2. Check key format (should start with `sk-`)
3. Test key with curl:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```
4. Ensure key has sufficient credits

### Ollama Not Working

**Symptoms**: Ollama provider unavailable or not responding

**Solutions**:
1. Check Ollama is running:
   ```bash
   ollama list
   ```
2. Start Ollama if needed:
   ```bash
   ollama serve
   ```
3. Verify endpoint in settings: `http://localhost:11434`
4. Pull a model:
   ```bash
   ollama pull llama2
   ```

### GitHub Copilot Authentication

**Symptoms**: Copilot not authenticated

**Solutions**:
1. Run authentication command:
   ```
   Aider GitHub: Authenticate
   ```
2. Or use GitHub CLI:
   ```bash
   gh auth login
   ```
3. Verify subscription is active at github.com/settings/copilot

## Next Steps

### Learn the Basics

- **[Quick Start Guide](quickstart.md)** - Get started in 5 minutes
- **[Configuration Guide](configuration.md)** - Advanced settings
- **[Getting Started](../usage/getting-started.md)** - First steps

### Explore Features

- **[AI Providers](../features/ai-providers.md)** - Multiple AI options
- **[Live Preview](../features/live-preview.md)** - Visual preview
- **[Vision Models](../features/vision-models.md)** - Screenshot-to-code

### Get Help

- **[Troubleshooting](quickstart.md#troubleshooting)** - Common issues
- **[GitHub Issues](https://github.com/Aider-AI/aider/issues)** - Report problems
- **[Community Discord](https://discord.gg/aider)** - Ask questions

## Updating

### Update Extension

- **From Marketplace**: Extensions view → Check for updates
- **From VSIX**: Download new version and reinstall
- **From Source**: Pull latest code and rebuild

### Update Backend

```bash
# Update Aider
pip install --upgrade aider-chat

# Update API dependencies
pip install --upgrade flask flask-cors
```

### Update Docker Container

```bash
cd docker
docker compose pull
docker compose up -d
```

## Uninstalling

### Remove Extension

1. Extensions view (Ctrl+Shift+X)
2. Find "Aider"
3. Click gear icon → "Uninstall"

### Remove Backend

```bash
pip uninstall aider-chat
```

### Remove Docker Setup

```bash
cd docker
docker compose down -v  # -v removes volumes
```

---

**Need help?** Check [Troubleshooting](#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).

*Ready to use Aider? Start with the [Quick Start Guide](quickstart.md)!*
