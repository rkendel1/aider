# GitHub Integration

Seamlessly manage Git and GitHub operations directly from VS Code using natural language or command palette.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Authentication](#authentication)
- [Usage](#usage)
- [Natural Language Commands](#natural-language-commands)
- [Command Reference](#command-reference)
- [Workflows](#workflows)
- [Troubleshooting](#troubleshooting)

## Overview

The GitHub Integration feature provides:
- **Git Operations**: Push, pull, commit, branch management
- **GitHub Features**: Create PRs, clone repos, fetch templates
- **Natural Language**: Use plain English for Git commands
- **Template Management**: Quick project scaffolding

### Requirements

✅ **Git**: Mandatory for all Aider operations  
✅ **GitHub CLI**: Required for GitHub-specific features  
✅ **Authentication**: One-time GitHub login  

## Features

### Git Integration

- **Push and Pull**: Sync with remote repositories
- **Branch Management**: Create, switch, and delete branches
- **Commit Tracking**: Automatic commit of Aider changes
- **Diff Viewing**: See what changed
- **Undo Support**: Revert unwanted changes

### GitHub CLI Features

- **Pull Requests**: Create and manage PRs
- **Repository Cloning**: Clone any GitHub repo
- **Template Fetching**: Quick project setup from templates
- **Authentication**: Secure GitHub login

### Natural Language Interface

Talk to Aider using natural commands:
- "push my changes" → Executes `git push`
- "create a new branch called feature-x" → Creates branch
- "create a pull request" → Guides through PR creation
- "clone the React template" → Clones template repo

## Installation

### Step 1: Install Git (Mandatory)

Git is **required** - Aider won't start without it.

**Windows:**
```bash
# Download installer from git-scm.com
# Or use winget:
winget install --id Git.Git
```

**macOS:**
```bash
brew install git
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get install git
```

**Verify:**
```bash
git --version
# Should show: git version 2.x.x
```

### Step 2: Install GitHub CLI (Required for GitHub Features)

**macOS:**
```bash
brew install gh
```

**Windows:**
```bash
# Download from github.com/cli/cli/releases
# Or use winget:
winget install --id GitHub.cli
```

**Linux (Debian/Ubuntu):**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install gh
```

**Verify:**
```bash
gh --version
# Should show: gh version 2.x.x
```

## Authentication

### Method 1: Extension Command

1. Open Command Palette (Ctrl+Shift+P)
2. Type "Aider GitHub: Authenticate"
3. Follow the prompts
4. Authenticate in browser

### Method 2: Command Line

```bash
gh auth login
```

Follow interactive prompts:
1. Choose GitHub.com or GitHub Enterprise
2. Select HTTPS or SSH protocol
3. Authenticate with browser or token
4. Grant necessary permissions

**Verify Authentication:**
```bash
gh auth status
```

## Usage

### Push Changes

**Command Palette:**
1. Open Command Palette (Ctrl+Shift+P)
2. Type "Aider GitHub: Push Changes"
3. Press Enter
4. Changes pushed to remote

**Natural Language (in chat):**
```
push my changes
```

or

```
push to GitHub
```

### Create Pull Request

**Command Palette:**
1. Ensure changes are pushed
2. Open Command Palette
3. Type "Aider GitHub: Create Pull Request"
4. Fill in PR details:
   - Title
   - Description
   - Base branch (default: main)
5. PR created and link displayed

**Natural Language (in chat):**
```
create a pull request for my changes
```

### Clone Repository

**Command Palette:**
1. Open Command Palette
2. Type "Aider GitHub: Clone Repository"
3. Enter repository:
   - Full URL: `https://github.com/user/repo`
   - Or short form: `user/repo`
4. Choose target directory
5. Repository cloned

**Natural Language (in chat):**
```
clone the repository user/repo
```

### Fetch Template

**Command Palette:**
1. Open Command Palette
2. Type "Aider GitHub: Fetch Template"
3. Enter template repository: `user/template-name`
4. Template cloned to workspace
5. Start building with template

**Natural Language (in chat):**
```
fetch the Next.js SaaS template
```

or

```
clone template user/nextjs-saas-starter
```

### Create Branch

**Command Palette:**
1. Open Command Palette
2. Type "Aider GitHub: Create Branch"
3. Enter branch name
4. Branch created and checked out

**Natural Language (in chat):**
```
create a new branch called feature/user-auth
```

## Natural Language Commands

### Git Operations

| Natural Language | Action |
|------------------|--------|
| "push my changes" | `git push` |
| "pull latest changes" | `git pull` |
| "commit with message X" | `git commit -m "X"` |
| "create branch feature-x" | `git checkout -b feature-x` |
| "switch to main" | `git checkout main` |
| "show my changes" | `git diff` |
| "undo last commit" | Undo via Aider |

### GitHub Operations

| Natural Language | Action |
|------------------|--------|
| "create a pull request" | Creates PR via `gh` |
| "clone repo user/name" | Clones repository |
| "fetch template X" | Clones template |
| "open PR in browser" | Opens PR URL |

### Smart Detection

Aider intelligently interprets:
- "push" → Detects git push intent
- "pr" → Pull request
- "merge" → Merge branch
- "branch" → Branch operations

## Command Reference

### Git Commands

- **Aider GitHub: Push Changes** - Push commits to remote
- **Aider GitHub: Pull Changes** - Pull latest from remote
- **Aider GitHub: Create Branch** - Create and checkout new branch
- **Aider GitHub: Show Diff** - View uncommitted changes
- **Aider: Undo Last Changes** - Revert last commit

### GitHub Commands

- **Aider GitHub: Create Pull Request** - Create PR from current branch
- **Aider GitHub: Clone Repository** - Clone GitHub repo
- **Aider GitHub: Fetch Template** - Clone template repo
- **Aider GitHub: Authenticate** - Login to GitHub

## Workflows

### Workflow 1: Feature Development

```
1. Create feature branch:
   Chat: "create branch feature/new-button"

2. Make changes with Aider:
   Chat: "Add a new submit button component"

3. Review changes:
   Command: "Aider GitHub: Show Diff"

4. Push changes:
   Chat: "push my changes"

5. Create PR:
   Chat: "create a pull request"
   Enter title and description
```

### Workflow 2: Start from Template

```
1. Fetch template:
   Chat: "fetch template vercel/next-saas-starter"

2. Open template in VS Code:
   File → Open Folder → Select cloned template

3. Make customizations:
   Chat: "Update the landing page with our branding"

4. Initialize as your repo:
   Terminal: git remote set-url origin https://github.com/you/your-repo

5. Push to your repo:
   Chat: "push my changes"
```

### Workflow 3: Collaborative Development

```
1. Clone team repository:
   Chat: "clone team/project-name"

2. Create feature branch:
   Chat: "create branch feature/user-profile"

3. Pull latest:
   Chat: "pull latest changes"

4. Make changes with Aider:
   Chat: "Add user profile page with avatar upload"

5. Push and create PR:
   Chat: "push and create a pull request"

6. Share PR link with team
```

### Workflow 4: Bug Fix

```
1. Create bug fix branch:
   Chat: "create branch fix/login-error"

2. Fix the bug:
   Chat: "Fix the authentication error in login.ts"

3. Test changes in preview

4. Push and PR:
   Chat: "push changes and create PR"
   Title: "Fix authentication error"
   Description: "Resolves #123"
```

## Troubleshooting

### Git Not Found

**Symptoms**: "Git is not installed" error

**Solutions**:
1. Install Git (see [Installation](#installation))
2. Restart VS Code after installing
3. Verify: `git --version` in terminal
4. Add Git to PATH if needed

### GitHub CLI Not Found

**Symptoms**: "gh command not found"

**Solutions**:
1. Install GitHub CLI (see [Installation](#installation))
2. Verify: `gh --version`
3. Restart terminal/VS Code
4. Check PATH includes `gh` binary

### Authentication Failed

**Symptoms**: "Authentication required" or "Not logged in"

**Solutions**:
1. Run: `gh auth login`
2. Or use: `Aider GitHub: Authenticate`
3. Check auth status: `gh auth status`
4. Re-authenticate if token expired

### Push Rejected

**Symptoms**: "Updates were rejected" or "non-fast-forward"

**Solutions**:
1. Pull latest changes first:
   ```bash
   git pull origin main
   ```
2. Resolve conflicts if any
3. Push again

### Can't Create PR

**Symptoms**: "No commits between branches" or PR creation fails

**Solutions**:
1. Ensure you have committed changes:
   ```bash
   git status
   ```
2. Push changes first:
   ```bash
   git push
   ```
3. Ensure you're on a different branch than base
4. Check remote repository exists

### Natural Language Not Working

**Symptoms**: Aider doesn't recognize GitHub commands

**Solutions**:
1. Ensure you're in Aider chat (not terminal)
2. Be more specific: "create a pull request" vs "pr"
3. Use command palette for exact commands
4. Check chat provider is connected

## Best Practices

### Commit Messages

- Use Aider's auto-commit with descriptive messages
- Review commits before pushing
- Keep commits atomic and focused

### Branch Naming

- Use descriptive names: `feature/user-auth` not `branch1`
- Follow team conventions
- Keep branch names short but meaningful

### Pull Requests

- Write clear titles and descriptions
- Reference issues: "Fixes #123"
- Request reviews from team members
- Link to relevant documentation

### Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Review diffs before pushing
- Use `.gitignore` appropriately

## Configuration

### Settings

```json
{
  // Auto-commit Aider changes
  "aider.git.autoCommit": true,
  
  // Commit message prefix
  "aider.git.commitPrefix": "[Aider]",
  
  // Auto-push after commit
  "aider.git.autoPush": false,
  
  // Default branch for PRs
  "aider.github.defaultBranch": "main"
}
```

## Related Documentation

- **[Chat Interface](../usage/chat-interface.md)** - Using natural language
- **[Workflows](../usage/workflows.md)** - Complete development workflows
- **[Getting Started](../usage/getting-started.md)** - Basic usage

---

**Quick Tip:** Use natural language in chat for common Git operations. Use Command Palette for complex GitHub actions! 🚀

*Having issues? Check [Troubleshooting](#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).*
