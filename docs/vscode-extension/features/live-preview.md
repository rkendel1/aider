# Live Preview with Component Inspector

View and interact with your running application directly in VS Code with powerful component and CSS inspection capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Using the Inspector](#using-the-inspector)
- [Configuration](#configuration)
- [Workflows](#workflows)
- [Troubleshooting](#troubleshooting)
- [Tips and Best Practices](#tips-and-best-practices)

## Overview

The Live Preview feature allows you to:
- View your web application directly within VS Code
- Click on elements to identify React components and CSS
- Copy component information to clipboard
- Quickly update specific parts of your UI with Aider

### Key Benefits

✅ **No Context Switching**: Stay in VS Code, no browser needed  
✅ **Instant Component Detection**: Click to identify React components  
✅ **CSS Inspection**: Extract classes and inline styles  
✅ **Precise Targeting**: Use inspector data for targeted AI updates  
✅ **Framework Flexible**: Works with React, Vue, Angular, and plain HTML  

## Features

### Live Preview Window

- **Full-Page View**: Your app displays in a dedicated panel
- **Responsive**: Test different viewport sizes
- **Refresh**: Reload to see changes instantly
- **Any URL**: Preview localhost or remote applications

### Component/CSS Inspector

Click any element to inspect:

- **React Component Names**: Automatically detected
- **CSS Classes**: All classes applied to element
- **Inline Styles**: Any inline style attributes
- **Element Type**: HTML tag name
- **XPath**: Precise element location
- **Copy to Clipboard**: All info automatically copied

### Bidirectional Communication

- **Preview → Chat**: Click elements to get info for AI updates
- **Chat → Preview**: Aider can highlight and scroll to elements
- **File Navigation**: Jump from preview to source code (when available)

## Getting Started

### Step 1: Open Live Preview

**Method A: From Sidebar**
1. Click Aider icon in Activity Bar
2. Find "Live Preview" section
3. Click to expand

**Method B: Command Palette**
1. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
2. Type "Aider: Open Live Preview"
3. Press Enter

### Step 2: Load Your App

1. **Start your application**:
   ```bash
   npm run dev
   # or
   python -m http.server 3000
   ```

2. **Enter URL** in preview panel:
   - Local: `http://localhost:3000`
   - Remote: `https://your-app.com`

3. **Click "Load"** to display

Your application now appears in VS Code!

### Step 3: Enable Inspector

1. Click **"Inspector Off"** button to enable
2. Button changes to **"Inspector On"**
3. Hover over elements to see highlighting
4. Click to inspect

## Using the Inspector

### Basic Inspection

1. **Enable inspector mode** (click "Inspector Off" button)
2. **Hover** over elements to highlight them
3. **Click** on an element to inspect it
4. **Inspector data** is automatically copied to clipboard
5. **Notification appears** with "Paste to Chat" option

### Inspector Output Format

When you click an element, the inspector copies:

```
Component: MainContainer
Element: <div>
CSS Classes: container, flex, main-content
Inline Styles: color: red; padding: 10px;
XPath: /html/body/div[1]/div[2]
```

### Using Inspected Data

**Option 1: Paste to Chat (Recommended)**

1. Click element to inspect
2. Click **"Paste to Chat"** in notification
3. Add your instructions
4. Send to Aider

Example:
```
Component: SubmitButton
CSS Classes: btn, btn-primary

Change the button color to green and increase padding to 20px
```

**Option 2: Manual Paste**

1. Inspect element (data copied)
2. Open chat
3. Paste (Ctrl+V / Cmd+V)
4. Add instructions

**Option 3: Command Palette**

1. Inspect element
2. Press `Ctrl+Shift+P`
3. Type "Aider: Paste to Chat"
4. Press Enter

## Configuration

### Settings

Configure in VS Code Settings (Ctrl+,):

```json
{
  // Default preview URL
  "aider.preview.defaultUrl": "http://localhost:3000",
  
  // Enable inspector by default
  "aider.preview.inspectorEnabled": true,
  
  // Auto-open preview on startup
  "aider.preview.autoOpen": true,
  
  // Highlight color for inspector
  "aider.preview.highlightColor": "#ff0000"
}
```

### Keyboard Shortcuts

Add custom shortcuts in `keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+p",
    "command": "aider.openPreview"
  },
  {
    "key": "ctrl+alt+i",
    "command": "aider.toggleInspector"
  }
]
```

## Workflows

### Workflow 1: Update Button Style

1. Load preview with your React app
2. Enable inspector
3. Click on a button
4. Inspector detects: `Component: SubmitButton`
5. Paste to chat and add instruction:
   ```
   Component: SubmitButton
   CSS Classes: btn, btn-primary
   
   Change the button color to green and increase padding
   ```
6. Aider updates the component
7. Preview auto-refreshes to show changes

### Workflow 2: Fix Layout Issues

1. Inspect a layout container
2. Inspector shows: `<div>` with classes `container`, `flex-row`
3. Paste to chat:
   ```
   Element: <div>
   CSS Classes: container, flex-row
   
   Change the flex direction to column on mobile devices
   ```
4. Aider adds responsive CSS
5. Verify in preview

### Workflow 3: Component Refactoring

1. Inspect complex component
2. Get component name and structure
3. Ask Aider to refactor:
   ```
   Component: UserProfile
   
   Split this into smaller components: UserAvatar, UserInfo, UserActions
   ```
4. Aider creates new component files
5. Preview updates automatically

## Troubleshooting

### Preview Not Loading

**Symptoms**: Blank preview or "Cannot load page" error

**Solutions**:
1. Ensure your application is running:
   ```bash
   curl http://localhost:3000
   ```
2. Check the URL is correct
3. Verify the app allows iframe embedding
4. Check for Content Security Policy (CSP) restrictions
5. Try disabling strict CSP in dev environment

### Inspector Not Working

**Symptoms**: Inspector doesn't highlight or copy data

**Solutions**:
1. Ensure inspector mode is **ON** (button shows "Inspector On")
2. For cross-origin pages, run app on `localhost`
3. Check browser console in DevTools for errors
4. Reload the preview
5. Try a different element

### Component Name Not Detected

**Symptoms**: Inspector shows "Unknown" for React components

**Solutions**:

**Option 1: Add Display Name**
```javascript
const MyComponent = () => { ... };
MyComponent.displayName = 'MyComponent';
```

**Option 2: Use Named Functions**
```javascript
function MyComponent() { ... }  // ✓ Good
const MyComponent = () => { ... }  // ✗ Harder to detect
```

**Option 3: Add Data Attribute**
```jsx
<div data-component="MyComponent">
  ...
</div>
```

### Cross-Origin Issues

**Symptoms**: Preview loads but inspector doesn't work

**Explanation**: Browser security prevents inspecting cross-origin iframes.

**Solutions**:
1. Run your app on `localhost` instead of `127.0.0.1`
2. Use the same protocol (http/https) as VS Code
3. Configure CORS headers on your server:
   ```javascript
   res.setHeader('X-Frame-Options', 'SAMEORIGIN');
   ```
4. For development, consider using a proxy

## Tips and Best Practices

### React Component Detection

The inspector uses multiple detection methods:

1. **React DevTools internals**: `__reactFiber$`, `__reactProps$`
2. **Data attributes**: `data-component`, `data-testid`
3. **Function names**: Component display names

**Best practices:**
- Use meaningful component names
- Set `displayName` property
- Add `data-component` for critical components

### Working with Different Frameworks

**Vue.js**
- Inspector detects Vue component information
- Works with Vue DevTools data
- Use `name` property on components

**Angular**
- Extracts element and CSS information
- Component detection via Angular-specific attributes
- Works well with template inspection

**Plain HTML/CSS**
- Always provides element type, classes, and styles
- Use semantic HTML for better inspection
- Add `id` or `class` attributes for targeting

### Performance Tips

1. **Disable inspector** when not actively using it
2. **Reload preview** if it becomes slow
3. **Close preview** when working on backend code
4. **Use localhost** for best performance

### Security Considerations

- Preview runs in a **sandboxed iframe**
- No data sent to external servers
- Inspector processes locally
- Clipboard operations require user interaction
- Use HTTPS for production previews

## Advanced Features

### Auto-Refresh

The preview automatically refreshes when:
- Aider makes code changes
- You save files (with auto-save enabled)
- You manually click the refresh button

### Multiple Previews

Open multiple preview panels for:
- Different viewports (mobile, tablet, desktop)
- Different pages of your app
- Before/after comparisons

**How to:**
1. Open first preview
2. Run "Aider: Open Live Preview" again
3. Enter different URL or same URL

### Source Navigation

When available, click elements to:
- Jump to component source file
- Open in editor at exact line
- See related files

## Known Limitations

1. **Cross-Origin**: Cannot inspect pages from different origins
2. **CSP Restrictions**: Some apps with strict CSP may not load
3. **React Internals**: Detection relies on React internals (may change)
4. **JavaScript Required**: Inspector needs JS enabled
5. **Some Frameworks**: Limited support for less common frameworks

## Future Enhancements

Planned improvements:
- Support for Vue DevTools and Angular Inspector
- Multiple preview windows with sync
- Screenshot capture with annotations
- Integration with browser DevTools
- Component tree visualization
- CSS editing directly in preview
- Network request monitoring

## Keyboard Shortcuts Reference

| Action | Shortcut |
|--------|----------|
| Open Preview | `Ctrl+Shift+P` → "Aider: Open Live Preview" |
| Toggle Inspector | Click inspector button |
| Paste to Chat | `Ctrl+Shift+P` → "Aider: Paste to Chat" |
| Set URL | `Ctrl+Shift+P` → "Aider: Set Preview URL" |
| Refresh Preview | Click refresh button |

## Privacy and Security

- ✅ Runs in sandboxed environment
- ✅ No external data transmission
- ✅ Local processing only
- ✅ User-initiated clipboard access
- ✅ No tracking or analytics

## Related Documentation

- **[Chat Interface](../usage/chat-interface.md)** - Using inspector with chat
- **[Workflows](../usage/workflows.md)** - Common usage patterns
- **[Vision Models](vision-models.md)** - Screenshot-to-code generation

---

**Quick Start:** Open preview → Enable inspector → Click elements → Paste to chat → Update with Aider! 🚀

*Need help? Check [Troubleshooting](#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).*
