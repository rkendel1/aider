# Change Log

All notable changes to the "aider-vscode" extension will be documented in this file.

## [0.3.0] - 2024

### Added - Visual-First Workflow
- **Full-Page Preview Panel**: New webview panel for main view experience
  - Auto-opens on VS Code startup (configurable)
  - Retains context when switching tabs
  - Status bar showing route and inspector state
  - Support for HMR and live reload
- **Enhanced Inspector**: Advanced element detection and navigation
  - React source file and line number detection
  - "Open File" action to jump to component source
  - Auto-add opened files to Aider chat context
  - Route change monitoring and notifications
- **Bidirectional Communication**: Full two-way messaging
  - Preview → Aider: element clicks, route changes, file requests
  - Aider → Preview: highlight elements, scroll, refresh
  - Event-driven architecture for extensibility
- **New Commands**:
  - `Aider: Open App Preview` - Open full-page preview panel
  - `Aider: Refresh Preview` - Reload preview on demand
  - `Aider: Highlight Element in Preview` - Highlight by XPath
  - `Aider: Scroll to Element in Preview` - Navigate to element
- **Configuration**:
  - `aider.autoOpenPreview` - Auto-open panel on startup
- **Documentation**:
  - [VISUAL_WORKFLOW_GUIDE.md](VISUAL_WORKFLOW_GUIDE.md) - Complete feature guide
  - [QUICK_REFERENCE_VISUAL.md](QUICK_REFERENCE_VISUAL.md) - Quick start cheat sheet
- **Testing**: Unit tests for preview panel functionality

### Enhanced
- InspectorData interface now includes `filePath` and `line` properties
- Inspector notifications now offer "Open File" in addition to "Paste to Chat"
- Preview URL auto-fills from configuration settings
- Better error handling for cross-origin restrictions

## [0.2.0] - 2024

### Added
- Live Preview feature with embedded webview for viewing applications
- Component/CSS Inspector for identifying React components and styling
- Click-to-inspect functionality in live preview
- Automatic clipboard copy of component/CSS information
- One-click paste of inspector data into chat
- New commands: `Aider: Set Preview URL` and `Aider: Paste to Chat`
- Configuration options for preview URL and inspector settings
- Comprehensive documentation in LIVE_PREVIEW_GUIDE.md
- Unit tests for preview provider functionality
- Support for React component name detection
- XPath generation for precise element location
- Hover highlighting for inspected elements
- Cross-origin error handling and user feedback

## [0.1.0] - 2024

### Added
- Initial release of Aider VS Code extension
- Real-time chat interface with Aider backend
- File management (add/remove files from chat context)
- Webview-based chat UI with message history
- Command palette integration for all Aider operations
- Activity bar integration with dedicated sidebar
- Configuration options for API endpoint and model selection
- Automatic diff viewing for applied changes
- Undo support for reverting changes
- VS Code Web compatibility
- Tree view for files currently in chat
- Health check for backend connectivity
- Auto-commit option for changes
- Keyboard shortcuts for sending messages
- Integration with VS Code's Git support
