# Getting Started with Aider VS Code Extension

Learn the basics of using Aider for AI pair programming in VS Code.

## Table of Contents

- [Introduction](#introduction)
- [First Steps](#first-steps)
- [Basic Workflows](#basic-workflows)
- [Understanding the Interface](#understanding-the-interface)
- [Working with Files](#working-with-files)
- [Making Code Changes](#making-code-changes)
- [Tips for Success](#tips-for-success)
- [Next Steps](#next-steps)

## Introduction

Aider is your AI pair programming partner in VS Code. It helps you:
- Write new code
- Refactor existing code
- Fix bugs
- Add features
- Understand codebases

### How It Works

1. **Add files** to chat context
2. **Describe** what you want
3. **Aider analyzes** your code
4. **Changes applied** automatically
5. **Review and commit** or undo

## First Steps

### 1. Open Aider

**Method A: Activity Bar**
- Click the Aider icon in left sidebar
- Chat panel opens

**Method B: Command Palette**
- Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
- Type "Aider: Start Chat"
- Press Enter

### 2. Add Your First File

**Method A: Command Palette**
1. Open a file you want to work with
2. Press Ctrl+Shift+P
3. Type "Aider: Add File to Chat"
4. File appears in "Files in Chat" panel

**Method B: Right-Click**
1. Right-click file in Explorer
2. Select "Add to Aider Chat"

**Method C: Drag and Drop**
1. Drag file from Explorer
2. Drop into chat panel

### 3. Ask Aider to Help

Type your request in the chat input. Examples:

**Simple request:**
```
Add a function to calculate the fibonacci sequence
```

**Specific request:**
```
Refactor the UserProfile component to use hooks instead of class components
```

**Bug fix:**
```
Fix the bug where the form doesn't validate email addresses
```

### 4. Review Changes

After Aider responds:
1. Check the Files panel for modified files
2. Click "Show Diff" to see changes
3. Review the changes carefully
4. Accept or undo

### 5. Iterate

Continue the conversation:
```
You: "Add error handling to the fibonacci function"
Aider: [makes changes]
You: "Also add input validation"
Aider: [updates the code]
```

## Basic Workflows

### Workflow 1: Add a New Feature

```
1. Open your project in VS Code
2. Start Aider chat
3. Add relevant files (e.g., the component file)
4. Request: "Add a dark mode toggle to the header"
5. Aider generates and applies code
6. Review in live preview
7. Commit changes
```

### Workflow 2: Refactor Code

```
1. Add the file you want to refactor
2. Request: "Refactor this component to improve performance"
3. Aider analyzes and suggests improvements
4. Review the diff
5. If good, keep changes
6. If not, undo and try again with more specific instructions
```

### Workflow 3: Fix a Bug

```
1. Identify the buggy file
2. Add to chat context
3. Request: "Fix the bug where users can submit empty forms"
4. Aider finds the issue and fixes it
5. Test the fix
6. Commit if working
```

### Workflow 4: Understand Code

```
1. Add complex file to chat
2. Ask: "Explain what this component does"
3. Aider provides explanation
4. Ask follow-up questions
5. Request: "Add comments to explain the complex parts"
```

## Understanding the Interface

### Chat Panel

**Message Area:**
- Your messages appear on right
- Aider's responses on left
- Provider badge shows which AI was used

**Input Box:**
- Type your requests here
- Supports multi-line input (Shift+Enter)
- Paste images for screenshot-to-code

**Provider Dropdown:**
- Select AI provider (Default, Ollama, Copilot)
- Available at top of chat

### Files Panel

**Files in Chat:**
- Shows files currently in context
- Click to open file
- Click X to remove from context
- Max recommended: 5-10 files

**Add Files:**
- Click + button
- Use command palette
- Drag and drop

### Live Preview Panel

**Preview Window:**
- Shows your running application
- Click elements to inspect
- Auto-refreshes on changes

**Controls:**
- URL input
- Refresh button
- Inspector toggle

### Status Bar

Shows:
- Connection status
- Current provider
- Active files count

## Working with Files

### Adding Files

**When to Add:**
- Files you want to modify
- Related files for context
- Configuration files if needed

**Best Practices:**
- Start with 1-2 files
- Add more only if needed
- Remove files when done with them

### Removing Files

**Why Remove:**
- Keeps context focused
- Improves response speed
- Reduces token usage

**How to Remove:**
1. Go to Files panel
2. Click X next to file name
3. Or use "Remove File from Chat" command

### File Context Tips

**✓ Good Context:**
```
Files in chat:
- UserProfile.tsx (file to modify)
- types.ts (type definitions)
```

**✗ Too Much Context:**
```
Files in chat:
- UserProfile.tsx
- Header.tsx
- Footer.tsx
- api.ts
- utils.ts
- config.ts
- ... (15 more files)
```

## Making Code Changes

### Requesting Changes

**Be Specific:**
```
✓ "Add input validation to the email field using regex"
✗ "Make the form better"
```

**Provide Context:**
```
✓ "Refactor the useAuth hook to use React Query instead of useState"
✗ "Fix the auth code"
```

**One Thing at a Time:**
```
✓ "Add error handling"
   Then: "Add loading states"
✗ "Add error handling, loading states, success messages, and retry logic"
```

### Reviewing Changes

**Check the Diff:**
1. Click "Show Diff" button
2. Review each change
3. Look for unexpected modifications
4. Ensure logic is correct

**Test Changes:**
1. Use live preview if available
2. Run your application
3. Test the modified functionality
4. Check for errors

### Accepting or Rejecting

**Accept Changes:**
- If changes look good
- After testing
- Commit to Git

**Undo Changes:**
- Click "Undo" button
- Or use "Aider: Undo Last Changes"
- Reverts to previous state

**Iterate:**
- Provide more specific instructions
- Ask Aider to refine
- Make manual adjustments

## Tips for Success

### Writing Good Prompts

**1. Be Specific**
```
✓ "Add a button that opens a modal dialog with a form"
✗ "Add a button"
```

**2. Provide Context**
```
✓ "Update the login function to use JWT tokens instead of sessions"
✗ "Update the login"
```

**3. Include Requirements**
```
✓ "Create a responsive navbar using Tailwind CSS with mobile hamburger menu"
✗ "Create a navbar"
```

**4. Reference Existing Code**
```
✓ "Style the new component like the existing Card component"
✗ "Style the component"
```

### Common Pitfalls

**❌ Adding Too Many Files**
- Slows responses
- Increases costs
- Confuses Aider
- **Solution**: Start with 1-2 key files

**❌ Vague Requests**
- Gets generic code
- May not match intent
- **Solution**: Be specific about what you want

**❌ Not Reviewing Changes**
- May introduce bugs
- May not match expectations
- **Solution**: Always review diffs

**❌ Not Using Git**
- Can't revert mistakes
- Lose change history
- **Solution**: Commit working code frequently

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Chat | Ctrl+Shift+P → "Start Chat" |
| Add File | Ctrl+Shift+P → "Add File" |
| Show Diff | Click button or command |
| Undo Changes | Click button or command |
| Send Message | Enter |
| New Line | Shift+Enter |

### Best Practices

1. **Start Simple**: Begin with small changes
2. **Iterate**: Refine through conversation
3. **Review**: Always check diffs
4. **Test**: Verify changes work
5. **Commit**: Save working states
6. **Context**: Add only necessary files
7. **Specific**: Be clear in requests
8. **Learn**: Understand changes Aider makes

## Next Steps

### Learn More Features

- **[AI Providers](../features/ai-providers.md)** - Use different AI models
- **[Live Preview](../features/live-preview.md)** - Visual development
- **[Vision Models](../features/vision-models.md)** - Screenshot-to-code
- **[GitHub Integration](../features/github-integration.md)** - Git operations
- **[Project Context](../features/project-context.md)** - Project standards

### Advanced Usage

- **[Chat Interface](chat-interface.md)** - Advanced chat features
- **[File Management](file-management.md)** - Context management
- **[Common Workflows](workflows.md)** - Typical patterns

### Development

- **[Architecture](../development/architecture.md)** - How it works
- **[Contributing](../development/contributing.md)** - Help improve Aider

## Quick Reference

### Common Commands

- Start chat
- Add file to chat
- Remove file from chat
- Show diff
- Undo changes
- Clear chat history

### Common Requests

```
"Create a [component] that [does something]"
"Refactor [code] to [improvement]"
"Fix the bug where [issue]"
"Add [feature] to [file]"
"Explain how [code] works"
```

### Troubleshooting

**Aider not responding:**
- Check API connection
- Verify files are added
- Check provider is selected

**Changes not what you wanted:**
- Undo and try again
- Be more specific
- Add more context files

**Slow responses:**
- Remove unnecessary files
- Use Ollama for simple tasks
- Check internet connection

---

**Ready to code?** Open Aider and try your first request! 🚀

*Need help? See [Troubleshooting](../setup/quickstart.md#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).*
