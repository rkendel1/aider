#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages with timestamps
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

log "=========================================="
log "Starting Code Server + Aider + GitHub Copilot"
log "=========================================="

# Validate critical environment variables
if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    log_warn "Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set!"
    log_warn "Aider will have limited functionality without an API key"
    log_warn "Set at least one API key for full functionality"
fi

# Set password for code-server from environment variable or use default
export PASSWORD="${PASSWORD:-aider}"
if [ "$PASSWORD" = "aider" ]; then
    log_warn "Using default password 'aider' - please change PASSWORD environment variable for production!"
fi

# Ensure workspace directory exists and is owned by coder
log "Setting up workspace..."
mkdir -p /workspace
chown -R coder:coder /workspace

# Create aider cache directory if it doesn't exist
AIDER_CACHE_DIR="${AIDER_CACHE_DIR:-/home/coder/.aider/cache}"
mkdir -p "$AIDER_CACHE_DIR"
chown -R coder:coder "$AIDER_CACHE_DIR"

# Ensure supervisor directories exist
SUPERVISOR_DIR="/home/coder/.config/supervisor"
mkdir -p "$SUPERVISOR_DIR"
touch "$SUPERVISOR_DIR/supervisord.log"
chown -R coder:coder "$SUPERVISOR_DIR"

# Configure VS Code User Settings for both Aider and Copilot
log "Configuring VS Code User settings..."
CODE_SERVER_USER_SETTINGS="/home/coder/.local/share/code-server/User"
mkdir -p "$CODE_SERVER_USER_SETTINGS"

# Create settings.json with Copilot and Aider configuration
cat > "$CODE_SERVER_USER_SETTINGS/settings.json" <<EOF
{
  "aider.apiEndpoint": "http://localhost:5000",
  "aider.autoCommit": true,
  "aider.showDiffs": true,
  "aider.previewUrl": "http://localhost:3000",
  "aider.enableInspector": true,
  "aider.autoOpenPreview": false,
  "aider.aiProvider.default": "copilot",
  "aider.aiProvider.copilot.enabled": true,
  "aider.aiProvider.autoSelect": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  "github.copilot.advanced": {
    "debug.overrideEngine": "copilot-codex",
    "debug.testOverrideProxyUrl": "http://localhost:5000",
    "debug.overrideProxyUrl": "http://localhost:5000"
  }
}
EOF
chown -R coder:coder "$CODE_SERVER_USER_SETTINGS"
log "User settings configured at $CODE_SERVER_USER_SETTINGS/settings.json"

# Install GitHub Copilot extension
log "Installing GitHub Copilot extension..."
COPILOT_EXTENSION="GitHub.copilot"
COPILOT_CHAT_EXTENSION="GitHub.copilot-chat"

# Try to install Copilot extension
if code-server --install-extension $COPILOT_EXTENSION 2>/dev/null; then
    log "GitHub Copilot extension installed successfully"
else
    log_warn "Could not install GitHub Copilot extension automatically"
    log_warn "You may need to install it manually from the Extensions marketplace"
fi

# Try to install Copilot Chat extension
if code-server --install-extension $COPILOT_CHAT_EXTENSION 2>/dev/null; then
    log "GitHub Copilot Chat extension installed successfully"
else
    log_warn "Could not install GitHub Copilot Chat extension automatically"
fi

# Build and install the Aider VS Code extension if not already installed
log "Building and installing Aider VS Code extension..."
if [ -d "/workspace/aider/vscode-extension" ]; then
    cd /workspace/aider/vscode-extension
    
    # Install dependencies and build if needed
    if [ ! -d "node_modules" ]; then
        log "Installing Aider extension dependencies..."
        npm install
    fi
    
    if [ ! -d "out" ]; then
        log "Compiling Aider extension..."
        npm run compile
    fi
    
    # Package the extension
    log "Packaging Aider extension..."
    npm run package || log_warn "Could not package Aider extension, will try to install anyway"
    
    # Install the extension
    VSIX_FILE=$(ls aider-vscode-*.vsix 2>/dev/null | head -n1)
    if [ -n "$VSIX_FILE" ]; then
        log "Installing Aider extension from $VSIX_FILE..."
        code-server --install-extension "$VSIX_FILE"
        log "Aider extension installed successfully"
    else
        log_warn "No .vsix file found, Aider extension may not be installed"
    fi
    
    cd /workspace
fi

# Create integration hooks for Copilot <-> Aider communication
log "Setting up Copilot <-> Aider integration..."
mkdir -p /home/coder/.config/copilot-aider
cat > /home/coder/.config/copilot-aider/integration.json <<EOF
{
  "mode": "copilot+aider",
  "aiderEndpoint": "http://localhost:5000",
  "copilotEnabled": true,
  "multiFileReasoning": true,
  "contextSharing": true
}
EOF
chown -R coder:coder /home/coder/.config/copilot-aider

# Display environment information
log ""
log "Environment configured:"
log "  - Code Server Password: $([ -n "$PASSWORD" ] && echo '***' || echo 'not set')"
log "  - OPENAI_API_KEY: $([ -n "$OPENAI_API_KEY" ] && echo '***' || echo 'not set')"
log "  - ANTHROPIC_API_KEY: $([ -n "$ANTHROPIC_API_KEY" ] && echo '***' || echo 'not set')"
log "  - AIDER_CACHE_DIR: $AIDER_CACHE_DIR"
log "  - SUPABASE_URL: ${SUPABASE_URL:-not set}"
log "  - Node.js Version: $(node --version)"
log "  - npm Version: $(npm --version)"
log "  - Python Version: $(python --version)"
log "  - GitHub CLI: $(gh --version | head -n1 || echo 'not available')"
log "  - Supabase CLI: $(supabase --version 2>&1 | head -n1 || echo 'not available')"
log ""

# Verify supervisor configuration exists
if [ ! -f "/etc/supervisor/conf.d/supervisord.conf" ]; then
    log_error "Supervisor configuration not found at /etc/supervisor/conf.d/supervisord.conf"
    exit 1
fi

# Start supervisor to manage both code-server and aider API
log "Starting services via supervisor..."
log ""
log "=========================================="
log "Services will be available at:"
log "  - Code Server: http://localhost:8080"
log "  - Aider API: http://localhost:5000"
log "=========================================="
log ""
log "GitHub Copilot Integration Mode: ENABLED"
log "  - Copilot Only: Use Copilot features directly in the editor"
log "  - Copilot + Aider: Use Aider extension with Copilot as the AI provider"
log "  - Toggle mode via VS Code settings: aider.aiProvider.default"
log ""
log "To authenticate with GitHub Copilot:"
log "  1. Open Code Server in your browser"
log "  2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)"
log "  3. Run 'GitHub Copilot: Sign In'"
log "  4. Follow the authentication flow"
log ""

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
