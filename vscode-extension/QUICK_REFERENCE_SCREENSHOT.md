# Quick Reference: Screenshot-to-Code & Project Context

## Screenshot-to-Code

### Upload Screenshot
```
Method 1: Drag & Drop
1. Open Aider chat panel
2. Drag image to screenshot area
3. Click "Generate Code"

Method 2: Paste (Fastest)
1. Copy screenshot (Snipping Tool, etc.)
2. Focus Aider chat panel
3. Press Ctrl+V (Cmd+V)
4. Click "Generate Code"

Method 3: Command Palette
1. Ctrl+Shift+P → "Aider: Upload Screenshot"
2. Select image file
3. Code generates automatically
```

### Settings
```json
{
  "aider.screenshot.enabled": true,
  "aider.screenshot.defaultProvider": "copilot"
}
```

## Project Context

### Quick Setup
```
1. Ctrl+Shift+P → "Aider: View Project Context"
2. Set framework (e.g., "Next.js 14")
3. Add rules (e.g., "Use TypeScript")
4. Add design principles (e.g., "Mobile-first")
5. Context auto-saves
```

### What to Add

**Rules** (Do's and Don'ts)
- "Use TypeScript for all components"
- "No inline styles"
- "Follow SOLID principles"

**Design Principles** (Guidelines)
- "Mobile-first responsive design"
- "WCAG 2.1 AA accessibility"
- "Minimalist UI"

**Goals** (Objectives)
- "Build MVP by Q2"
- "90+ Lighthouse score"
- "Support offline mode"

**Patterns** (How-to's)
- "API Calls": "Use custom hooks"
- "Error Handling": "Use ErrorBoundary"
- "State": "Use Zustand"

### Storage
```
Location: .aider/project-context.json
Auto-created: Yes
Auto-saved: Yes
Team sharing: Optional (commit to git)
```

## Common Workflows

### 1. New Project Setup
```
1. Open project in VS Code
2. Ctrl+Shift+P → "Aider: View Project Context"
3. Configure:
   - Framework: "Next.js 14"
   - Rule: "Use TypeScript"
   - Rule: "Use Tailwind CSS"
   - Principle: "Mobile-first"
   - Goal: "Build MVP"
4. Start generating code!
```

### 2. Generate from Screenshot
```
1. Find UI design (Figma, website, mockup)
2. Take screenshot
3. Open Aider chat
4. Paste screenshot (Ctrl+V)
5. Click "Generate Code"
6. Review generated file
7. Refine with chat if needed
```

### 3. Context-Aware Development
```
1. Add project rules once
2. All AI code generation follows rules
3. Get warnings for violations
4. Consistent code style automatically
5. Less manual review needed
```

## Commands

| Shortcut | Command |
|----------|---------|
| Ctrl+Shift+P → "Aider: Upload Screenshot" | Open file picker |
| Ctrl+V in chat | Paste screenshot |
| Ctrl+Shift+P → "Aider: View Project Context" | Open context panel |
| Ctrl+Shift+P → "Aider: Edit Project Context" | Edit context |

## Tips

### Screenshot Quality
✅ High resolution (1920x1080+)
✅ Complete components
✅ Clear, unobstructed
❌ Partial views
❌ Low resolution
❌ Cluttered

### Project Context
✅ Specific rules ("Use X")
✅ Measurable goals
✅ Clear patterns
❌ Vague guidelines
❌ Too many rules (start small)

### AI Provider
- **Ollama**: Fast, local, simple components
- **Copilot**: Complex components, better context
- **Default**: General-purpose

## Troubleshooting

### Screenshot not generating code
1. Check provider is enabled
2. Verify file format (PNG, JPG, etc.)
3. Try different AI provider
4. Check file size (<10MB)

### Context not loading
1. Check `.aider/project-context.json` exists
2. Verify valid JSON format
3. Check `aider.projectContext.enabled = true`
4. Reload VS Code window

### Code doesn't follow rules
1. Make rules more specific
2. Add examples in coding patterns
3. Review rule wording
4. Use simpler language

## Best Practices

1. **Start Small**: Add 3-5 core rules first
2. **Be Specific**: "Use TypeScript" not "Good types"
3. **Review Context**: Update monthly
4. **Share with Team**: Commit context file
5. **Iterate**: Refine rules based on results
6. **Use Examples**: Add patterns for complex rules
7. **Document Why**: Add context in design principles

## Learn More

- [Full Guide](SCREENSHOT_CONTEXT_GUIDE.md)
- [Visual Workflow](VISUAL_WORKFLOW_GUIDE.md)
- [AI Providers](AI_PROVIDER_GUIDE.md)
