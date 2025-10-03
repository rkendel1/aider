# Testing the Live Preview Feature

This guide will help you test the live preview and component inspector feature locally.

## Quick Start

### Option 1: Simple HTTP Server

1. Navigate to the examples directory:
   ```bash
   cd vscode-extension/examples
   ```

2. Start a simple HTTP server:
   
   **Using Python:**
   ```bash
   python3 -m http.server 3000
   ```
   
   **Using Node.js:**
   ```bash
   npx http-server -p 3000
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:3000
   ```

3. Open VS Code and load the Aider extension

4. In the Live Preview panel, enter: `http://localhost:3000/preview-test.html`

5. Click "Load" and then enable the inspector

### Option 2: Using Your Own React App

1. Start your React development server:
   ```bash
   npm start  # Usually runs on http://localhost:3000
   ```

2. In the Live Preview panel, enter your app's URL

3. Enable the inspector and start clicking elements

## Testing Checklist

- [ ] Preview loads the HTML file successfully
- [ ] Inspector toggle button works (Off → On → Off)
- [ ] Hovering over elements highlights them
- [ ] Clicking on elements shows a notification
- [ ] Component/CSS info is copied to clipboard
- [ ] "Paste to Chat" button pastes into chat input
- [ ] Component names are detected correctly
- [ ] CSS classes are extracted
- [ ] Inline styles are captured
- [ ] XPath is generated
- [ ] Error handling works for invalid URLs
- [ ] Cross-origin error message displays appropriately

## Expected Results

When you click on the "Submit" button in the test page, you should see:

```
Component: SubmitButton
Element: <button>
CSS Classes: button, primary-button
Inline Styles: 
XPath: /html/body/div[1]/div[3]/button[1]
```

## Troubleshooting

### Preview doesn't load
- Make sure the HTTP server is running
- Check that the URL is correct (including protocol: `http://`)
- Try opening the URL in a regular browser first

### Inspector doesn't work
- Enable the inspector by clicking the toggle button
- For cross-origin issues, use `localhost` instead of `127.0.0.1`
- Some sites block iframe embedding - use local development servers

### Component names not detected
- The test page uses `data-component` attributes
- Real React apps: inspector looks for React internal properties
- Ensure components have meaningful names or displayName set

## Manual Testing Script

1. **Load test page**: Enter URL and click Load
2. **Enable inspector**: Click "Inspector Off" button
3. **Hover test**: Move mouse over different elements
4. **Click header**: Should detect "PageHeader" component
5. **Click button**: Should detect "SubmitButton" component
6. **Click card**: Should detect "InfoCard" component
7. **Verify clipboard**: Paste clipboard content to verify
8. **Paste to chat**: Click notification button, verify chat input
9. **Disable inspector**: Toggle inspector off, clicks should work normally
10. **Reload**: Load a different URL, verify it updates

## Automated Testing

Run the test suite:
```bash
cd vscode-extension
npm test
```

This runs the unit tests in `src/test/suite/previewProvider.test.ts`.

## Known Limitations in Test Environment

- VS Code extension tests run in a headless environment
- Full webview interaction requires manual testing
- Some browser features may not work in test mode
- Cross-origin restrictions apply even in testing

## Screenshots

After testing, take screenshots showing:
1. Live preview panel with test page loaded
2. Inspector enabled (button showing "Inspector On")
3. Element highlighted on hover
4. Notification showing component info
5. Chat input with pasted inspector data

Save screenshots to verify the UI looks correct and works as expected.
