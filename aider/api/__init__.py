"""
Aider API module for VS Code extension integration.

This module provides a REST API interface for the Aider backend,
enabling seamless integration with the VS Code extension.
"""

from .server import AiderAPIServer
from .handlers import ChatHandler, FilesHandler, DiffHandler, UndoHandler

__all__ = [
    'AiderAPIServer',
    'ChatHandler',
    'FilesHandler',
    'DiffHandler',
    'UndoHandler',
]
