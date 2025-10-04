# AI Provider UI Overview

Visual guide to the new multi-provider interface in the Aider VS Code extension.

## Chat Interface

### Provider Selector Dropdown

Located at the top of the chat panel:

```
┌─────────────────────────────────────────────────┐
│  AI Provider: [Default        ▼]                │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Messages                                   │ │
│  │                                            │ │
│  │ ┌────────────────────────────────────────┐ │ │
│  │ │ You:                                   │ │ │
│  │ │ Add comments to this function          │ │ │
│  │ └────────────────────────────────────────┘ │ │
│  │                                            │ │
│  │ ┌────────────────────────────────────────┐ │ │
│  │ │ assistant (ollama)                     │ │ │
│  │ │ Here are the comments...               │ │ │
│  │ └────────────────────────────────────────┘ │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌──────────────────────────────┬────────────┐  │
│  │ Ask Aider to modify...       │  Send      │  │
│  └──────────────────────────────┴────────────┘  │
└─────────────────────────────────────────────────┘
```

### Dropdown Options

When clicked, the dropdown expands:

```
┌─────────────────────────────────────────────────┐
│  AI Provider: [Default        ▼]                │
│                ┌──────────────────────────────┐  │
│                │ Default                      │  │
│                │ Ollama                       │  │
│                │ GitHub Copilot               │  │
│                └──────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Messages                                   │ │
│  ...
```

### Provider Badges on Messages

Messages display which provider was used:

```
┌────────────────────────────────────────────────────┐
│ you                                                │
│ Create a simple Express route                     │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ assistant (ollama)                                 │
│ Here's a basic Express route:                      │
│                                                    │
│ ```javascript                                      │
│ app.get('/api/data', (req, res) => {              │
│   res.json({ message: 'Hello' });                 │
│ });                                                │
│ ```                                                │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ you                                                │
│ Refactor this to use async/await                  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ assistant (copilot)                                │
│ I'll refactor it with proper error handling:       │
│                                                    │
│ ```javascript                                      │
│ app.get('/api/data', async (req, res) => {        │
│   try {                                            │
│     const data = await fetchData();               │
│     res.json(data);                                │
│   } catch (error) {                                │
│     res.status(500).json({ error: error.message });│
│   }                                                │
│ });                                                │
│ ```                                                │
└────────────────────────────────────────────────────┘
```

## Settings UI

### Provider Configuration Panel

Settings can be accessed via `File > Preferences > Settings` and searching for "aider":

```
Settings
┌────────────────────────────────────────────────────┐
│ Search settings: aider                             │
└────────────────────────────────────────────────────┘

Aider Configuration
├── General
│   ├── Api Endpoint: [http://localhost:8501      ]
│   ├── Model Name: [                            ]
│   ├── ☑ Auto Commit
│   └── ☑ Show Diffs
│
└── AI Provider
    ├── Default Provider: [default        ▼]
    │   Options: default, ollama, copilot
    │
    ├── ☐ Auto Select
    │   Automatically choose provider based on query
    │
    ├── Ollama
    │   ├── ☑ Enabled
    │   ├── Endpoint: [http://localhost:11434     ]
    │   └── Model: [llama2                        ]
    │
    └── GitHub Copilot
        └── ☑ Enabled
```

### Settings JSON View

Or edit directly in settings.json:

```json
{
  // Aider API
  "aider.apiEndpoint": "http://localhost:8501",
  "aider.modelName": "claude-3-7-sonnet-20250219",
  "aider.autoCommit": true,
  "aider.showDiffs": true,

  // AI Provider Configuration
  "aider.aiProvider.default": "default",
  "aider.aiProvider.autoSelect": false,
  
  // Ollama Settings
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434",
  "aider.aiProvider.ollama.model": "codellama",
  
  // Copilot Settings
  "aider.aiProvider.copilot.enabled": true
}
```

## Visual Design Elements

### Color Coding (Based on VS Code Theme)

**Provider Dropdown:**
- Background: `--vscode-sideBar-background`
- Border: `--vscode-input-border`
- Text: `--vscode-foreground`

**Message Bubbles:**
- User messages: `--vscode-input-background` with blue border
- Assistant messages: `--vscode-editor-inactiveSelectionBackground` with teal border
- System messages: `--vscode-inputValidation-infoBackground` with info border

**Provider Badges:**
- Text color: `--vscode-descriptionForeground`
- Font size: 0.8em (smaller than role)
- Style: Subtle, non-intrusive

### Interactive Elements

**Dropdown Behavior:**
1. Click dropdown → Expands to show options
2. Hover over option → Highlights
3. Click option → Updates selection
4. Dropdown closes automatically
5. Selection saved for current session

**Auto-Select Indicator:**
When auto-select is enabled, a subtle indicator appears:

```
┌─────────────────────────────────────────────────┐
│  AI Provider: [Auto (ollama)  ▼] 🔄            │
│                                                  │
```

