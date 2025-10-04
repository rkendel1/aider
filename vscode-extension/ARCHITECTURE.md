# Visual-First Workflow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VS Code Window                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────┐  ┌────────────────────────────┐│
│  │                                │  │                            ││
│  │    Full-Page Preview Panel     │  │    Aider Sidebar           ││
│  │    (AiderPreviewPanel)         │  │                            ││
│  │                                │  │  ┌──────────────────────┐  ││
│  │  ┌──────────────────────────┐  │  │  │   Chat View          │  ││
│  │  │  URL Input | Load | Ref  │  │  │  │  (AiderChatProvider) │  ││
│  │  │  Inspector Toggle        │  │  │  │                      │  ││
│  │  └──────────────────────────┘  │  │  │  Provider: [v]       │  ││
│  │                                │  │  │  Input: ____________  │  ││
│  │  ┌──────────────────────────┐  │  │  │  [Send]              │  ││
│  │  │                          │  │  │  │                      │  ││
│  │  │   App Preview (iframe)   │  │  │  │  Messages:           │  ││
│  │  │                          │  │  │  │  • User message      │  ││
│  │  │   http://localhost:3000  │  │  │  │  • AI response       │  ││
│  │  │                          │  │  │  └──────────────────────┘  ││
│  │  │   [Interactive App]      │  │  │                            ││
│  │  │                          │  │  │  ┌──────────────────────┐  ││
│  │  │   • Click elements       │  │  │  │   Files View         │  ││
│  │  │   • Navigate routes      │  │  │  │  (AiderFilesProvider)│  ││
│  │  │   • View components      │  │  │  │                      │  ││
│  │  │                          │  │  │  │  □ src/App.tsx       │  ││
│  │  └──────────────────────────┘  │  │  │  □ src/Button.tsx    │  ││
│  │                                │  │  │                      │  ││
│  │  [Status: Route /dashboard]   │  │  │  └──────────────────────┘  ││
│  │                                │  │  │                            ││
│  └────────────────────────────────┘  │  │  ┌──────────────────────┐│
│                                      │  │  │   Preview (sidebar)  ││
│  ┌────────────────────────────────┐  │  │  │  (AiderPreviewProv.) ││
│  │   Code Editor (Column 2)       │  │  │  │                      ││
│  │                                │  │  │  │  [Compact view]      ││
│  │   Button.tsx                   │  │  │  └──────────────────────┘│
│  │   ┌────────────────────────┐   │  │  │                            │
│  │   │ export function Button │   │  │  └────────────────────────────┘
│  │   │   ({ label }) {        │   │  │
│  │   │   return <button>...   │   │  │
│  │   │ }                      │   │  │
│  │   └────────────────────────┘   │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

## Communication Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    Message Flow Diagram                            │
└────────────────────────────────────────────────────────────────────┘

Preview Panel (Webview)          Extension Host          Aider Backend
─────────────────────            ──────────────          ─────────────

User clicks element
  │
  ├─[inspectorData]──────────────>│
  │                                │
  │                                │ handleInspectorData()
  │                                │   ├─ Format data
  │                                │   ├─ Copy to clipboard
  │                                │   └─ Show notification
  │                                │
  │<──[action: Paste to Chat]──────┤
  │                                │
  │                                │ chatProvider.pasteToInput()
  │                                │   └─[pasteText]─────────>│
  │                                │                          │
  │                                │                      Chat View
  │                                │                      shows data
  │
User clicks "Open File"           │
  │                                │
  ├─[openFile]───────────────────>│
  │                                │
  │                                │ handleOpenFile()
  │                                │   ├─ Open document
  │                                │   ├─ Jump to line
  │                                │   └─ Offer to add to chat
  │                                │
  │                                │ aiderClient.addFile()
  │                                │────────────────────────>│
  │                                │                          │
  │                                │                    Backend adds
  │                                │                    file to context
  │

Route changes                     │
  │                                │
  ├─[routeChange]─────────────────>│
  │                                │
  │                                │ handleRouteChange()
  │                                │   └─ Show notification
  │                                │
  │                                │

Aider wants to highlight element  │
  │                                │
  │<──[highlightElement + XPath]───┤
  │                                │
  │ Find element by XPath          │
  │ Add .highlight class           │
  │ Remove after 3s                │
  │                                │

Aider wants to scroll to element  │
  │                                │
  │<──[scrollToElement + XPath]────┤
  │                                │
  │ Find element                   │
  │ scrollIntoView()               │
  │ Highlight briefly              │
  │                                │
```

## Data Structures

### InspectorData Interface
```typescript
{
  elementType: string;          // "button", "div", etc.
  cssClasses: string[];         // ["btn", "primary"]
  inlineStyles: string;         // "color: red; padding: 10px"
  xpath: string;                // "//*[@id='btn-1']"
  componentName: string | null; // "ButtonComponent"
  filePath?: string | null;     // "src/components/Button.tsx"
  line?: number | null;         // 42
}
```

### Message Types (Preview → Extension)
```typescript
type PreviewMessage = 
  | { type: 'inspectorData', data: InspectorData }
  | { type: 'setPreviewUrl', url: string }
  | { type: 'routeChange', route: string }
  | { type: 'openFile', filePath: string, line?: number }
  | { type: 'error', message: string }
