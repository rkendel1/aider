"""
Handler classes for API endpoints.

This module contains handler classes for different API endpoint groups.
"""

from typing import Dict, Any, List


class ChatHandler:
    """Handler for chat-related endpoints."""
    
    def __init__(self, coder):
        self.coder = coder
    
    def send_message(self, message: str, role: str = 'user') -> Dict[str, Any]:
        """Send a message and get response."""
        # Implementation would integrate with coder
        pass
    
    def get_history(self) -> List[Dict[str, str]]:
        """Get chat history."""
        pass
    
    def clear_history(self) -> bool:
        """Clear chat history."""
        pass


class FilesHandler:
    """Handler for file management endpoints."""
    
    def __init__(self, coder):
        self.coder = coder
    
    def get_files(self) -> List[str]:
        """Get list of files in chat."""
        return list(self.coder.get_inchat_relative_files())
    
    def add_file(self, file_path: str) -> bool:
        """Add a file to chat."""
        try:
            self.coder.add_rel_fname(file_path)
            return True
        except Exception:
            return False
    
    def remove_file(self, file_path: str) -> bool:
        """Remove a file from chat."""
        try:
            abs_path = self.coder.abs_root_path(file_path)
            if abs_path in self.coder.abs_fnames:
                self.coder.abs_fnames.remove(abs_path)
                return True
            return False
        except Exception:
            return False


class DiffHandler:
    """Handler for diff-related endpoints."""
    
    def __init__(self, coder):
        self.coder = coder
    
    def get_diff(self) -> str:
        """Get diff of recent changes."""
        if self.coder.last_aider_commit_hash:
            commits = f"{self.coder.last_aider_commit_hash}~1"
            return self.coder.repo.diff_commits(
                self.coder.pretty,
                commits,
                self.coder.last_aider_commit_hash,
            )
        return ''


class UndoHandler:
    """Handler for undo operations."""
    
    def __init__(self, coder):
        self.coder = coder
    
    def undo_last_commit(self) -> bool:
        """Undo the last commit."""
        try:
            self.coder.commands.cmd_undo(None)
            return True
        except Exception:
            return False
