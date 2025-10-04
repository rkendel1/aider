# Vision Model Integration Guide

## Overview

The Aider VS Code extension now includes comprehensive support for vision-enabled AI models, specifically optimized for screenshot-to-code workflows using Ollama's `llama3.2-vision` model. This feature enables automatic analysis of UI screenshots and generation of production-ready React/Next.js components.

## Features

### 1. Default Vision Model Setup

- **Pre-configured Model**: `llama3.2-vision` is set as the default vision-capable model
- **Automatic Preloading**: Model is pulled and preloaded when the container starts
- **Instant Availability**: Ready for screenshot analysis without manual setup
- **Fallback Support**: Gracefully handles model loading failures with informative error messages

### 2. Automatic Model Selection

- **Smart Detection**: Automatically detects when a screenshot is pasted or uploaded
- **Vision Model Selection**: Switches to vision-capable model for screenshot analysis
- **User Override**: Users can manually select provider via dropdown in Aider panel
- **Configuration**: Fully configurable via VS Code settings

### 3. Context-Aware Code Generation

- **Project Rules**: Respects project-level rules and constraints
- **Design Principles**: Follows established design principles
- **Coding Patterns**: Uses project-specific coding patterns
- **Rule Validation**: Validates generated code against project rules
- **Warning System**: Notifies users of potential violations

### 4. Structured Output

- **Code Extraction**: Automatically extracts code from AI responses
- **Language Detection**: Identifies programming language (TypeScript, JavaScript)
- **Component Naming**: Derives intelligent component names from code
- **File Creation**: Automatically creates files in appropriate directories
- **Live Preview**: Updates live preview with generated components

## Configuration

### Default Settings

The extension comes with sensible defaults for vision model integration:

```json
{
  "aider.screenshot.defaultProvider": "ollama",
  "aider.screenshot.autoSelectVisionModel": true,
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision",
  "aider.aiProvider.ollama.preloadVisionModel": true,
  "aider.aiProvider.ollama.enabled": true,
  "aider.aiProvider.ollama.endpoint": "http://localhost:11434"
}
```

### Customization Options

#### Change Vision Model

To use a different vision model:

```json
{
  "aider.aiProvider.ollama.visionModel": "llava"
}
```

Then manually pull the model:
```bash
ollama pull llava
```

#### Disable Auto-Selection

To manually select providers for each task:

```json
{
  "aider.screenshot.autoSelectVisionModel": false,
  "aider.screenshot.defaultProvider": "copilot"
}
```

#### Disable Preloading

To skip automatic model preloading (saves startup time but requires manual pull):

```json
{
  "aider.aiProvider.ollama.preloadVisionModel": false
}
```

## Usage

### Screenshot-to-Code Workflow

1. **Prepare Screenshot**: Capture or find a UI screenshot you want to convert to code

2. **Upload to Aider**:
   - **Drag & Drop**: Drag image file into the screenshot drop zone
   - **Paste**: Copy image to clipboard and paste (Ctrl+V / Cmd+V) in chat panel
   - **Browse**: Click "Aider: Upload Screenshot" from command palette

3. **Generate Code**: Click "Generate Code" button

4. **AI Analysis**: The vision model analyzes the screenshot with context awareness:
   - Identifies UI elements and layout
   - Applies project context (rules, design principles)
   - Generates production-ready React/Next.js code
   - Validates against project rules

5. **Review & Refine**:
   - Generated file automatically created in `src/components/`
   - File opens in editor for review
   - Use Aider chat to refine the generated code
   - Live preview updates automatically

### Model Selection

The extension automatically selects the appropriate model based on the task:

- **Screenshot Analysis**: Uses vision model (`llama3.2-vision`)
- **Text Chat**: Uses configured text model (`llama2`, `codellama`, etc.)
- **Complex Tasks**: Falls back to Copilot or Default provider if configured

You can override automatic selection by:
1. Clicking the provider dropdown at the top of the chat panel
2. Selecting your preferred provider (Ollama, Copilot, Default)

## Container Integration

### Automatic Setup

When using the Aider development container, the vision model is automatically configured:

1. **Ollama Installation**: Ollama is pre-installed and configured
2. **Service Startup**: Ollama service starts automatically with supervisord
3. **Model Preloading**: Vision model is pulled during container initialization
4. **Health Checks**: Automatic verification that model is available

### Manual Setup (if needed)

If the automatic preloading fails, you can manually pull the model:

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Pull the vision model
ollama pull llama3.2-vision

# Verify it's available
ollama list
```

### Environment Variables

The container configures these environment variables:

- `OLLAMA_HOST=0.0.0.0:11434` - Ollama server endpoint
- `OLLAMA_MODELS=/home/coder/.ollama/models` - Model storage location
- `OLLAMA_VISION_MODEL=llama3.2-vision` - Default vision model name

## API & Hooks

### Vision Model API

The extension provides clean APIs for interacting with vision models:

#### ProviderManager Methods

```typescript
// Get vision model for a provider
const visionModel = providerManager.getVisionModel(AIProvider.Ollama);

