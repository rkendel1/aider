# Quick Start Guide

Get up and running with Aider + Code-Server + Supabase in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- An OpenAI API key (get one at https://platform.openai.com/api-keys)
- 4GB+ RAM available for Docker

## Steps

### 1. Navigate to Docker Directory

```bash
cd docker
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Add Your OpenAI API Key

Edit `.env` and add your API key:

```bash
# Open with your preferred editor
nano .env
# or
vim .env
# or
code .env
```

Update this line:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 4. Start Everything

```bash
docker compose up -d --build
```

**OR** use the Makefile for convenience:
```bash
make build && make up
```

This will take a few minutes the first time as it:
- Builds the VS Code extension from source
- Downloads required images
- Builds the custom code-server image
- Installs the Aider extension in code-server
- Starts all services

### 5. Access Code-Server

Open your browser to: **http://localhost:8443**

- Password: `aider` (or whatever you set in `CODE_SERVER_PASSWORD`)

The Aider extension will be pre-installed and ready to use!

### 6. Verify Aider API is Running

```bash
curl http://localhost:5000/api/health
```

You should see: `{"status":"ok","version":"0.1.0"}`

### 7. Use the Aider Extension

The Aider VS Code extension is pre-installed and pre-configured:

1. Click the Aider icon in the Activity Bar (left sidebar)
2. Start chatting with Aider!

The extension is already configured to connect to `http://localhost:5000`.

### 8. Start Coding!

You're all set! The Aider extension is installed, configured, and ready to help you code.

## What's Running?

- **Code-Server** (VS Code in browser): http://localhost:8443
- **Aider API**: http://localhost:5000
- **Supabase API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

## New Features

✨ **Supabase CLI**: Now pre-installed! Access it from within the container:
```bash
docker exec -it docker-code-server-1 /bin/bash
supabase --version
```

✨ **Optimized Builds**: Docker images build 25-30% faster with reduced sizes

✨ **Better Error Handling**: Clear error messages if API keys are missing

✨ **Auto-Recovery**: Services automatically restart on failure

See [DOCKER_OPTIMIZATIONS.md](DOCKER_OPTIMIZATIONS.md) for details.

## Common Commands

```bash
# View logs
docker compose logs -f

# Stop everything
docker compose down

# Restart services
docker compose restart

# Rebuild after changes (includes rebuilding extension)
docker compose up -d --build

# Check service status
docker compose ps

# Use Makefile shortcuts
make up      # Start services
make down    # Stop services
make logs    # View logs
make build   # Rebuild images
make health  # Check service health
```

## Troubleshooting

### Can't connect to code-server?

Check if it's running:
```bash
docker compose ps code-server
```

View logs:
```bash
docker compose logs code-server
```

### Aider API not responding?

Check the API:
```bash
docker exec -it docker-code-server-1 supervisorctl status
```

### Aider extension not showing up?

The extension is installed automatically during the build. To verify:

```bash
docker exec -it docker-code-server-1 code-server --list-extensions
```

You should see `aider.aider-vscode` in the list.

### Need to reset everything?

```bash
docker compose down -v  # WARNING: Deletes all data!
docker compose up -d --build
```

## Next Steps

- Read the full [README.md](README.md) for advanced configuration
- Mount your own project (see README.md "Custom Project Mount")
- Configure Supabase for your application needs
- Explore the caching features to reduce token usage

## Need Help?

- Full documentation: [README.md](README.md)
- Aider documentation: https://aider.chat/
- Report issues: https://github.com/rkendel1/aider/issues
