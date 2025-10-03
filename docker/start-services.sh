#!/bin/bash
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Aider VS Code Extension services..."

# Set password for code-server from environment variable or use default
export PASSWORD="${PASSWORD:-aider}"

# Ensure workspace directory exists and is owned by coder
if [ ! -d "/workspace" ]; then
    mkdir -p /workspace
fi

# Create aider cache directory if it doesn't exist
if [ ! -d "${AIDER_CACHE_DIR:-/home/coder/.aider/cache}" ]; then
    mkdir -p "${AIDER_CACHE_DIR:-/home/coder/.aider/cache}"
fi

log "Environment configured:"
log "  - CODE_SERVER_PASSWORD: $([ -n "$PASSWORD" ] && echo "***" || echo "not set")"
log "  - OPENAI_API_KEY: $([ -n "$OPENAI_API_KEY" ] && echo "***" || echo "not set")"
log "  - ANTHROPIC_API_KEY: $([ -n "$ANTHROPIC_API_KEY" ] && echo "***" || echo "not set")"
log "  - AIDER_CACHE_DIR: ${AIDER_CACHE_DIR:-/home/coder/.aider/cache}"
log "  - SUPABASE_URL: ${SUPABASE_URL:-not set}"

# Start supervisor to manage both code-server and aider API
log "Starting supervisor to manage services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