// Check if provider supports vision
const supportsVision = providerManager.supportsVision(AIProvider.Ollama);

// Get best provider for vision tasks
const visionProvider = providerManager.getVisionProvider();
```

#### ScreenshotService Methods

```typescript
// Analyze screenshot with vision model
const result = await screenshotService.analyzeScreenshot(
    screenshot,
    provider,
    visionModel,
    endpoint,
    projectContext
);

// Result includes:
// - code: Generated code string
// - fileName: Suggested filename
// - language: Programming language
// - description: Description of generated code
// - provider: AI provider used
```

### Event Hooks

The extension handles screenshot events via `postMessage`:

```typescript
// Screenshot uploaded
{
    type: 'screenshotUploaded',
    screenshot: {
        dataUrl: string,
        fileName: string,
        timestamp: number
    }
}

// Processing started
{
    type: 'addMessage',
    message: {
        role: 'info',
        content: 'Analyzing screenshot with Ollama (llama3.2-vision)...'
    }
}

// Code generated
{
    type: 'addMessage',
    message: {
        role: 'assistant',
        content: '✅ Generated Component.tsx from screenshot...',
        provider: 'ollama'
    }
}

// Error occurred
{
    type: 'addMessage',
    message: {
        role: 'system',
        content: '❌ Vision model not available. Please ensure...'
    }
}
```

## Troubleshooting

### Model Not Found Error

**Symptom**: Error message: "Vision model not available"

**Solution**:
```bash
# Pull the model manually
ollama pull llama3.2-vision

# Verify it's in the list
ollama list | grep llama3.2-vision
```

### Ollama Connection Error

**Symptom**: "Failed to analyze screenshot with Ollama"

**Solution**:
1. Check Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```
2. Restart Ollama service:
   ```bash
   # In container
   supervisorctl restart ollama
   ```

### Slow Response Time

**Symptom**: Screenshot analysis takes very long

**Solutions**:
- Ensure model is preloaded (check `ollama list`)
- Reduce image size before uploading
- Check container resource allocation
- Use a faster vision model like `llava`

### Generated Code Quality Issues

**Symptom**: Generated code doesn't match design or violates rules

**Solutions**:
1. Update project context with more specific rules
2. Add design principles to project context
3. Provide more detailed screenshots
4. Use chat to refine the generated code
5. Consider using Copilot for complex designs

## Best Practices

### 1. Optimize Screenshots

- Use high-quality, clear screenshots
- Crop to relevant UI components
- Ensure text is readable
- Include sufficient context (navigation, buttons, etc.)

### 2. Leverage Project Context

- Define clear coding standards
- Document design principles
- Specify component patterns
- Set framework preferences

### 3. Iterative Refinement

- Start with screenshot generation
- Review and validate output
- Use chat to refine details
- Apply project-specific styling

### 4. Model Management

- Let container preload model automatically
- Periodically update models: `ollama pull llama3.2-vision`
- Monitor disk space for model storage
- Remove unused models to free space

## Advanced Features

### Custom Prompts

The vision model receives context-aware prompts that include:

- Project framework (React, Next.js)
- TypeScript preferences
- Styling approach (Tailwind CSS)
- Accessibility requirements
- Project-specific rules
- Design principles

### Output Validation

Generated code is automatically validated against:

- Project rules (no inline styles, TypeScript required, etc.)
- Code structure (proper exports, component format)
- File naming conventions
- Code quality standards

Violations are reported but don't block code generation.

### Multi-Provider Support

The vision workflow integrates with all providers:

- **Ollama**: Fast, local, vision-capable (default)
- **Copilot**: Advanced AI for complex designs
- **Default**: Fallback to configured Aider model

## Future Enhancements

Planned improvements:

1. **Multiple Model Support**: Switch between different vision models
2. **Batch Processing**: Analyze multiple screenshots at once
3. **Design System Integration**: Auto-apply design tokens
4. **Component Library Detection**: Use existing components
5. **Style Transfer**: Apply existing styles to new components
6. **A/B Comparison**: Generate multiple variants
7. **Performance Metrics**: Track generation quality and speed

## Support

For issues or questions:

1. Check [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) for provider setup
2. Review [SCREENSHOT_CONTEXT_GUIDE.md](SCREENSHOT_CONTEXT_GUIDE.md) for context tips
3. Check container logs: `docker logs <container-id>`
4. Verify Ollama service: `supervisorctl status ollama`
5. Open an issue on GitHub with details

## References

- [Ollama Documentation](https://ollama.ai/docs)
- [llama3.2-vision Model](https://ollama.ai/library/llama3.2-vision)
- [Aider Documentation](https://aider.chat/docs)
- [VS Code Extension API](https://code.visualstudio.com/api)
