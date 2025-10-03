#!/usr/bin/env python3
"""
Example script to start the Aider API server for VS Code extension integration.

This script demonstrates how to:
1. Initialize Aider with your project
2. Start the REST API server
3. Enable VS Code extension to connect

Usage:
    python start_aider_api.py [options]

Options:
    --host HOST     Host to bind to (default: localhost)
    --port PORT     Port to bind to (default: 5000)
    --model MODEL   AI model to use (default: from environment or config)
    --debug         Enable debug mode
"""

import argparse
import logging
import sys
from pathlib import Path

# Add aider to path if running from repo
sys.path.insert(0, str(Path(__file__).parent.parent))

from aider.main import main as cli_main
from aider.api import create_api_server
from aider.coders import Coder


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='Start Aider API server for VS Code extension'
    )
    parser.add_argument(
        '--host',
        default='localhost',
        help='Host to bind to (default: localhost)'
    )
    parser.add_argument(
        '--port',
        type=int,
        default=5000,
        help='Port to bind to (default: 5000)'
    )
    parser.add_argument(
        '--model',
        help='AI model to use'
    )
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Enable debug mode'
    )
    return parser.parse_args()


def setup_logging(debug=False):
    """Configure logging."""
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )


def main():
    """Main entry point."""
    args = parse_args()
    setup_logging(args.debug)
    
    logger = logging.getLogger(__name__)
    logger.info("Starting Aider API server...")
    
    try:
        # Initialize Aider with current directory
        logger.info("Initializing Aider...")
        
        # Build arguments for Aider
        aider_args = []
        if args.model:
            aider_args.extend(['--model', args.model])
        
        # Get coder instance from Aider CLI
        coder = cli_main(return_coder=True, argv=aider_args)
        
        if not isinstance(coder, Coder):
            logger.error("Failed to initialize Aider coder")
            return 1
        
        logger.info(f"Aider initialized with model: {coder.main_model.name}")
        logger.info(f"Working directory: {coder.root}")
        
        # Create and start API server
        logger.info(f"Creating API server on {args.host}:{args.port}")
        server = create_api_server(coder, host=args.host, port=args.port)
        
        logger.info("=" * 60)
        logger.info(f"Aider API Server is running at http://{args.host}:{args.port}")
        logger.info("Configure your VS Code extension with:")
        logger.info(f'  "aider.apiEndpoint": "http://{args.host}:{args.port}"')
        logger.info("=" * 60)
        logger.info("Press Ctrl+C to stop the server")
        
        # Run the server
        server.run(debug=args.debug)
        
    except KeyboardInterrupt:
        logger.info("\nShutting down server...")
        return 0
    except Exception as e:
        logger.error(f"Error starting server: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
