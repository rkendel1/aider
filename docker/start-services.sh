#!/bin/bash
set -e

# Function to log messages with color support
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log_error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

log_warn() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1"
}

log "Starting Aider VS Code Extension services..."

# Validate critical environment variables
if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    log_error "Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set!"
    log_error "Please set at least one API key in your .env file"
    log_error "Example: OPENAI_API_KEY=sk-your-key-here"
    exit 1
fi

# Set password for code-server from environment variable or use default
export PASSWORD="${PASSWORD:-aider}"
if [ "$PASSWORD" = "aider" ]; then
    log_warn "Using default password 'aider' - please change CODE_SERVER_PASSWORD in .env for production!"
fi

# Ensure workspace directory exists and is owned by coder
if [ ! -d "/workspace" ]; then
    log "Creating workspace directory..."
    mkdir -p /workspace || {
        log_error "Failed to create workspace directory"
        exit 1
    }
fi

# Create aider cache directory if it doesn't exist
AIDER_CACHE_DIR="${AIDER_CACHE_DIR:-/home/coder/.aider/cache}"
if [ ! -d "$AIDER_CACHE_DIR" ]; then
    log "Creating aider cache directory: $AIDER_CACHE_DIR"
    mkdir -p "$AIDER_CACHE_DIR" || {
        log_error "Failed to create aider cache directory"
        exit 1
    }
fi

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version 2>&1 | head -n1 || echo "unknown")
    log "Supabase CLI detected: $SUPABASE_VERSION"
else
    log_warn "Supabase CLI not found in PATH"
fi

log "Environment configured:"
log "  - CODE_SERVER_PASSWORD: $([ -n "$PASSWORD" ] && echo "***" || echo "not set")"
log "  - OPENAI_API_KEY: $([ -n "$OPENAI_API_KEY" ] && echo "***" || echo "not set")"
log "  - ANTHROPIC_API_KEY: $([ -n "$ANTHROPIC_API_KEY" ] && echo "***" || echo "not set")"
log "  - AIDER_CACHE_DIR: $AIDER_CACHE_DIR"
log "  - SUPABASE_URL: ${SUPABASE_URL:-not set}"

# Verify supervisor configuration exists
if [ ! -f "/etc/supervisor/conf.d/supervisord.conf" ]; then
    log_error "Supervisor configuration not found at /etc/supervisor/conf.d/supervisord.conf"
    exit 1
fi

# Ensure supervisor directories exist
SUPERVISOR_DIR="/home/coder/.config/supervisor"
mkdir -p "$SUPERVISOR_DIR"
touch "$SUPERVISOR_DIR/supervisord.log"
chown -R coder:coder "$SUPERVISOR_DIR"

# Configure Aider VS Code extension settings
log "Configuring Aider VS Code extension..."
CODE_SERVER_USER_SETTINGS="/home/coder/.local/share/code-server/User"
mkdir -p "$CODE_SERVER_USER_SETTINGS"
cat > "$CODE_SERVER_USER_SETTINGS/settings.json" <<EOF
{
  "aider.apiEndpoint": "http://localhost:5000",
  "aider.autoCommit": true,
  "aider.showDiffs": true,
  "aider.previewUrl": "http://localhost:3000",
  "aider.enableInspector": true,
  "aider.autoOpenPreview": false
}
EOF
chown -R coder:coder "$CODE_SERVER_USER_SETTINGS"
log "Extension settings configured at $CODE_SERVER_USER_SETTINGS/settings.json"

# Install local aider package and dependencies at runtime
if [ -d "/tmp/aider" ]; then
    log "Installing local aider package..."
    export SETUPTOOLS_SCM_PRETEND_VERSION=0.1.0
    /venv/bin/python -m pip install --no-cache-dir /tmp/aider[help,browser,playwright] \
        boto3 flask flask-cors \
        --extra-index-url https://download.pytorch.org/whl/cpu
    /venv/bin/python -m playwright install --with-deps chromium
fi

# Start supervisor to manage both code-server and aider API
log "Starting supervisor to manage services..."
log "Services will be available at:"
log "  - Code-Server: http://localhost:8443"
log "  - Aider API: http://localhost:5000"
log ""
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
