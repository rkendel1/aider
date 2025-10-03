#!/usr/bin/env python3
"""
Wrapper script to start Aider API server in Docker container.

This script is automatically placed in the workspace by the Docker setup
and started by supervisord.
"""

import sys
import os
from pathlib import Path

# Add aider to path
sys.path.insert(0, '/venv/lib/python3.10/site-packages')

try:
    from aider.main import main as cli_main
    from aider.api import create_api_server
    from aider.coders import Coder
except ImportError as e:
    print(f"Error importing aider: {e}")
    print("Make sure aider is installed in the virtual environment")
    sys.exit(1)

import logging

def setup_logging():
    """Configure logging for the API server."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def main():
    """Start the Aider API server."""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    logger.info("Starting Aider API server from Docker container...")
    logger.info(f"Working directory: {os.getcwd()}")
    logger.info(f"Cache directory: {os.environ.get('AIDER_CACHE_DIR', 'not set')}")
    
    try:
        # Initialize Aider with workspace directory
        logger.info("Initializing Aider...")
        
        # Build minimal arguments for Aider
        aider_args = []
        
        # Use environment variable for model if set
        model = os.environ.get('AIDER_MODEL')
        if model:
            aider_args.extend(['--model', model])
        
        # Get coder instance from Aider CLI
        coder = cli_main(return_coder=True, argv=aider_args)
        
        if not isinstance(coder, Coder):
            logger.error("Failed to initialize Aider coder")
            return 1
        
        logger.info(f"Aider initialized with model: {coder.main_model.name}")
        logger.info(f"Working directory: {coder.root}")
        
        # Create and start API server
        host = '0.0.0.0'
        port = 5000
        
        logger.info(f"Creating API server on {host}:{port}")
        server = create_api_server(coder, host=host, port=port)
        
        logger.info("=" * 60)
        logger.info(f"Aider API Server is running at http://{host}:{port}")
        logger.info("VS Code extension should connect to: http://localhost:5000")
        logger.info("=" * 60)
        
        # Run the server (this blocks)
        server.run(debug=False)
        
    except KeyboardInterrupt:
        logger.info("\nShutting down server...")
        return 0
    except Exception as e:
        logger.error(f"Error starting server: {e}", exc_info=True)
        return 1

if __name__ == '__main__':
    sys.exit(main())
