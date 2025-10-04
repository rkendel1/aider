#!/bin/bash
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log_error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

VISION_MODEL="${OLLAMA_VISION_MODEL:-llama3.2-vision}"
MAX_RETRIES=3
RETRY_DELAY=5

log "Preloading Ollama vision model: $VISION_MODEL"

# Wait for Ollama service to be ready
log "Waiting for Ollama service to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        log "Ollama service is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Ollama service failed to start after 30 seconds"
        exit 1
    fi
    sleep 1
done

# Check if model is already present
log "Checking if $VISION_MODEL is already available..."
if ollama list | grep -q "$VISION_MODEL"; then
    log "✅ Vision model $VISION_MODEL is already available"
    exit 0
fi

# Attempt to pull the model with retries
for attempt in $(seq 1 $MAX_RETRIES); do
    log "Attempt $attempt/$MAX_RETRIES: Pulling vision model $VISION_MODEL..."
    
    if ollama pull "$VISION_MODEL"; then
        log "✅ Successfully pulled vision model $VISION_MODEL"
        
        # Verify the model is available
        if ollama list | grep -q "$VISION_MODEL"; then
            log "✅ Vision model verified and ready for use"
            exit 0
        else
            log_error "Model pull reported success but model is not in list"
        fi
    else
        log_error "Failed to pull vision model (attempt $attempt/$MAX_RETRIES)"
        if [ $attempt -lt $MAX_RETRIES ]; then
            log "Retrying in $RETRY_DELAY seconds..."
            sleep $RETRY_DELAY
        fi
    fi
done

log_error "Failed to pull vision model after $MAX_RETRIES attempts"
log_error "The extension will fall back to other providers for screenshot analysis"
exit 0  # Exit successfully to not block container startup