The 🔄 icon indicates auto-selection is active.

## Command Palette Integration

Provider-related commands accessible via `Ctrl+Shift+P`:

```
> aider

┌────────────────────────────────────────────────────┐
│ Aider: Start Chat                                 │
│ Aider: Send Message                               │
│ Aider: Add File to Chat                          │
│ Aider: Clear Chat History                        │
│ Aider: Set AI Provider                    ← NEW  │
│ Aider GitHub: Authenticate                       │
│ ...                                               │
└────────────────────────────────────────────────────┘
```

## Status Bar Integration (Future Enhancement)

Potential future addition showing active provider:

```
┌────────────────────────────────────────────────────┐
│ VSCode Status Bar                                  │
│ [...]  Ln 42, Col 8  UTF-8  JavaScript  Aider: ◉ Ollama │
└────────────────────────────────────────────────────┘
```

## Notifications

### Provider Switch Notification

When provider changes:

```
┌────────────────────────────────────────────────────┐
│ ℹ AI Provider switched to: Ollama                  │
│                                          [Dismiss] │
└────────────────────────────────────────────────────┘
```

### Provider Unavailable Warning

If selected provider is not available:

```
┌────────────────────────────────────────────────────┐
│ ⚠ Ollama is not available. Using Default provider │
│ Check that Ollama is running.      [Fix] [Dismiss]│
└────────────────────────────────────────────────────┘
```

## Accessibility Features

### Keyboard Navigation

- `Tab` to focus dropdown
- `Enter` to open dropdown
- `Arrow Up/Down` to navigate options
- `Enter` to select option
- `Escape` to close dropdown

### Screen Reader Support

All UI elements include proper ARIA labels:

```html
<select 
  id="provider-select" 
  aria-label="Select AI Provider"
  aria-describedby="provider-help"
>
  <option value="default">Default</option>
  <option value="ollama">Ollama - Fast local AI</option>
  <option value="copilot">GitHub Copilot - Advanced AI</option>
</select>
```

## Responsive Design

The UI adapts to different panel widths:

### Wide Panel (> 400px)
```
┌─────────────────────────────────────────────────┐
│  AI Provider: [Default                     ▼]   │
│                                                  │
│  [Messages display full width]                  │
└─────────────────────────────────────────────────┘
```

### Narrow Panel (< 400px)
```
┌────────────────────────────┐
│ AI Provider:               │
│ [Default            ▼]     │
│                            │
│ [Messages stack nicely]    │
└────────────────────────────┘
```

## Animation & Transitions

### Smooth Transitions

- Dropdown open/close: 150ms ease
- Provider badge fade-in: 200ms
- Message appearance: 300ms slide-in

### Loading States

When waiting for response:

```
┌────────────────────────────────────────────────────┐
│ assistant (ollama)                                 │
│ ⋯ Generating response...                          │
└────────────────────────────────────────────────────┘
```

## Dark Mode Support

All UI elements respect VS Code's theme:

**Light Theme:**
- Clean, crisp borders
- Subtle shadows
- High contrast text

**Dark Theme:**
- Softer borders
- Reduced brightness
- Comfortable for eyes

**High Contrast:**
- Maximum contrast
- Clear focus indicators
- Accessibility optimized

## User Flow Examples

### Flow 1: Manual Provider Selection

1. User opens Aider chat
2. Clicks provider dropdown
3. Selects "Ollama"
4. Types message
5. Sends
6. Receives response with "(ollama)" badge

### Flow 2: Auto-Select Mode

1. User enables auto-select in settings
2. Opens Aider chat
3. Dropdown shows "Auto (default)"
4. Types simple message: "Add a comment"
5. Auto-switches to Ollama
6. Types complex message: "Refactor architecture"
7. Auto-switches to Copilot
8. No manual intervention needed

### Flow 3: Provider Configuration

1. User opens Settings (Ctrl+,)
2. Searches "aider ollama"
3. Checks "Enabled"
4. Sets model to "codellama"
5. Reloads window (if needed)
6. Ollama appears in dropdown

## Browser Compatibility

The UI works in:
- VS Code Desktop (all platforms)
- VS Code Web (browser-based)
- GitHub Codespaces
- VS Code Server

All modern browsers supported:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Considerations

- Dropdown renders instantly
- No lag when switching providers
- Message rendering optimized
- Smooth scrolling maintained
- Minimal memory footprint

## Future UI Enhancements

Potential improvements:
1. Provider performance indicators
2. Cost tracking display
3. Provider-specific icons
4. Usage statistics
5. Custom provider colors
6. Provider quick-switch shortcuts
7. Provider recommendations
8. Interactive provider comparison

---

For implementation details, see [AI_PROVIDER_IMPLEMENTATION.md](AI_PROVIDER_IMPLEMENTATION.md)
For usage guide, see [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md)
