# GitHub CLI Integration for Aider VS Code Extension

## Overview

The Aider VS Code extension now includes seamless GitHub CLI integration, enabling you to perform GitHub operations directly from VS Code using natural language commands or traditional command palette options.

## Features

### 1. Git Mandatory Requirement

Git is now a **mandatory dependency** for Aider. The application will not start without Git installed. This ensures consistent version control and change tracking across all Aider operations.

### 2. GitHub CLI Integration

The extension integrates with GitHub CLI (`gh`) to provide:
- Push and pull operations
- Branch creation and management
- Pull request creation
- Repository cloning
- Template fetching and application

### 3. Natural Language Interface

Use natural language to perform GitHub operations:
- "push my changes" → Executes `git push`
- "create a new branch" → Prompts for branch name and creates it
- "create a pull request" → Guides you through PR creation
- "clone a repository" → Clones the specified repo
- "fetch a template" → Fetches and applies a template repository

### 4. Template Management

Easily fetch and apply templates from GitHub:
1. Run `Aider GitHub: Fetch Template`
2. Enter the template repository (e.g., `username/template-name`)
3. Template is cloned to your workspace
4. Start building with the template structure

### 5. Repository Cloning

Clone repositories directly from VS Code:
1. Run `Aider GitHub: Clone Repository`
2. Enter repository URL or `owner/repo` format
3. Optionally specify target directory
4. Repository is cloned and ready to use

## Installation Requirements

### Git (Mandatory)

Git must be installed on your system:
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **macOS**: `brew install git` or download from [git-scm.com](https://git-scm.com/download/mac)
- **Linux**: `sudo apt-get install git` (Debian/Ubuntu) or equivalent

Verify installation: `git --version`

### GitHub CLI (Required for GitHub Features)

GitHub CLI enables GitHub-specific operations:
- **macOS**: `brew install gh`
- **Windows**: Download from [GitHub CLI releases](https://github.com/cli/cli/releases) or `winget install --id GitHub.cli`
- **Linux (Debian/Ubuntu)**:
  ```bash
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update
  sudo apt install gh
  ```
- **Linux (Fedora/RHEL)**: `sudo dnf install gh`

Verify installation: `gh --version`

### Authentication

After installing GitHub CLI, authenticate with GitHub:
```bash
gh auth login
```

Or use the extension command: `Aider GitHub: Authenticate`

## Commands

### Chat Commands
- `Aider: Start Chat` - Open the chat panel
- `Aider: Send Message` - Send a quick message
- `Aider: Add File to Chat` - Add current file to chat context
- `Aider: Remove File from Chat` - Remove file from context
- `Aider: Clear Chat History` - Clear all messages
- `Aider: Undo Last Changes` - Revert last commit
- `Aider: Show Diff` - View recent changes

### GitHub Commands
- `Aider GitHub: Push Changes` - Push commits to remote
- `Aider GitHub: Pull Changes` - Pull latest changes
- `Aider GitHub: Create Branch` - Create a new branch
- `Aider GitHub: Create Pull Request` - Create a PR
- `Aider GitHub: Clone Repository` - Clone a GitHub repository
- `Aider GitHub: Fetch Template` - Fetch and apply a template
- `Aider GitHub: Natural Language Command` - Use natural language for operations
- `Aider GitHub: Authenticate` - Authenticate with GitHub

## Usage Examples

### Example 1: Push Changes

```
1. Make changes using Aider chat
2. Press Ctrl+Shift+P
3. Run "Aider GitHub: Push Changes"
4. Changes are pushed to origin
```

### Example 2: Create Pull Request

```
1. Create a new branch: "Aider GitHub: Create Branch"
2. Make and commit changes
3. Run "Aider GitHub: Create Pull Request"
4. Enter title: "Add new feature"
5. Enter description: "Implements X feature"
6. PR is created on GitHub
```

### Example 3: Natural Language Command

```
1. Press Ctrl+Shift+P
2. Run "Aider GitHub: Natural Language Command"
3. Enter: "create a pull request for my changes"
4. Extension guides you through PR creation
```

### Example 4: Fetch Template

```
1. Run "Aider GitHub: Fetch Template"
2. Enter: "username/react-typescript-template"
3. Template is cloned to workspace
4. Start building on the template
```

### Example 5: Clone Repository

```
1. Run "Aider GitHub: Clone Repository"
2. Enter: "facebook/react" or "https://github.com/facebook/react"
3. Optionally specify directory: "my-react-clone"
4. Repository is cloned and ready
```

## Configuration

Extension settings in VS Code:

```json
{
  "aider.apiEndpoint": "http://localhost:8501",
  "aider.modelName": "",
  "aider.autoCommit": true,
  "aider.showDiffs": true,
  "aider.github.checkOnStartup": true,
  "aider.github.autoAuthenticate": false
}
```

### Settings Explained

- `aider.github.checkOnStartup` - Check GitHub CLI availability when extension activates
- `aider.github.autoAuthenticate` - Automatically prompt for GitHub authentication if not logged in

## Troubleshooting

### Git Not Found

**Error**: "Git is required for Aider to function"

**Solution**: Install Git from [git-scm.com](https://git-scm.com/) and ensure it's in your PATH.

### GitHub CLI Not Found

**Warning**: "GitHub CLI (gh) is not installed"

**Solution**: 
1. Install GitHub CLI following the installation instructions above
2. Restart VS Code after installation
3. Verify with `gh --version` in terminal

### Not Authenticated

**Error**: "Not authenticated with GitHub"

**Solution**:
1. Run `Aider GitHub: Authenticate` from Command Palette
2. Or run `gh auth login` in terminal
3. Follow the authentication prompts

### Permission Denied

**Error**: "Permission denied (publickey)" when pushing/pulling

**Solution**:
1. Set up SSH keys for GitHub: [GitHub SSH Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
2. Or use HTTPS with credential helper: `git config --global credential.helper store`

## Architecture

The GitHub integration uses:
1. **GitHub CLI (`gh`)** - For GitHub-specific operations (PR creation, repo cloning, etc.)
2. **Git** - For version control operations (push, pull, branch management)
3. **Natural Language Processing** - Simple keyword matching to interpret user intent

## Contributing

Contributions are welcome! To add new GitHub features:

1. Update `githubClient.ts` with new methods
2. Add commands to `extension.ts`
3. Register commands in `package.json`
4. Update documentation
5. Add tests if applicable

## License

Apache-2.0 - See LICENSE file for details

## Support

- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Documentation](https://aider.chat)
- [Discord Community](https://discord.gg/aider)
