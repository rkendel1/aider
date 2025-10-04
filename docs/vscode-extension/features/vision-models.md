# Screenshot-to-Code with Vision Models

Generate React/Next.js components from screenshots or wireframes using AI vision models.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Supported Providers](#supported-providers)
- [Usage](#usage)
- [Configuration](#configuration)
- [Workflows](#workflows)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The Vision Models feature enables you to:
- Upload screenshots or wireframes
- Automatically generate React/Next.js code
- Create production-ready components
- Apply project-specific rules and patterns

### Key Capabilities

✅ **Screenshot Upload**: Drag-and-drop or paste images  
✅ **AI Analysis**: Vision models analyze UI elements  
✅ **Code Generation**: Produces clean, structured code  
✅ **Project Context**: Respects your coding standards  
✅ **Auto File Creation**: Creates components in correct locations  
✅ **Live Preview**: See generated UI immediately  

## Quick Start

### Prerequisites

- Aider VS Code extension installed
- Ollama running (pre-configured in Docker container)
- Vision model pulled (automatic in container)

### 5-Minute Start

1. **Ensure vision model is available**:
   ```bash
   ollama list  # Should show llama3.2-vision
   ```

2. **Open Aider chat** in VS Code

3. **Upload screenshot**:
   - Drag and drop image into chat
   - Or paste from clipboard (Ctrl+V)

4. **Add prompt**:
   ```
   Create a React component from this screenshot
   ```

5. **Send** and watch Aider generate code!

## Supported Providers

### Ollama (Recommended for Local)

- **Model**: `llama3.2-vision` (preloaded in container)
- **Speed**: Fast, runs locally
- **Cost**: Free
- **Best for**: Quick iterations, offline work

**Setup:**
```bash
ollama pull llama3.2-vision
```

### GitHub Copilot

- **Model**: GPT-4 Vision (when available)
- **Speed**: Medium
- **Cost**: Subscription-based
- **Best for**: Complex UIs, high accuracy

**Setup:**
```bash
gh auth login
```

### OpenAI (via Default Provider)

- **Model**: GPT-4 Vision
- **Speed**: Medium
- **Cost**: Pay-per-use
- **Best for**: Production quality

**Setup:**
```bash
export OPENAI_API_KEY=sk-...
```

## Usage

### Method 1: Drag and Drop

1. Open Aider chat
2. Drag image file into chat input
3. Image preview appears
4. Add description or instructions
5. Send message
6. Code is generated and file created

### Method 2: Paste from Clipboard

1. Copy screenshot (screenshot tool, browser, etc.)
2. Focus Aider chat input
3. Press Ctrl+V (Cmd+V on Mac)
4. Image appears in input
5. Add prompt and send

### Method 3: File Selection

1. Click the 📎 attach button in chat
2. Browse and select image file
3. Add prompt and send

## Configuration

### Basic Settings

```json
{
  // Default provider for screenshots
  "aider.screenshot.defaultProvider": "ollama",
  
  // Automatically select vision model for screenshots
  "aider.screenshot.autoSelectVisionModel": true,
  
  // Ollama vision model
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision",
  
  // Preload vision model on startup
  "aider.aiProvider.ollama.preloadVisionModel": true
}
```

### Advanced Settings

```json
{
  // Provider priority for screenshots
  "aider.screenshot.providerPriority": ["ollama", "copilot", "default"],
  
  // Max image size (MB)
  "aider.screenshot.maxImageSize": 10,
  
  // Auto-create files from generated code
  "aider.screenshot.autoCreateFiles": true,
  
  // Default component directory
  "aider.screenshot.componentDirectory": "src/components"
}
```

## Workflows

### Workflow 1: Simple Component

```
1. Screenshot a button or card from a design
2. Paste into Aider chat
3. Prompt: "Create a React component matching this design"
4. Aider analyzes and generates:
   - Component file (ButtonPrimary.tsx)
   - Styles (using Tailwind or CSS modules)
   - Props interface
5. File appears in your project
6. Live preview shows the component
```

### Workflow 2: Full Page Layout

```
1. Upload full page screenshot
2. Prompt: "Create a Next.js page with this layout using Tailwind"
3. Aider generates:
   - Page component
   - Sub-components (Header, Hero, Footer)
   - Responsive CSS
   - Proper Next.js structure
4. Review in live preview
5. Refine with follow-up prompts
```

### Workflow 3: Design-to-Code Iteration

```
1. Upload wireframe or mockup
2. Initial prompt: "Create components from this design"
3. Review generated code
4. Upload refined design
5. Prompt: "Update the components to match this new design"
6. Aider updates existing files
7. Compare changes in diff view
```

### Workflow 4: With Project Context

```
1. Define project rules in .aider/project-context.json:
   {
     "rules": ["Use TypeScript", "Use Tailwind CSS"],
     "codingPatterns": {
       "Components": "Use function components with props interface"
     }
   }
2. Upload screenshot
3. Prompt: "Create component following project rules"
4. Aider generates code respecting your standards
5. Validated against project rules
```

## Prompting Best Practices

### Effective Prompts

**✓ Good Examples:**

```
"Create a responsive card component from this screenshot using Tailwind CSS"

"Generate a Next.js header component with navigation matching this design"

"Convert this dashboard layout to React components using shadcn/ui"

"Create a login form component with validation based on this mockup"
```

**✗ Avoid:**

```
"Make this"  // Too vague

"Code"  // No context

"Component"  // Missing details
```

### Prompt Template

```
Create a [component type] from this [image type]:
- Use [framework/library]
- Style with [CSS approach]
- Include [specific features]
- Follow [design system]
```

### Example Prompts

**For Buttons:**
```
Create a button component from this screenshot:
- Use TypeScript and React
- Style with Tailwind CSS
- Include hover and active states
- Support primary and secondary variants
```

**For Forms:**
```
Generate a signup form from this design:
- Use React Hook Form
- Add Zod validation
- Style with shadcn/ui
- Include error states
```

**For Layouts:**
```
Create a dashboard layout from this screenshot:
- Use Next.js 14 with App Router
- Responsive grid with Tailwind
- Include sidebar navigation
- Add mobile hamburger menu
```

## Troubleshooting

### Vision Model Not Available

**Symptoms**: Error message "Vision model not found"

**Solutions**:
1. Pull the model:
   ```bash
   ollama pull llama3.2-vision
   ```
2. Verify it's installed:
   ```bash
   ollama list
   ```
3. Check Ollama is running:
   ```bash
   ps aux | grep ollama
   ```

### Image Won't Upload

**Symptoms**: Image doesn't appear after pasting/dropping

**Solutions**:
1. Check image format (supports JPG, PNG, GIF, WebP)
2. Verify file size < 10MB
3. Try different upload method (drag vs. paste vs. file picker)
4. Check console for errors: View → Output → Aider

### Generated Code Has Errors

**Symptoms**: TypeScript errors or runtime issues

**Solutions**:
1. Use more specific prompts
2. Include framework version in prompt
3. Specify coding patterns explicitly
4. Add project context with rules
5. Iterate with follow-up prompts

### Low Quality Output

**Symptoms**: Code doesn't match screenshot well

**Solutions**:
1. Use higher quality screenshot
2. Try different provider (Copilot vs Ollama)
3. Provide more detailed prompt
4. Break complex UIs into smaller components
5. Add reference to design system

## Best Practices

### Screenshot Quality

- **High Resolution**: Use 2x or retina screenshots
- **Clear UI**: Avoid blurry or pixelated images
- **Full Context**: Include surrounding elements for layout
- **Light Mode**: Generally better recognition than dark mode
- **Single Component**: Focus on one component at a time for best results

### Project Setup

**1. Define Project Context**

Create `.aider/project-context.json`:
```json
{
  "rules": [
    "Use TypeScript",
    "Use Tailwind CSS",
    "No inline styles"
  ],
  "codingPatterns": {
    "Components": "Function components with TypeScript interfaces",
    "Styling": "Tailwind utility classes only"
  }
}
```

**2. Set Up Consistent Structure**

```
src/
  components/
    ui/          # Basic components
    features/    # Feature-specific
    layouts/     # Page layouts
```

**3. Use Design System**

Reference your design system in prompts:
```
"Create component using Material-UI"
"Follow shadcn/ui patterns"
"Use our custom Tailwind config"
```

### Iterative Refinement

1. **Start Simple**: Upload basic version first
2. **Review Output**: Check generated code
3. **Refine Prompt**: Add specific requirements
4. **Iterate**: Upload updated screenshots as needed
5. **Test**: Verify in live preview
6. **Commit**: Save working versions

### Performance Tips

- Use Ollama for quick iterations (fast, local)
- Use Copilot/GPT-4V for final, production code
- Break complex UIs into smaller screenshots
- Reuse components instead of generating duplicates

## Vision Model Comparison

| Feature | Ollama | GitHub Copilot | OpenAI |
|---------|--------|----------------|--------|
| **Speed** | Very Fast | Medium | Medium |
| **Cost** | Free | Subscription | Pay-per-use |
| **Offline** | Yes | No | No |
| **Quality** | Good | Excellent | Excellent |
| **Setup** | Easy | Medium | Easy |
| **Best For** | Iterations | Production | Production |

## Known Limitations

1. **Complex UIs**: May struggle with very complex designs
2. **Exact Matching**: Won't match pixel-perfect without iteration
3. **Custom Fonts**: May not detect specific font families
4. **Animations**: Cannot infer animations from static screenshots
5. **Icons**: May substitute similar icons if exact match unavailable

## Future Enhancements

Planned improvements:
- Support for Figma and Sketch file imports
- Multi-screenshot component generation
- Style transfer from existing components
- Animation detection from video/GIF
- Batch processing of multiple screenshots
- Component library generation

## Related Documentation

- **[AI Providers](ai-providers.md)** - Configure AI providers
- **[Project Context](project-context.md)** - Set up project rules
- **[Live Preview](live-preview.md)** - View generated components
- **[Chat Interface](../usage/chat-interface.md)** - Using chat effectively

---

**Quick Tip:** Start with simple components and iterate. Vision models improve with clear, specific prompts! 🎨

*Having issues? Check [Troubleshooting](#troubleshooting) or [open an issue](https://github.com/Aider-AI/aider/issues).*
