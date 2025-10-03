# Docker Setup Summary

## Overview

This directory contains a complete Docker-based development environment that combines:
- **Code-Server**: VS Code running in your browser
- **Aider**: AI pair programming assistant
- **Supabase**: Complete backend-as-a-service platform

## Quick Links

- [Quick Start](QUICKSTART.md) - Get up and running in 5 minutes
- [Full Documentation](README.md) - Comprehensive guide
- [Troubleshooting](TROUBLESHOOTING.md) - Solutions to common issues

## What's Included

### Services

1. **code-server** (Port 8443)
   - VS Code in browser
   - Aider API server (Port 5000)
   - Managed by Supervisor

2. **Supabase Stack**
   - PostgreSQL Database (Port 5432)
   - REST API (via Kong at Port 8000)
   - Authentication (GoTrue)
   - Realtime subscriptions
   - File Storage

### Persistent Data

All data is stored in Docker volumes:
- `workspace` - Your project files
- `aider-cache` - Aider cache (reduces token usage)
- `code-server-config` - VS Code settings and extensions
- `supabase-db` - PostgreSQL database
- `supabase-storage` - File storage

### Key Features

✅ **Browser-based IDE**: Access VS Code from anywhere
✅ **AI Assistance**: Aider integrated for pair programming
✅ **Full Backend**: Supabase provides database, auth, and more
✅ **Persistent Storage**: Data survives container restarts
✅ **Token Optimization**: Caching reduces AI API costs
✅ **Easy Setup**: Single command to start everything
✅ **Well Documented**: Extensive guides and troubleshooting

## Quick Start

```bash
# 1. Navigate to docker directory
cd docker

# 2. Create environment file
cp .env.example .env

# 3. Add your OpenAI API key to .env
# Edit .env and set OPENAI_API_KEY=sk-your-key-here

# 4. Start everything
docker compose up -d

# 5. Access code-server
# Open browser to http://localhost:8443
# Password: aider (or value from CODE_SERVER_PASSWORD in .env)
```

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Check health
make health

# Restart services
docker compose restart

# Open shell in container
make shell

# View supervisor status
make status
```

## Environment Variables

Required in `.env`:
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `CODE_SERVER_PASSWORD` - Password for code-server (default: aider)

Optional:
- `ANTHROPIC_API_KEY` - For Claude models
- `AIDER_MODEL` - Specific model to use
- `POSTGRES_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - Supabase JWT secret

See `.env.example` for all options.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Compose                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         code-server Container                   │    │
│  │  ┌──────────────┐    ┌──────────────────┐     │    │
│  │  │ Code-Server  │    │   Aider API      │     │    │
│  │  │   :8443      │───▶│   :5000          │     │    │
│  │  └──────────────┘    └──────────────────┘     │    │
│  │          Managed by Supervisor                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌───────────────────────────────────────────────┐     │
│  │              Supabase Stack                    │     │
│  │                                                │     │
│  │  PostgreSQL → Kong → Auth/REST/Realtime/Storage│    │
│  │    :5432      :8000                           │     │
│  └───────────────────────────────────────────────┘     │
│                                                          │
│  Volumes: workspace, aider-cache, supabase-db, etc.     │
└──────────────────────────────────────────────────────────┘
```

## File Structure

```
docker/
├── docker-compose.yml          # Main orchestration file
├── Dockerfile.vscode           # Custom image with code-server + aider
├── .env.example               # Environment variables template
├── supervisord.conf           # Supervisor configuration
├── start-services.sh          # Startup script
├── start_aider_api_docker.py  # Aider API wrapper
├── supabase/
│   └── kong.yml              # Kong API gateway config
├── README.md                  # Full documentation
├── QUICKSTART.md             # Quick start guide
├── TROUBLESHOOTING.md        # Troubleshooting guide
├── Makefile                  # Convenience commands
└── test-setup.sh             # Validation script
```

## Ports

- **8443** - Code-Server (VS Code web interface)
- **5000** - Aider API
- **8000** - Supabase API Gateway (Kong)
- **5432** - PostgreSQL

## Volumes

All volumes use the `local` driver and persist data:

- `workspace` - Your code and project files
- `aider-cache` - Aider's cache directory
- `code-server-config` - Code-server configuration
- `supabase-db` - PostgreSQL data
- `supabase-storage` - Supabase file storage

## Caching Strategy

Aider is configured to cache API responses to minimize token usage:

1. **Cache Location**: `/home/coder/.aider/cache` (in volume)
2. **Environment Variable**: `AIDER_CACHE_DIR`
3. **Persistence**: Cache survives container restarts
4. **Management**: Can be cleared with `docker exec -it docker-code-server-1 rm -rf /home/coder/.aider/cache/*`

## Next Steps

1. Read the [Quick Start Guide](QUICKSTART.md) to get started
2. Check the [Full Documentation](README.md) for advanced features
3. Refer to [Troubleshooting](TROUBLESHOOTING.md) if you encounter issues

## Support

- Documentation: This directory's markdown files
- Aider Docs: https://aider.chat/
- Supabase Docs: https://supabase.com/docs
- Code-Server Docs: https://coder.com/docs/code-server

## License

This Docker setup is part of the Aider project. See the main repository for license information.
