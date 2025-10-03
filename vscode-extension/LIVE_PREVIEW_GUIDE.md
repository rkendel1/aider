# Live Preview with Component Inspector

The Aider VS Code extension now includes a powerful live preview feature that allows you to interact with your running application and identify React components or CSS information with a simple click.

## Features

### 1. Live Preview
- View your application directly within VS Code
- No need to switch between browser and editor
- Supports any web application running on localhost or accessible URL

### 2. Component/CSS Inspector
- Click on any element in the preview to inspect it
- Automatically detects React component names
- Extracts CSS classes and inline styles
- Generates XPath for precise element location

### 3. Clipboard Integration
- Inspector data is automatically copied to clipboard
- One-click paste into chat for targeted updates
- Formatted for easy reading and editing

## Usage

### Setting Up Live Preview

1. **Open the Aider sidebar** in VS Code
2. **Navigate to the "Live Preview" view**
3. **Enter your application URL** (e.g., `http://localhost:3000`)
4. **Click "Load"** to display your application

### Using the Inspector

1. **Click the "Inspector Off" button** to enable inspector mode
   - The button will change to "Inspector On"
2. **Hover over elements** in the preview to see them highlighted
3. **Click on an element** to inspect it
   - Component/CSS information is copied to clipboard
   - A notification appears with options

### Pasting to Chat

When you click on an element with the inspector enabled:

1. **Component/CSS info is automatically copied**
2. **Click "Paste to Chat"** in the notification to insert the information into the chat input
3. **Add your instructions** and send to Aider

Example inspector output:
```
Component: MainContainer
Element: <div>
CSS Classes: container, flex, main-content
Inline Styles: color: red; padding: 10px;
XPath: /html/body/div[1]/div[2]
```

### Alternative: Manual Paste

You can also use the command palette:
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Aider: Paste to Chat"
- This pastes clipboard content directly into chat

## Configuration

Configure the live preview in VS Code settings:

- **Aider: Preview URL** - Default URL for live preview (default: `http://localhost:3000`)
- **Aider: Enable Inspector** - Enable/disable the component inspector (default: true)

## Tips

### React Component Detection

The inspector uses multiple methods to detect React components:
1. React DevTools internal properties (`__reactFiber$`, `__reactProps$`)
2. Common data attributes (`data-component`, `data-testid`, `data-react-component`)
3. Display name or function name

For best results, ensure your React components have:
- Meaningful component names
- `displayName` property set
- Or use `data-component` attributes

### Cross-Origin Restrictions

Due to browser security, the inspector cannot access pages from different origins. If you encounter issues:
- Use a local development server on `localhost`
- Ensure your application allows iframe embedding
- Check that CORS headers are properly configured

### Working with Different Frameworks

While optimized for React, the inspector works with any web framework:
- **Vue.js**: Detects component information from Vue DevTools
- **Angular**: Extracts element and CSS information
- **Plain HTML/CSS**: Still provides element type, classes, and styles

## Troubleshooting

### Preview Not Loading
- Ensure your application is running
- Check that the URL is correct
- Verify the application allows iframe embedding
- Try disabling strict Content Security Policy (CSP)

### Inspector Not Working
- Enable inspector mode by clicking "Inspector Off"
- For cross-origin pages, run your app on `localhost`
- Check browser console for errors

### Component Name Not Detected
- Add `data-component` attribute to your elements
- Set `displayName` on React components
- Use named function components instead of arrow functions

## Examples

### Example 1: Updating a Button Component

1. Load preview with your React app
2. Enable inspector
3. Click on a button element
4. Inspector detects: `Component: SubmitButton`
5. Paste to chat and add instruction:
   ```
   Component: SubmitButton
   CSS Classes: btn, btn-primary
   
   Change the button color to green and increase padding
   ```

### Example 2: Fixing Layout Issues

1. Inspect a layout container
2. Inspector shows: `<div>` with classes `container`, `flex-row`
3. Paste to chat:
   ```
   Element: <div>
   CSS Classes: container, flex-row
   
   Change the flex direction to column on mobile devices
   ```

## Keyboard Shortcuts

- **Toggle Inspector**: Click the inspector button or use the mouse
- **Paste to Chat**: `Ctrl+Shift+P` → "Aider: Paste to Chat"
- **Set Preview URL**: `Ctrl+Shift+P` → "Aider: Set Preview URL"

## Privacy and Security

- The preview runs in a sandboxed iframe
- No data is sent to external servers
- Inspector data is processed locally
- Clipboard operations require user interaction

## Known Limitations

1. Cannot inspect cross-origin pages due to browser security
2. Some applications with strict CSP may not load in iframe
3. Component detection relies on React internals (may change with React versions)
4. Inspector requires JavaScript to be enabled

## Future Enhancements

Planned improvements:
- Support for more frameworks (Vue DevTools, Angular Inspector)
- Multiple preview windows
- Screenshot capture with annotations
- Integration with browser DevTools
- Component tree visualization
