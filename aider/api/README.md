# Aider API Module

This module provides a REST API interface for the Aider backend, enabling integration with the VS Code extension and other clients.

## Features

- **REST API**: Full REST API for all Aider operations
- **CORS Support**: Enabled for VS Code Web compatibility
- **Chat Interface**: Send messages and get responses
- **File Management**: Add/remove files from chat context
- **Diff Viewing**: Get diffs of changes
- **Undo Support**: Revert commits made by Aider

## Usage

### Starting the API Server

```python
from aider.api import create_api_server
from aider.coders import Coder

# Create your coder instance
coder = Coder(...)

# Create and start the API server
server = create_api_server(coder, host='0.0.0.0', port=5000)
server.run(debug=True)
```

### From Command Line

```bash
aider --api-server --api-port 5000
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if API server is running

### Chat Operations
- `POST /api/chat` - Send a message
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/clear` - Clear chat history

### File Operations
- `GET /api/files` - List files in chat
- `POST /api/files/add` - Add file to chat
- `POST /api/files/remove` - Remove file from chat

### Git Operations
- `GET /api/diff` - Get diff of changes
- `POST /api/undo` - Undo last commit
- `POST /api/apply` - Apply changes

## Requirements

- Flask
- Flask-CORS

Install with:
```bash
pip install flask flask-cors
```

## Integration with VS Code Extension

The VS Code extension communicates with this API server to provide:
- Real-time chat interface
- File management
- Automatic change application
- Diff viewing
- Undo support

Configure the extension to point to your API server endpoint in VS Code settings:
```json
{
    "aider.apiEndpoint": "http://localhost:5000"
}
```

## Security

**Warning**: This API server does not include authentication. Only run it on localhost or in a secure network environment. For production use, implement proper authentication and authorization.
