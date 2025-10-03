#!/usr/bin/env python3
"""
Minimal example of integrating Aider API server with your application.
"""

import sys
from pathlib import Path

# Add aider to path if needed
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from aider.coders import Coder
from aider.io import InputOutput
from aider.models import Model
from aider.api import create_api_server


def main():
    """Minimal example to start the API server."""
    
    # Create IO handler
    io = InputOutput(yes=True)
    
    # Initialize model (uses environment variables for API keys)
    model = Model("gpt-4o")  # or any other supported model
    
    # Create coder instance
    coder = Coder.create(
        main_model=model,
        io=io,
        fnames=[],  # Start with no files
    )
    
    # Create and start API server
    server = create_api_server(coder, host='localhost', port=5000)
    
    print("Aider API Server starting...")
    print("Open VS Code and connect to http://localhost:5000")
    
    server.run(debug=True)


if __name__ == '__main__':
    main()
