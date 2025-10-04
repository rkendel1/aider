# Vision Model Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VS Code Extension                         │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  Chat Panel    │  │ Screenshot UI  │  │  Provider Menu   │  │
│  │  (WebView)     │  │  (Drop/Paste)  │  │  (Dropdown)      │  │
│  └────────┬───────┘  └────────┬───────┘  └────────┬─────────┘  │
│           │                   │                    │             │
│           └───────────────────┼────────────────────┘             │
│                               │                                  │
│                    ┌──────────▼──────────┐                       │
│                    │   Chat Provider     │                       │
│                    │  - handleScreenshot │                       │
│                    │  - auto-select      │                       │
│                    │  - validation       │                       │
│                    └──────────┬──────────┘                       │
│                               │                                  │
│           ┌───────────────────┼───────────────────┐              │
│           │                   │                   │              │
│  ┌────────▼────────┐ ┌────────▼──────────┐ ┌─────▼────────┐    │
│  │ Provider Manager│ │Screenshot Service │ │Project Context│    │
│  │ - getVision...  │ │ - analyzeScreenshot│ │ - getRules   │    │
│  │ - supportsVision│ │ - callOllamaVision │ │ - validate   │    │
│  └────────┬────────┘ └────────┬──────────┘ └──────────────┘    │
│           │                   │                                  │
└───────────┼───────────────────┼──────────────────────────────────┘
            │                   │
            │                   │ HTTP POST
            │                   │ /api/generate
            │                   │
            │           ┌───────▼────────┐
            │           │ Ollama API     │
            │           │ Port 11434     │
            │           └───────┬────────┘
            │                   │
            │                   │
    ┌───────▼───────────────────▼─────────┐
    │        Docker Container              │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │      Supervisord Manager       │ │
    │  │                                │ │
    │  │  ┌──────────────────────────┐ │ │
    │  │  │  ollama serve            │ │ │
    │  │  │  (Always Running)        │ │ │
    │  │  └──────────────────────────┘ │ │
    │  │                                │ │
    │  │  ┌──────────────────────────┐ │ │
    │  │  │  ollama-vision-preload   │ │ │
    │  │  │  (Startup Only)          │ │ │
    │  │  └──────────────────────────┘ │ │
    │  │                                │ │
    │  │  ┌──────────────────────────┐ │ │
    │  │  │  code-server             │ │ │
    │  │  │  (VS Code)               │ │ │
    │  │  └──────────────────────────┘ │ │
    │  │                                │ │
    │  │  ┌──────────────────────────┐ │ │
    │  │  │  aider-api               │ │ │
    │  │  │  (Backend Service)       │ │ │
    │  │  └──────────────────────────┘ │ │
    │  └────────────────────────────────┘ │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │    Model Storage               │ │
    │  │  /home/coder/.ollama/models/   │ │
    │  │    - llama3.2-vision (~7GB)    │ │
    │  │    - llama2 (optional)         │ │
    │  │    - codellama (optional)      │ │
    │  └────────────────────────────────┘ │
    └──────────────────────────────────────┘
```

## Data Flow: Screenshot to Code

```
┌─────────────┐
│   User      │
│ Pastes/Drops│
│ Screenshot  │
└──────┬──────┘
       │
       │ 1. Upload Event
       ▼
┌─────────────────────────────────┐
│     Chat Provider               │
│  - Validates screenshot         │
│  - Gets project context         │
│  - Selects vision provider      │
└──────┬──────────────────────────┘
       │
       │ 2. Provider Selection
       ▼
┌─────────────────────────────────┐
│   Provider Manager              │
│  getVisionProvider()            │
│    ├─ Check Ollama enabled?    │
│    ├─ Check vision model set?  │
│    ├─ Return: Ollama           │
│    └─ Fallback: Copilot        │
└──────┬──────────────────────────┘
       │
       │ 3. Analysis Request
       ▼
┌─────────────────────────────────┐
│  Screenshot Service             │
│  analyzeScreenshot(             │
│    screenshot,                  │
│    provider='ollama',           │
│    visionModel='llama3.2-vision'│
│    endpoint='localhost:11434',  │
│    projectContext               │
│  )                              │
└──────┬──────────────────────────┘
       │
       │ 4. Build Prompt
       │    - Project rules
       │    - Design principles
       │    - Output format
       │
       │ 5. API Call
       ▼
┌─────────────────────────────────┐
│    Ollama Vision API            │
│  POST /api/generate             │
│  {                              │
│    model: "llama3.2-vision",    │
│    prompt: "...",               │
│    images: [base64],            │
│    stream: false                │
│  }                              │
└──────┬──────────────────────────┘
       │
       │ 6. AI Processing
       │    (10-30 seconds)
       │
       │ 7. Response
       ▼
┌─────────────────────────────────┐
│  Screenshot Service             │
│  - Extract code from markdown   │
│  - Determine file name          │
│  - Return structured result     │
└──────┬──────────────────────────┘
       │
       │ 8. Code Result
       ▼
┌─────────────────────────────────┐
│     Chat Provider               │
│  - Validate against rules       │
│  - Create file                  │
│  - Open in editor               │
│  - Update live preview          │
└──────┬──────────────────────────┘
       │
       │ 9. Success Notification
       ▼
┌─────────────┐
│   User      │
│ Reviews Code│
│ & Refines   │
└─────────────┘
```

## Configuration Flow

```
┌─────────────────────────────────┐
│     package.json                │
│  Settings Definitions           │
│  - visionModel                  │
│  - preloadVisionModel           │
│  - autoSelectVisionModel        │
└──────┬──────────────────────────┘
       │
       │ Read on Activation
       ▼
