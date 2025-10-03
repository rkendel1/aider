"""
REST API server for Aider backend.

This module provides a Flask-based REST API server that the VS Code
extension can communicate with.
"""

import logging
from typing import Optional
from flask import Flask, request, jsonify
from flask_cors import CORS

from aider.coders import Coder
from aider.io import InputOutput


logger = logging.getLogger(__name__)


class AiderAPIServer:
    """REST API server for Aider backend."""

    def __init__(self, coder: Coder, host: str = '0.0.0.0', port: int = 5000):
        """
        Initialize the API server.

        Args:
            coder: The Aider Coder instance to use
            host: Host to bind the server to
            port: Port to bind the server to
        """
        self.coder = coder
        self.host = host
        self.port = port
        self.app = Flask(__name__)
        
        # Enable CORS for VS Code Web support
        CORS(self.app)
        
        self._setup_routes()

    def _setup_routes(self):
        """Set up API routes."""
        
        @self.app.route('/api/health', methods=['GET'])
        def health():
            """Health check endpoint."""
            return jsonify({'status': 'ok', 'version': '0.1.0'})

        @self.app.route('/api/chat', methods=['POST'])
        def send_message():
            """Send a message to Aider."""
            data = request.json
            message = data.get('message', '')
            role = data.get('role', 'user')
            
            if not message:
                return jsonify({'error': 'Message is required'}), 400
            
            try:
                # Add message to chat
                if role == 'user':
                    self.coder.io.add_to_input_history(message)
                
                # Get response from Aider
                response_messages = []
                edits = []
                
                # Run the coder with the message
                # This is a simplified version - the actual implementation
                # would need to integrate with the coder's run loop
                with self.coder.io.get_captured_output() as output:
                    try:
                        reply = self.coder.run(with_message=message)
                        
                        if reply:
                            response_messages.append({
                                'role': 'assistant',
                                'content': reply
                            })
                        
                        # Capture any edits that were made
                        if self.coder.last_aider_commit_hash:
                            edits.append({
                                'commit_hash': self.coder.last_aider_commit_hash,
                                'commit_message': self.coder.last_aider_commit_message,
                                'fnames': list(self.coder.get_inchat_relative_files())
                            })
                    except Exception as e:
                        logger.error(f"Error running coder: {e}")
                        response_messages.append({
                            'role': 'system',
                            'content': f'Error: {str(e)}'
                        })
                
                return jsonify({
                    'messages': response_messages,
                    'edits': edits
                })
            except Exception as e:
                logger.error(f"Error in send_message: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/chat/history', methods=['GET'])
        def get_chat_history():
            """Get chat history."""
            try:
                messages = []
                
                # Extract messages from coder's history
                # This would need to be adapted based on how Aider stores history
                if hasattr(self.coder, 'cur_messages'):
                    for msg in self.coder.cur_messages:
                        if isinstance(msg, dict) and 'role' in msg:
                            messages.append({
                                'role': msg['role'],
                                'content': msg.get('content', '')
                            })
                
                return jsonify({'messages': messages})
            except Exception as e:
                logger.error(f"Error getting chat history: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/chat/clear', methods=['POST'])
        def clear_chat():
            """Clear chat history."""
            try:
                # Clear the coder's message history
                if hasattr(self.coder.commands, '_clear_chat_history'):
                    self.coder.commands._clear_chat_history()
                    return jsonify({'status': 'ok'})
                else:
                    return jsonify({'error': 'Clear chat not supported'}), 501
            except Exception as e:
                logger.error(f"Error clearing chat: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/files', methods=['GET'])
        def get_files():
            """Get list of files in chat."""
            try:
                files = list(self.coder.get_inchat_relative_files())
                return jsonify({'files': files})
            except Exception as e:
                logger.error(f"Error getting files: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/files/add', methods=['POST'])
        def add_file():
            """Add a file to chat."""
            data = request.json
            file_path = data.get('file', '')
            
            if not file_path:
                return jsonify({'error': 'File path is required'}), 400
            
            try:
                # Add file to coder
                self.coder.add_rel_fname(file_path)
                return jsonify({'status': 'ok', 'file': file_path})
            except Exception as e:
                logger.error(f"Error adding file: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/files/remove', methods=['POST'])
        def remove_file():
            """Remove a file from chat."""
            data = request.json
            file_path = data.get('file', '')
            
            if not file_path:
                return jsonify({'error': 'File path is required'}), 400
            
            try:
                # Remove file from coder
                abs_path = self.coder.abs_root_path(file_path)
                if abs_path in self.coder.abs_fnames:
                    self.coder.abs_fnames.remove(abs_path)
                    return jsonify({'status': 'ok', 'file': file_path})
                else:
                    return jsonify({'error': 'File not in chat'}), 404
            except Exception as e:
                logger.error(f"Error removing file: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/undo', methods=['POST'])
        def undo():
            """Undo last commit."""
            try:
                # Use the commands interface to undo
                self.coder.commands.cmd_undo(None)
                return jsonify({'status': 'ok'})
            except Exception as e:
                logger.error(f"Error undoing: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/diff', methods=['GET'])
        def get_diff():
            """Get diff of changes."""
            try:
                # Get diff from coder
                if self.coder.last_aider_commit_hash:
                    commits = f"{self.coder.last_aider_commit_hash}~1"
                    diff = self.coder.repo.diff_commits(
                        self.coder.pretty,
                        commits,
                        self.coder.last_aider_commit_hash,
                    )
                    return jsonify({'diff': diff})
                else:
                    return jsonify({'diff': ''})
            except Exception as e:
                logger.error(f"Error getting diff: {e}")
                return jsonify({'error': str(e)}), 500

        @self.app.route('/api/apply', methods=['POST'])
        def apply_changes():
            """Apply changes from edit."""
            # This endpoint would be used if we want to manually apply changes
            # For now, changes are auto-applied by the coder
            return jsonify({'status': 'ok'})

    def run(self, debug: bool = False):
        """
        Run the API server.

        Args:
            debug: Whether to run in debug mode
        """
        logger.info(f"Starting Aider API server on {self.host}:{self.port}")
        self.app.run(host=self.host, port=self.port, debug=debug, threaded=True)


def create_api_server(coder: Coder, host: str = '0.0.0.0', port: int = 5000) -> AiderAPIServer:
    """
    Create and return an API server instance.

    Args:
        coder: The Aider Coder instance
        host: Host to bind to
        port: Port to bind to

    Returns:
        AiderAPIServer instance
    """
    return AiderAPIServer(coder, host, port)
