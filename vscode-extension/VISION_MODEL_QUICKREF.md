# Vision Model Quick Reference

## Setup (Automatic in Container)

✅ **Nothing to do!** The vision model is automatically configured when you start the container:
- `llama3.2-vision` is preloaded
- Ollama provider is ready
- Screenshot-to-code is enabled

## Basic Usage

### Upload Screenshot
1. Open Aider chat panel
2. Drag image into drop zone OR paste from clipboard (Ctrl+V)
3. Click "Generate Code"
4. Review generated component

### Settings (Optional)

```json
{
  "aider.screenshot.defaultProvider": "ollama",
  "aider.screenshot.autoSelectVisionModel": true,
  "aider.aiProvider.ollama.visionModel": "llama3.2-vision"
}
```

## Common Commands

### Check Model Status
```bash
ollama list
```

### Manually Pull Model (if needed)
```bash
ollama pull llama3.2-vision
```

### Test Ollama
```bash
curl http://localhost:11434/api/tags
```

### Restart Ollama Service
```bash
supervisorctl restart ollama
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Vision model not available" | Run `ollama pull llama3.2-vision` |
| "Failed to analyze screenshot" | Check Ollama is running: `curl http://localhost:11434/api/tags` |
| Slow analysis | Ensure model is preloaded: `ollama list` |
| Poor code quality | Update project context with more specific rules |

## Provider Selection

| Task | Recommended Provider | Model |
|------|---------------------|-------|
| Screenshot Analysis | Ollama | llama3.2-vision |
| Simple Code Tasks | Ollama | llama2 |
| Complex Refactoring | Copilot | - |
| General Chat | Default | Configured model |

## Tips

✅ **Do:**
- Use clear, high-quality screenshots
- Define project context (rules, design principles)
- Crop screenshots to relevant components
- Use chat to refine generated code

❌ **Don't:**
- Upload extremely large images (>10MB)
- Expect perfect output without project context
- Disable auto-selection unless needed
- Forget to review generated code

## Model Comparison

| Model | Size | Speed | Quality | Vision |
|-------|------|-------|---------|--------|
| llama3.2-vision | ~7GB | Medium | Good | ✅ Yes |
| llava | ~4GB | Fast | Good | ✅ Yes |
| llama2 | ~4GB | Fast | Good | ❌ No |
| codellama | ~4GB | Fast | Excellent | ❌ No |

## Quick Settings

### Use Different Vision Model
```json
{
  "aider.aiProvider.ollama.visionModel": "llava"
}
```
Then run: `ollama pull llava`

### Disable Auto-Selection
```json
{
  "aider.screenshot.autoSelectVisionModel": false
}
```

### Change Default Provider
```json
{
  "aider.screenshot.defaultProvider": "copilot"
}
```

## Advanced

### Check Preload Script Logs
```bash
# In container
supervisorctl tail -f ollama-vision-preload
```

### Monitor Ollama Service
```bash
supervisorctl status ollama
```

### Model Storage Location
```
/home/coder/.ollama/models
```

### Environment Variables
```bash
OLLAMA_HOST=0.0.0.0:11434
OLLAMA_MODELS=/home/coder/.ollama/models
OLLAMA_VISION_MODEL=llama3.2-vision
```

## Support

For detailed information, see:
- [VISION_MODEL_GUIDE.md](VISION_MODEL_GUIDE.md) - Complete guide
- [AI_PROVIDER_GUIDE.md](AI_PROVIDER_GUIDE.md) - Provider setup
- [SCREENSHOT_CONTEXT_GUIDE.md](SCREENSHOT_CONTEXT_GUIDE.md) - Context tips