```

### Message Types (Extension → Preview)
```typescript
type ExtensionMessage = 
  | { type: 'setUrl', url: string }
  | { type: 'refresh' }
  | { type: 'highlightElement', xpath: string }
  | { type: 'scrollToElement', xpath: string }
```

## Component Interaction

```
User Interaction Flow:

1. INSPECT ELEMENT
   User clicks element in preview
      ↓
   Extract element data (component, CSS, XPath)
      ↓
   Send to extension host
      ↓
   Copy to clipboard + show notification
      ↓
   User chooses "Paste to Chat" or "Open File"
      ↓
   Data inserted into Aider chat OR file opened

2. AI MAKES CHANGES
   User sends message to Aider
      ↓
   Aider analyzes request
      ↓
   Aider modifies source files
      ↓
   Dev server detects changes (HMR)
      ↓
   Preview auto-refreshes with new code

3. AI HIGHLIGHTS ELEMENT
   Aider wants to show user an element
      ↓
   Extension calls panel.highlightElement(xpath)
      ↓
   Preview finds element by XPath
      ↓
   Adds highlight outline for 3 seconds

4. USER NAVIGATES
   User clicks link in preview
      ↓
   Route changes (detected by monitoring)
      ↓
   Preview sends routeChange message
      ↓
   Extension shows notification
      ↓
   User can focus on route-specific components
```

## File Structure

```
vscode-extension/
├── src/
│   ├── extension.ts              # Main activation, commands, handlers
│   ├── previewPanel.ts           # Full-page preview panel (NEW)
│   ├── previewProvider.ts        # Sidebar preview (existing)
│   ├── chatProvider.ts           # Chat interface
│   ├── filesProvider.ts          # Files list
│   ├── aiderClient.ts            # Backend API client
│   ├── githubClient.ts           # GitHub CLI integration
│   └── providerManager.ts        # AI provider management
│
├── VISUAL_WORKFLOW_GUIDE.md      # Detailed feature guide (NEW)
├── QUICK_REFERENCE_VISUAL.md     # Quick start cheat sheet (NEW)
├── README.md                      # Main documentation (updated)
├── CHANGELOG.md                   # Version history (updated)
└── package.json                   # Commands & config (updated)
```

## Technology Stack

```
┌─────────────────────────────────────────────────┐
│              Technology Layers                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  VS Code Extension API                          │
│  ├── WebviewPanel API (preview panel)          │
│  ├── WebviewViewProvider API (sidebar)         │
│  ├── Commands API                               │
│  ├── Window API                                 │
│  └── Workspace API                              │
│                                                 │
│  TypeScript                                     │
│  ├── Strict type checking                      │
│  ├── Interface definitions                     │
│  └── Event-driven architecture                 │
│                                                 │
│  Webview (Browser-based)                       │
│  ├── HTML5                                      │
│  ├── CSS3 (VS Code theming)                    │
│  ├── JavaScript (ES6+)                          │
│  ├── postMessage API                            │
│  └── iframe embedding                           │
│                                                 │
│  React DevTools Integration                     │
│  ├── Fiber internals access                    │
│  ├── Component tree traversal                  │
│  └── Source location detection                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Security Model

```
┌──────────────────────────────────────────────────┐
│          Content Security Policy (CSP)           │
├──────────────────────────────────────────────────┤
│                                                  │
│  default-src 'none'                              │
│    ↓ Block all by default                       │
│                                                  │
│  frame-src *                                     │
│    ↓ Allow iframe from any source               │
│                                                  │
│  script-src 'nonce-{random}'                     │
│    ↓ Allow only scripts with nonce              │
│                                                  │
│  style-src vscode-resource: 'unsafe-inline'      │
│    ↓ Allow VS Code resources + inline styles    │
│                                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│            Iframe Sandbox Permissions            │
├──────────────────────────────────────────────────┤
│                                                  │
│  allow-same-origin                               │
│    ↓ Access parent origin (for inspector)       │
│                                                  │
│  allow-scripts                                   │
│    ↓ Run JavaScript (required for apps)         │
│                                                  │
│  allow-forms                                     │
│    ↓ Submit forms in preview                    │
│                                                  │
│  allow-popups                                    │
│    ↓ Allow dialogs and new windows              │
│                                                  │
│  allow-modals                                    │
│    ↓ Allow alert/confirm dialogs                │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Performance Considerations

1. **Singleton Pattern**: Only one preview panel instance
2. **Retained Context**: Panel stays in memory when hidden
3. **Event Delegation**: Single click handler for all elements
4. **Throttled Route Detection**: Check URL every 1 second
5. **Lazy Inspector Setup**: Only attach listeners when enabled
6. **Efficient XPath**: Prefer ID-based over indexed paths
7. **Timed Highlights**: Auto-remove after timeout
8. **Message Batching**: Group related updates

## Future Architecture Enhancements

1. **Multi-Panel Support**: Multiple preview panels
2. **WebSocket Integration**: Real-time backend connection
3. **Service Worker**: Offline preview capabilities
4. **IndexedDB**: Cache preview states
5. **Web Components**: Modular inspector UI
6. **DevTools Protocol**: Direct browser integration
7. **Source Maps**: Better file location mapping
8. **Hot Reload Server**: Built-in dev server
