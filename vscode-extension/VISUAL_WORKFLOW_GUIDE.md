# Visual-First Workflow - Feature Guide

## Overview

The Aider VS Code extension now supports a **visual-first, context-aware workflow** where the running application preview is the central focus. This guide explains how to use the new full-page preview panel and its bidirectional communication with Aider.

## Key Features

### 1. Full-Page App Preview

Unlike the sidebar preview, the full-page preview panel provides:
- **Main view experience**: The preview occupies the primary editor area
- **Auto-open on startup**: Configurable to open automatically when VS Code starts
- **Retained context**: Stays loaded even when switching tabs
- **HMR support**: Works seamlessly with Next.js/React development servers
- **Status bar**: Shows current route and inspector status

### 2. Enhanced Inspector

The inspector now provides advanced features:
- **React component detection** with source file mapping
- **Source file navigation**: Jump directly from preview to code
- **Route change monitoring**: Get notified when navigating in your app
- **Context-aware actions**: "Paste to Chat" or "Open File" based on available data

### 3. Bidirectional Communication

#### Preview → Aider
- **Element clicks**: Inspect components and CSS
- **Route changes**: Monitor navigation events
- **File open requests**: Jump to source files from preview
- **AI edit triggers**: Select elements to trigger contextual edits

#### Aider → Preview
- **Highlight elements**: Show specific elements by XPath
- **Scroll to elements**: Navigate to elements programmatically
- **Refresh preview**: Reload the preview on demand
- **Status updates**: Display feedback in the preview

## Getting Started

### Opening the Preview Panel

**Option 1: Automatic (Recommended)**
- The preview panel opens automatically when VS Code starts
- Configure with `aider.autoOpenPreview` setting (default: `true`)

**Option 2: Manual**
- Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
- Run: "Aider: Open App Preview"

### Setting Up Your Application URL

1. The preview auto-fills from `aider.previewUrl` setting
2. Default: `http://localhost:3000`
3. Change in settings or enter a new URL in the preview panel
4. Click "Load" to display your application

### Using the Inspector

1. **Enable Inspector**: Click "Inspector Off" button (becomes "Inspector On")
2. **Hover over elements**: See highlight outline on hover
3. **Click to inspect**: Click any element to capture its data
4. **Choose action**:
   - "Paste to Chat": Insert component/CSS info into Aider chat
   - "Open File": Jump to source file (if source mapping available)
   - "Dismiss": Just copy to clipboard

### Workflow Example

1. **Start your dev server**: `npm run dev` (Next.js example)
2. **Open VS Code**: Preview panel opens automatically
3. **Browse your app**: Navigate to the component you want to modify
4. **Enable inspector**: Click "Inspector Off" → "Inspector On"
5. **Click component**: Select the element you want to change
6. **Choose "Paste to Chat"**: Inspector data is pasted into Aider
7. **Describe changes**: Add your modification request to Aider
8. **Aider makes changes**: Code is updated automatically
9. **See live updates**: HMR refreshes the preview with new code

## Commands Reference

All commands are available via Command Palette (Ctrl+Shift+P):

### Preview Panel Commands

- **`Aider: Open App Preview`**
  - Opens the full-page preview panel
  - Creates new panel or shows existing one

- **`Aider: Refresh Preview`**
  - Reloads the current preview
  - Useful if preview is stuck or needs manual refresh

- **`Aider: Set Preview URL`**
  - Change the preview URL
  - Updates both preview and settings

### Element Navigation Commands

- **`Aider: Highlight Element in Preview`**
  - Highlight a specific element by XPath
  - Shows outline for 3 seconds
  - Useful for Aider to point out elements

- **`Aider: Scroll to Element in Preview`**
  - Scroll to and highlight an element
  - Smooth scrolling with center alignment
  - Highlight lasts 2 seconds

## Configuration Options

Access via: File → Preferences → Settings → Search "Aider"

### Preview Settings

```json
{
  // Auto-open preview panel on startup
  "aider.autoOpenPreview": true,
  
  // Default preview URL
  "aider.previewUrl": "http://localhost:3000",
  
  // Enable inspector feature
  "aider.enableInspector": true
}
```

### Workspace-Specific Settings

For project-specific URLs, add to `.vscode/settings.json`:

```json
{
  "aider.previewUrl": "http://localhost:3001",
  "aider.autoOpenPreview": true
}
```

## Advanced Features

### Source File Detection

The inspector can detect source files in two ways:

1. **React DevTools Integration**
   - Reads `_debugSource` from React fiber
   - Works in development mode
   - Provides file path and line number

2. **Data Attributes** (fallback)
   - Checks for `data-file` and `data-line` attributes
   - Useful for custom frameworks or templates

### Route Change Monitoring

When the preview detects navigation:
- Shows notification with new route
- Option to copy route to clipboard
- Can be used to trigger context-aware suggestions

### XPath Element Addressing

All element operations use XPath for precise targeting:
- **ID-based**: `//*[@id="my-element"]` (preferred)
- **Indexed**: `/html/body/div[1]/main[1]/section[2]`
- Generated automatically by inspector
- Used for highlight and scroll operations

## Troubleshooting

### Preview Not Loading

**Issue**: Blank preview or error message
**Solutions**:
- Check that dev server is running
- Verify URL is correct (check port number)
- Ensure app allows iframe embedding
- Try local development server (cross-origin restrictions apply)

### Inspector Not Working

**Issue**: "Cannot inspect this page due to cross-origin restrictions"
**Solutions**:
- Use local development server (`http://localhost:...`)
- Avoid external URLs that block iframe access
- Check browser console for CORS errors

### Source Files Not Opening

**Issue**: "Open File" action doesn't work
**Solutions**:
- Ensure workspace folder is open
- Check file path is relative to workspace root
- Verify file exists at expected location
- React DevTools integration requires development build

### Auto-Open Disabled

**Issue**: Preview doesn't open on startup
**Solutions**:
- Check `aider.autoOpenPreview` setting is `true`
- Manually open with "Aider: Open App Preview" command
- Check for VS Code extension activation issues

## Tips & Best Practices

### Visual-First Development

1. **Keep preview visible**: Use split view with preview on left, Aider on right
2. **Enable HMR**: Use development server with hot module replacement
3. **Inspector always on**: Keep inspector enabled while developing
4. **Quick iterations**: Click element → paste to chat → describe changes

### Efficient Workflow

1. **Use keyboard shortcuts**: Assign hotkeys to frequently used commands
2. **Save preview URL**: Set in workspace settings for each project
3. **Multiple previews**: Open different URLs in sidebar vs. panel
4. **File context**: Let preview auto-add files to Aider context

### Integration Tips

1. **Combine with Git**: Use Aider's undo feature to experiment safely
2. **Use with linters**: Let Aider fix linting issues after changes
3. **Template scaffolding**: Click area → ask Aider to generate component
4. **CSS tweaking**: Click element → ask for style adjustments

## Future Enhancements

Planned features for future releases:
- Multi-device preview (responsive design testing)
- Browser DevTools integration
- Network request monitoring
- Performance profiling
- Component tree navigation
- CSS property editing UI
- Screenshot comparison

## Feedback & Support

If you encounter issues or have feature requests:
1. Check existing documentation
2. Review troubleshooting section
3. Open an issue on GitHub
4. Provide extension logs and screenshots

---

**Related Documentation:**
- [README.md](README.md) - General extension guide
- [LIVE_PREVIEW_GUIDE.md](LIVE_PREVIEW_GUIDE.md) - Original preview guide
- [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) - AI provider configuration