┌─────────────────────────────────┐
│    extension.ts                 │
│  - Read config values           │
│  - Create ProviderManager       │
│  - Set vision model             │
│  - Set supportsVision flag      │
└──────┬──────────────────────────┘
       │
       │ Initialize
       ▼
┌─────────────────────────────────┐
│   Provider Manager              │
│  providers.set(Ollama, {        │
│    model: 'llama2',             │
│    visionModel: 'llama3.2-..', │
│    supportsVision: true,        │
│    enabled: true                │
│  })                             │
└─────────────────────────────────┘
```

## Container Startup Sequence

```
Docker Container Start
       │
       ▼
┌─────────────────────┐
│  Supervisord        │
│  - Reads config     │
│  - Starts services  │
└──────┬──────────────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────────┐            ┌────────────────────┐
│ Ollama Service  │            │ Preload Service    │
│ - Starts server │            │ - Waits for Ollama │
│ - Port 11434    │            │ - Checks model     │
│ - Ready in 5s   │            │ - Pulls if needed  │
└─────────────────┘            └────────┬───────────┘
       │                                │
       │ Service Ready                  │ Model Check
       │                                │
       │◄───────────────────────────────┘
       │
       │ Model Available
       ▼
┌──────────────────────┐
│  llama3.2-vision     │
│  Ready for Use       │
│  (~1-2 min startup)  │
└──────────────────────┘
```

## Error Handling Flow

```
Screenshot Upload
       │
       ▼
┌─────────────────────┐
│ Validate Screenshot │
│ - Size < 10MB?      │
│ - Valid format?     │
└──────┬──────────────┘
       │
       ├─── Invalid ──────────┐
       │                      │
       │ Valid                ▼
       ▼              ┌────────────────┐
┌─────────────────┐  │ Show Error     │
│ Select Provider │  │ "Invalid image"│
└──────┬──────────┘  └────────────────┘
       │
       ├─── No Vision Provider ──┐
       │                         │
       │ Provider Found          ▼
       ▼                  ┌────────────────┐
┌─────────────────┐      │ Fallback       │
│ Call Vision API │      │ to Copilot     │
└──────┬──────────┘      └────────────────┘
       │
       ├─── Model Not Found ──────┐
       │                          │
       │ Success                  ▼
       ▼                   ┌────────────────┐
┌─────────────────┐       │ Show Error +   │
│ Extract Code    │       │ Pull Command   │
└──────┬──────────┘       └────────────────┘
       │
       ├─── Timeout ──────────────┐
       │                          │
       │ Success                  ▼
       ▼                   ┌────────────────┐
┌─────────────────┐       │ Show Error     │
│ Validate Rules  │       │ "Request timed"│
└──────┬──────────┘       └────────────────┘
       │
       │ Violations (warnings)
       │
       ▼
┌─────────────────┐
│ Create File     │
│ Open in Editor  │
└─────────────────┘
```

## Key Components

### ProviderManager
- **Purpose**: Manage AI provider configurations
- **Key Methods**:
  - `getVisionProvider()` - Select best vision provider
  - `getVisionModel(provider)` - Get vision model name
  - `supportsVision(provider)` - Check vision support
- **State**: Map of provider configurations

### ScreenshotService
- **Purpose**: Handle screenshot analysis
- **Key Methods**:
  - `analyzeScreenshot()` - Main analysis function
  - `callOllamaVision()` - Ollama API integration
  - `validateScreenshot()` - Input validation
  - `extractCodeFromResponse()` - Parse AI output
- **Dependencies**: axios for HTTP requests

### ChatProvider
- **Purpose**: Orchestrate screenshot workflow
- **Key Methods**:
  - `handleScreenshot()` - Entry point
- **Responsibilities**:
  - Provider selection
  - Context gathering
  - Service coordination
  - User feedback

### Preload Script
- **Purpose**: Ensure vision model availability
- **Features**:
  - Wait for Ollama service
  - Check existing models
  - Pull with retries (3 attempts)
  - Graceful failure
- **Execution**: One-time on container start

## Environment Variables

```
OLLAMA_HOST=0.0.0.0:11434
  └─> Allows external connections to Ollama

OLLAMA_MODELS=/home/coder/.ollama/models
  └─> Model storage location

OLLAMA_VISION_MODEL=llama3.2-vision
  └─> Default vision model name
```

## Settings Hierarchy

```
User Settings (VS Code)
  │
  ├─> aider.screenshot.autoSelectVisionModel (true/false)
  │     └─> Controls automatic provider selection
  │
  ├─> aider.screenshot.defaultProvider (ollama/copilot/default)
  │     └─> Fallback when auto-select is off
  │
  ├─> aider.aiProvider.ollama.visionModel (llama3.2-vision)
  │     └─> Which vision model to use
  │
  └─> aider.aiProvider.ollama.preloadVisionModel (true/false)
        └─> Whether to preload on startup
```

## Performance Metrics

| Operation | Typical Time |
|-----------|-------------|
| Container Startup | 30-60s |
| Model Preload (first time) | 1-3 min |
| Model Preload (cached) | 5-10s |
| Screenshot Upload | <1s |
| Vision Analysis | 10-30s |
| Code Extraction | <1s |
| File Creation | <1s |
| Total Workflow | 15-40s |

## Storage Requirements

| Component | Size |
|-----------|------|
| llama3.2-vision | ~7GB |
| llama2 (optional) | ~4GB |
| codellama (optional) | ~4GB |
| Container Base | ~2GB |
| VS Code + Extensions | ~500MB |
| **Total (with vision)** | **~10GB** |
