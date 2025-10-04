# Aider VS Code Extension Documentation

AI pair programming with Aider directly in VS Code. This documentation covers everything you need to know about installing, configuring, and using the Aider VS Code extension.

## Table of Contents

- [Overview](#overview)
- [Quick Links](#quick-links)
- [Documentation Structure](#documentation-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Requirements](#requirements)
- [Support](#support)

## Overview

The Aider VS Code extension enables seamless interaction with the Aider AI pair programming assistant directly in your VS Code environment. It provides a rich set of features for collaborative app building, including chat interfaces, live preview, screenshot-to-code generation, and more.

### Key Capabilities

- **Real-time Chat**: Interact with Aider through a built-in chat interface
- **Multiple AI Providers**: Choose between Default, Ollama, and GitHub Copilot
- **Live Preview**: View your application with component/CSS inspector
- **Screenshot-to-Code**: Generate code from screenshots or wireframes
- **Project Context**: Store and manage project-specific coding patterns
- **File Management**: Add/remove files from chat context
- **GitHub Integration**: Push changes and create PRs directly from VS Code
- **Diff Viewing**: See exactly what changes Aider makes
- **Web Compatible**: Works in VS Code Web and Desktop

## Quick Links

### Setup & Installation
- **[Installation Guide](setup/installation.md)** - Detailed installation instructions
- **[Quick Start (5 min)](setup/quickstart.md)** - Get running quickly
- **[Configuration](setup/configuration.md)** - Configuration options and settings

### Usage Guides
- **[Getting Started](usage/getting-started.md)** - Basic usage guide
- **[Chat Interface](usage/chat-interface.md)** - Using the chat effectively
- **[File Management](usage/file-management.md)** - Managing files in context
- **[Common Workflows](usage/workflows.md)** - Typical usage patterns

### Features
- **[AI Providers](features/ai-providers.md)** - Multi-provider AI support
- **[Live Preview](features/live-preview.md)** - Live preview with inspector
- **[Vision Models](features/vision-models.md)** - Screenshot-to-code generation
- **[GitHub Integration](features/github-integration.md)** - Git and GitHub features
- **[Project Context](features/project-context.md)** - Project-level context storage

### Development
- **[Architecture](development/architecture.md)** - Extension architecture
- **[Contributing](development/contributing.md)** - Development guide
- **[Changelog](development/changelog.md)** - Version history

### Examples
- **[Examples Directory](../../../vscode-extension/examples/)** - Code examples and demos
- **[Testing Guide](../../../vscode-extension/examples/TESTING_GUIDE.md)** - Testing procedures

## Documentation Structure

```
docs/vscode-extension/
├── README.md                       # This file - overview and navigation
├── setup/
│   ├── installation.md            # Installation guide
│   ├── quickstart.md              # 5-minute quick start
│   └── configuration.md           # Configuration options
├── usage/
│   ├── getting-started.md         # Basic usage guide
│   ├── chat-interface.md          # Using the chat
│   ├── file-management.md         # Managing files
│   └── workflows.md               # Common workflows
├── features/
│   ├── ai-providers.md            # Multi-provider AI
│   ├── live-preview.md            # Live preview feature
│   ├── vision-models.md           # Screenshot-to-code
│   ├── github-integration.md      # GitHub features
│   └── project-context.md         # Project context
└── development/
    ├── architecture.md            # Extension architecture
    ├── contributing.md            # Development guide
    └── changelog.md               # Version history
```

## Getting Started

### For Users

1. **[Install the extension](setup/installation.md)** - Follow installation guide
2. **[Quick Start](setup/quickstart.md)** - Get up and running in 5 minutes
3. **[Try the features](features/)** - Explore what's available

### For Developers

1. **[Clone and build](development/contributing.md)** - Set up development environment
2. **[Review architecture](development/architecture.md)** - Understand the design
3. **[Make changes](development/contributing.md)** - Contribute improvements

## Features

### Visual-First Workflow
Full-page app preview as the primary view with Aider sidebar for quick access.

### Screenshot-to-Code Generation
Upload or paste screenshots to automatically generate React/Next.js components:
- Drag-and-drop support for images
- Clipboard integration
- AI-powered analysis using Ollama or GitHub Copilot
- Automatic file creation and code preview

Learn more: [Vision Models Guide](features/vision-models.md)

### Multi-AI Provider Support
Choose between Default, Ollama, and GitHub Copilot:
- **Ollama**: Fast, local AI for lightweight tasks
- **GitHub Copilot**: Advanced AI for complex work
- **Automatic Selection**: Let Aider choose based on task complexity

Learn more: [AI Providers Guide](features/ai-providers.md)

### Live Preview with Inspector
View your application in full-page panel and click elements to:
- Identify React components
- Inspect CSS styles
- Navigate to source files
- Trigger AI edits

Learn more: [Live Preview Guide](features/live-preview.md)

### Project-Level Context Storage
Store and manage project-specific:
- Coding standards and rules
- Design principles
- Project goals
- Coding patterns
- Persistent storage in `.aider/project-context.json`

Learn more: [Project Context Guide](features/project-context.md)

### GitHub Integration
- Push changes to remote repositories
- Create pull requests
- Manage branches
- Natural language Git commands

Learn more: [GitHub Integration Guide](features/github-integration.md)

### Real-time Chat
- Interact with Aider through built-in chat
- Context-aware suggestions
- Code change previews
- Undo support

Learn more: [Chat Interface Guide](usage/chat-interface.md)

### File Management
- Add/remove files from chat context
- Live changes applied directly
- Diff viewing
- Easy revert with one click

Learn more: [File Management Guide](usage/file-management.md)

## Requirements

- **VS Code**: 1.85.0 or higher
- **Aider Backend**: Running locally or remote
- **Git**: Repository for your project
- **Python**: 3.10+ (for backend)
- **Node.js**: 20.x+ (for building extension)

### Optional Requirements

- **Ollama**: For local AI provider (preloaded in dev container)
- **GitHub Copilot**: Subscription for advanced AI
- **Docker**: For dev container setup

## Support

### Documentation
- [This documentation](./README.md)
- [Aider Main Docs](https://aider.chat/docs)
- [VS Code Extension API](https://code.visualstudio.com/api)

### Community
- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Aider Discord](https://discord.gg/aider)
- [Discussions](https://github.com/Aider-AI/aider/discussions)

### Troubleshooting
- [Common Issues](features/live-preview.md#troubleshooting)
- [AI Provider Issues](features/ai-providers.md#troubleshooting)
- [Installation Issues](setup/installation.md#troubleshooting)

## Contributing

We welcome contributions! See the [Contributing Guide](development/contributing.md) for:
- Development setup
- Code standards
- Testing procedures
- Pull request process

## License

Apache-2.0 (same as Aider main project)

---

**Quick Navigation:**
[Setup](setup/) | [Usage](usage/) | [Features](features/) | [Development](development/) | [Examples](../../../vscode-extension/examples/)

*For the main Aider documentation, visit [aider.chat/docs](https://aider.chat/docs)*
