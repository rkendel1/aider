# Screenshot-to-Code and Project Context Features

## Overview

The Aider VS Code extension has been enhanced with visual-first, project-aware capabilities that enable developers to:

1. **Generate code from screenshots** using AI
2. **Store and manage project-specific context** (rules, design principles, goals, patterns)
3. **Get context-aware AI suggestions** that align with project standards

## Features

### 1. Screenshot-to-Code Generation

Transform UI screenshots into production-ready code automatically.

#### How to Use

**Method 1: Drag and Drop**
1. Open the Aider chat panel
2. Drag an image file into the screenshot drop area
3. Click "Generate Code"
4. The AI will analyze the screenshot and generate corresponding React/Next.js code
5. The generated file will be automatically created and opened in VS Code

**Method 2: Paste from Clipboard**
1. Copy a screenshot to your clipboard (e.g., using Snipping Tool, macOS screenshot, etc.)
2. Focus on the Aider chat panel
3. Press Ctrl+V (Cmd+V on Mac) to paste
4. Click "Generate Code"

**Method 3: File Browser**
1. Run command: "Aider: Upload Screenshot for Code Generation"
2. Select an image file from your file system
3. The code will be generated automatically

#### Features

- **AI Provider Selection**: Choose between Default, Ollama, or GitHub Copilot for screenshot analysis
- **Project Context Integration**: Generated code follows your project's rules and design principles
- **Automatic File Creation**: Generated code is saved to `src/components/` directory
- **Auto-Open**: Generated file opens automatically in the editor
- **Rule Validation**: Warns if generated code violates project rules

#### Configuration

```json
{
  "aider.screenshot.enabled": true,
  "aider.screenshot.defaultProvider": "copilot"
}
```

### 2. Project-Level Context Storage

Store and manage project-specific rules, design principles, goals, and coding patterns.

#### Accessing Project Context

1. **View Context Panel**: Run "Aider: View Project Context" from the command palette
2. The Project Context panel appears in the Aider sidebar
3. **Edit Context**: Run "Aider: Edit Project Context" or click items in the panel

#### What You Can Store

**Framework**
- Specify the primary framework (e.g., React, Next.js, Vue.js)
- Updates are saved automatically

**Project Rules**
- Define coding rules and constraints
- Example: "No inline styles", "Use TypeScript", "Follow Material Design"
- AI will validate generated code against these rules

**Design Principles**
- Define design guidelines
- Example: "Mobile-first approach", "Accessibility is priority", "Minimalist UI"
- AI incorporates these in code generation

**Project Goals**
- Track project objectives
- Example: "Build MVP by Q2", "Optimize for performance", "Support offline mode"

**Coding Patterns**
- Define reusable patterns and templates
- Example: "API calls use custom hooks", "Error handling uses ErrorBoundary"
- AI follows these patterns in generated code

#### Storage

- Context is stored in `.aider/project-context.json` in your workspace root
- File is created automatically on first use
- Can be committed to version control to share with team
- Updates are persisted automatically

#### Configuration

```json
{
  "aider.projectContext.enabled": true,
  "aider.projectContext.autoUpdate": true
}
```

### 3. Context-Aware Suggestions

AI suggestions automatically incorporate your project context.

#### How It Works

1. When you request code generation (from screenshot or chat), the AI receives:
   - Your prompt/screenshot
   - All project rules
   - All design principles
   - All project goals
   - All coding patterns

2. The AI generates code that:
   - Follows your project rules
   - Aligns with design principles
   - Uses your coding patterns
   - Considers project goals

3. If generated code violates rules, you receive a warning with details

#### Example Workflow

1. Add rule: "Use Tailwind CSS for all styling"
2. Add design principle: "Dark mode support required"
3. Upload screenshot of a light-mode UI
4. AI generates code with:
   - Tailwind CSS classes
   - Dark mode support via Tailwind's dark: variants
   - No inline styles (follows rule)

## Commands

| Command | Description |
|---------|-------------|
| `Aider: Upload Screenshot for Code Generation` | Open file picker to select screenshot |
| `Aider: Paste Screenshot from Clipboard` | Paste screenshot from clipboard |
| `Aider: View Project Context` | Open project context panel |
| `Aider: Edit Project Context` | Edit project context |

## Workflow Example

### Setting Up a New Project

1. **Initialize Project Context**
   ```
   - Open "Aider: View Project Context"
   - Set Framework: "Next.js 14"
   - Add Rule: "Use TypeScript for all components"
   - Add Rule: "Use Tailwind CSS for styling"
   - Add Design Principle: "Responsive mobile-first design"
   - Add Design Principle: "WCAG 2.1 AA accessibility compliance"
   - Add Goal: "Build e-commerce MVP"
   ```

2. **Generate Code from Screenshot**
   ```
   - Take screenshot of desired UI from Figma/design tool
   - Paste into Aider chat panel
   - Click "Generate Code"
   - AI generates TypeScript + Tailwind component
   - Code follows all project rules
   - File opens automatically
   ```

3. **Refine and Iterate**
   ```
   - Review generated code
   - Use Aider chat to request modifications
   - All modifications respect project context
   - Add new patterns as you establish conventions
   ```

## AI Provider Selection

Different AI providers excel at different tasks:

- **Default**: General-purpose, balanced performance
- **Ollama**: Fast, local, good for simple components
- **GitHub Copilot**: Best for complex components, context-heavy work

You can:
- Set a default provider for screenshots
- Change provider per request
- Let Aider auto-select based on complexity

## Tips and Best Practices

### Screenshot Quality

- Use high-resolution screenshots for better results
- Include complete UI components, not fragments
- Annotate complex interactions in the prompt

### Project Context

- Start with core rules and expand over time
- Keep rules specific and measurable
- Review and update context regularly
- Share context file with team via git

### Code Generation

- Review and test all generated code
- Use generated code as a starting point
- Provide feedback to refine AI suggestions
- Add successful patterns to project context

### Context Organization

- Group related rules together
- Use clear, unambiguous language
- Document the "why" in design principles
- Keep patterns concise and reusable

## Troubleshooting

### Screenshot Not Processing

1. Check file format (PNG, JPG, WEBP supported)
2. Ensure file size is under 10MB
3. Verify AI provider is enabled and authenticated
4. Check extension output for errors

### Generated Code Doesn't Match Screenshot

1. Use higher resolution screenshot
2. Try different AI provider
3. Add more details to project context
4. Provide additional context in chat

### Project Context Not Loading

1. Verify workspace folder is open
2. Check `.aider/project-context.json` file permissions
3. Review extension logs for errors
4. Ensure `aider.projectContext.enabled` is `true`

### Rule Violations Not Detected

1. Rules must be specific (e.g., "No inline styles" works better than "Good styling")
2. Some complex rules require manual review
3. Consider adding patterns for better enforcement

## Future Enhancements

Planned improvements:

- Visual context editor with GUI
- Template library for common patterns
- Team collaboration features
- Advanced rule validation with AST parsing
- Integration with design tools (Figma, Sketch)
- Context suggestions based on project analysis
- Multi-screenshot workflows
- Component library generation

## Feedback

Please share feedback and suggestions:
- Create issues on GitHub
- Suggest rules and patterns that work well
- Share successful workflows
- Report bugs or inconsistencies
