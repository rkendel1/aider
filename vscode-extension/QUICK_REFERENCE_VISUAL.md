# Visual-First Workflow - Quick Reference

## Quick Start (30 seconds)

1. **Open VS Code** → Preview panel opens automatically
2. **Start dev server**: `npm run dev`
3. **Click "Load"** in preview (auto-filled with http://localhost:3000)
4. **Enable Inspector** → Click "Inspector Off" button
5. **Click any element** → Choose "Paste to Chat"
6. **Tell Aider what to change** → Watch it happen live! ✨

---

## Commands Cheat Sheet

| Command | Shortcut | Description |
|---------|----------|-------------|
| `Aider: Open App Preview` | - | Open full-page preview panel |
| `Aider: Refresh Preview` | - | Reload the preview |
| `Aider: Start Chat` | - | Open Aider chat sidebar |
| `Aider: Add File to Chat` | - | Add current file to context |
| `Aider: Paste to Chat` | - | Paste clipboard to chat |
| `Aider: Highlight Element` | - | Highlight element by XPath |
| `Aider: Scroll to Element` | - | Navigate to element |
| `Aider: Undo Last Changes` | - | Revert last commit |

💡 **Tip**: Assign keyboard shortcuts to frequently used commands!

---

## Inspector Actions

When you click an element with Inspector enabled:

### Captured Data
- ✓ Element type (div, button, etc.)
- ✓ CSS classes
- ✓ Inline styles  
- ✓ XPath location
- ✓ React component name (if available)
- ✓ Source file & line (in dev mode)

### Available Actions
- **Paste to Chat** → Insert data into Aider for AI editing
- **Open File** → Jump to source code (when available)
- **Dismiss** → Just copy to clipboard

---

## Settings Quick Config

```json
{
  // Preview opens automatically on startup
  "aider.autoOpenPreview": true,
  
  // Your app's development URL
  "aider.previewUrl": "http://localhost:3000",
  
  // Enable click-to-inspect feature
  "aider.enableInspector": true
}
```

---

## Workflow Patterns

### Pattern 1: Visual Component Editing
```
1. Browse app → Find component to change
2. Click element → Enable inspector first
3. "Paste to Chat" → Data goes to Aider
4. Describe change → "Make this button larger and blue"
5. See live update → HMR refreshes automatically
```

### Pattern 2: Source Navigation
```
1. Click element with inspector
2. Choose "Open File"
3. Edit in VS Code
4. Add file to Aider context
5. Ask Aider for improvements
```

### Pattern 3: Route-Based Development
```
1. Navigate to route in preview
2. Get route change notification
3. Focus on that route's components
4. Make targeted changes
```

---

## Keyboard Workflow

```
Ctrl+Shift+P → "Aider: Open App Preview" → Enter
[Click element in preview]
[Notification appears]
Click "Paste to Chat"
[Type in Aider sidebar]
"Make this component responsive" → Enter
[Watch changes apply live]
```

---

## Troubleshooting Fast Fixes

| Problem | Quick Fix |
|---------|-----------|
| Preview blank | Check dev server is running |
| Inspector not working | Use localhost URL (not external) |
| File won't open | Ensure workspace folder is open |
| No auto-open | Check `aider.autoOpenPreview` setting |
| Cross-origin error | Use local development server |

---

## Pro Tips

### 🚀 Speed Tips
- Keep inspector always enabled during development
- Use split view: preview left, code right
- Enable HMR in your dev server
- Set workspace-specific preview URLs

### 🎯 Precision Tips
- Click exact element you want to change
- Use specific CSS class names in requests
- Mention component names from inspector
- Reference XPath for precise targeting

### 🔄 Iteration Tips
- Make small changes and test immediately
- Use "Undo" freely to experiment
- Let Aider auto-add files to context
- Combine with Git for version control

---

## Common Use Cases

### Styling Changes
```
Inspector → "Update <button> with classes: primary-button, large"
Ask Aider → "Make the button more prominent with a gradient"
```

### Component Refactoring
```
Inspector → "Component: UserCard"
Ask Aider → "Extract the avatar into a separate component"
```

### Layout Adjustments
```
Inspector → "Element: <div> with classes: hero-section"
Ask Aider → "Make this section responsive for mobile"
```

### Bug Fixes
```
Inspector → [Click broken element]
Open File → See source code
Ask Aider → "Fix the alignment issue in this component"
```

---

## Integration with Other Tools

### With Git
- Use Aider's auto-commit feature
- Review changes with `Aider: Show Diff`
- Undo changes with one click
- Create feature branches before big changes

### With Linters
- Let Aider fix linting issues
- Auto-format after changes
- Maintain code quality

### With Testing
- Generate tests for new components
- Update tests after refactoring
- Ask Aider to add test coverage

---

## Limitations & Workarounds

### Cross-Origin Restrictions
- **Issue**: External sites can't be inspected
- **Workaround**: Use local development server

### Source Mapping
- **Issue**: Source files not always detected
- **Workaround**: Use development builds with source maps

### HMR Not Working
- **Issue**: Changes don't update automatically
- **Workaround**: Use "Refresh Preview" command

---

## Next Steps

1. **Learn More**: Read [VISUAL_WORKFLOW_GUIDE.md](VISUAL_WORKFLOW_GUIDE.md)
2. **Configure AI Providers**: See [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md)
3. **Explore Examples**: Try [examples/preview-test.html](examples/preview-test.html)
4. **Join Community**: Share your workflows and tips!

---

**Happy Visual-First Development! 🎨✨**
