# Aider API Server Examples

This directory contains example scripts for starting the Aider API server.

## Examples

### 1. `start_aider_api.py` - Full Featured

Complete example with command-line arguments and configuration options.

**Usage:**
```bash
python start_aider_api.py --host localhost --port 5000 --model gpt-4o
```

**Options:**
- `--host HOST` - Host to bind to (default: localhost)
- `--port PORT` - Port to bind to (default: 5000)
- `--model MODEL` - AI model to use
- `--debug` - Enable debug mode

**Example:**
```bash
# Start with default settings
python start_aider_api.py

# Start with specific model
python start_aider_api.py --model claude-3-7-sonnet-20250219

# Start with debug logging
python start_aider_api.py --debug

# Allow external connections (use with caution!)
python start_aider_api.py --host 0.0.0.0 --port 8080
```

### 2. `minimal_api.py` - Minimal Example

Bare-bones example showing the minimum code needed.

**Usage:**
```bash
python minimal_api.py
```

## Prerequisites

1. Install Aider:
```bash
pip install aider-chat
```

2. Install API dependencies:
```bash
pip install flask flask-cors
```

3. Set up your API key (if using cloud models):
```bash
export OPENAI_API_KEY=your-key-here
# or
export ANTHROPIC_API_KEY=your-key-here
```

## Testing the Server

Once the server is running, test it:

```bash
# Health check
curl http://localhost:5000/api/health

# Get files in chat
curl http://localhost:5000/api/files

# Send a message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Aider!", "role": "user"}'
```

## Integration with VS Code Extension

After starting the server:

1. Open VS Code
2. Install the Aider extension
3. Open Settings (Ctrl+,)
4. Search for "aider"
5. Set `aider.apiEndpoint` to `http://localhost:5000`
6. Click the Aider icon in the Activity Bar
7. Start chatting!

## Troubleshooting

### Port Already in Use

If you get "Address already in use" error:

```bash
# Use a different port
python start_aider_api.py --port 5001
```

### Model Not Found

If you get model errors, check your API key:

```bash
# For OpenAI
export OPENAI_API_KEY=your-key-here

# For Anthropic
export ANTHROPIC_API_KEY=your-key-here

# Verify it's set
echo $OPENAI_API_KEY
```

### Import Errors

If you get import errors, make sure you're in the right directory:

```bash
# Run from the examples directory
cd vscode-extension/examples
python start_aider_api.py
```

## Advanced Usage

### Running in Background

Use a process manager like systemd, supervisor, or pm2:

```bash
# Using nohup
nohup python start_aider_api.py > api.log 2>&1 &

# Check it's running
curl http://localhost:5000/api/health
```

### Docker Deployment

See the main Aider documentation for Docker deployment options.

### Production Deployment

For production use:
1. Add authentication
2. Use a production WSGI server (gunicorn, uwsgi)
3. Enable HTTPS
4. Set up proper logging
5. Configure rate limiting

## Support

For issues or questions:
- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Documentation](https://aider.chat)
