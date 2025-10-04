# Docker Development Environment Documentation

Complete Docker-based development environment with Code-Server, Aider, and Supabase.

## Table of Contents

- [Overview](#overview)
- [Quick Links](#quick-links)
- [What's Included](#whats-included)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Support](#support)

## Overview

This Docker setup provides a complete development environment combining:

- **Code-Server**: VS Code running in your browser
- **Aider**: AI pair programming assistant via REST API
- **Supabase**: Complete backend-as-a-service (PostgreSQL, Auth, Storage, Realtime)

### Key Benefits

✅ **Browser-Based IDE**: Access VS Code from anywhere  
✅ **AI Pair Programming**: Aider integrated and ready  
✅ **Complete Backend**: PostgreSQL, Auth, REST API, Realtime, Storage  
✅ **Supabase CLI**: Pre-installed for database management  
✅ **Persistent Data**: All data survives container restarts  
✅ **Token Optimization**: Intelligent caching reduces API costs  
✅ **Optimized Performance**: Fast builds with reduced image sizes  
✅ **Production Ready**: Security tools and best practices included  

## Quick Links

### Documentation Files

- **[Quick Start Guide](quickstart.md)** - Get running in 5 minutes
- **[Full Setup Guide](setup.md)** - Comprehensive installation and configuration
- **[Troubleshooting Guide](troubleshooting.md)** - Common issues and solutions
- **[Examples & Integrations](examples.md)** - Real-world usage examples
- **[Optimizations](optimizations.md)** - Performance improvements and best practices

### Tools & Templates

- **[Makefile](../../docker/Makefile)** - Convenience commands
- **[Test Script](../../docker/test-setup.sh)** - Validation tests
- **[Secret Generator](../../docker/generate-secrets.sh)** - Production security
- **[SaaS Starter Template](../../docker/templates/saas-starter/README.md)** - Production-ready template

## What's Included

### Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| Code-Server | 8443 | VS Code web interface |
| Aider API | 5000 | AI pair programming backend |
| Supabase API | 8000 | REST API gateway (Kong) |
| PostgreSQL | 5432 | Database |
| Supabase Studio | 3000 | Database management UI |
| Inbucket | 9000 | Email testing (development) |

### Persistent Volumes

All data stored in Docker volumes:

- **workspace** - Your project files
- **aider-cache** - Aider cache (reduces token usage)
- **code-server-config** - VS Code settings and extensions
- **supabase-db** - PostgreSQL database data
- **supabase-storage** - File storage data
- **supabase-logs** - Supabase service logs

### Pre-installed Tools

- **Ollama**: Local AI models for fast code generation
- **Supabase CLI**: Database migrations and management
- **Git**: Version control
- **Node.js & npm**: JavaScript development
- **Python & pip**: Python development
- **Aider**: AI pair programming CLI and API

## Quick Start

### 1. Prerequisites

- Docker Desktop or Docker Engine 20.10+
- Docker Compose v2.0+
- 4GB+ RAM available
- 10GB+ disk space

### 2. Setup

```bash
# Navigate to docker directory
cd docker

# Create environment configuration
cp .env.example .env

# Add your API key
# Edit .env and set: OPENAI_API_KEY=sk-your-key-here

# Start everything
docker compose up -d
```

### 3. Access Services

- **Code-Server**: http://localhost:8443 (password: `aider` or from `.env`)
- **Aider API**: http://localhost:5000
- **Supabase Studio**: http://localhost:3000
- **Supabase API**: http://localhost:8000

### 4. Common Commands

```bash
# Start services
make up
# or: docker compose up -d

# Stop services
make down
# or: docker compose down

# View logs
make logs
# or: docker compose logs -f

# Check health
make health

# Run tests
make test

# Clean and rebuild
make rebuild
```

### 5. Next Steps

- **[Read the full setup guide](setup.md)** - Detailed configuration
- **[Try the examples](examples.md)** - See what you can build
- **[Explore optimizations](optimizations.md)** - Improve performance

## Documentation

### For New Users

1. **[Quick Start](quickstart.md)** - 5-minute setup guide
2. **[Setup Guide](setup.md)** - Detailed installation and configuration
3. **[Examples](examples.md)** - Learn by example

### For Existing Users

- **[Troubleshooting](troubleshooting.md)** - Solve common problems
- **[Optimizations](optimizations.md)** - Improve performance and reduce costs
- **[SaaS Template](../../docker/templates/saas-starter/README.md)** - Production starter

### For Developers

- **[Docker Compose File](../../docker/docker-compose.yml)** - Service definitions
- **[Dockerfile](../../docker/Dockerfile.vscode)** - Custom image build
- **[Supervisor Config](../../docker/supervisord.conf)** - Process management

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (You)                           │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             │ http://localhost:8443    │ http://localhost:8000
             ▼                          ▼
┌────────────────────────┐   ┌─────────────────────────────┐
│    Code-Server         │   │       Supabase Stack        │
│  (VS Code in Browser)  │   │  ┌──────────────────────┐   │
│                        │   │  │   Kong (API Gateway) │   │
│  ┌─────────────────┐   │   │  └──────────┬───────────┘   │
│  │ Aider Extension │───┼───┼──────┐      │               │
│  └─────────────────┘   │   │      │      ▼               │
│                        │   │      │  ┌─────────┐         │
│  ┌─────────────────┐   │   │      │  │ Auth    │         │
│  │  Your Code      │   │   │      │  ├─────────┤         │
│  └─────────────────┘   │   │      │  │ Storage │         │
└────────────┬───────────┘   │      │  ├─────────┤         │
             │               │      │  │ Realtime│         │
             │               │      │  ├─────────┤         │
             ▼               │      │  │ REST API│         │
   ┌─────────────────┐       │      │  └────┬────┘         │
   │  Aider API      │◄──────┘      │       │              │
   │ (Port 5000)     │              │       ▼              │
   │                 │              │  ┌──────────┐        │
   │ ┌─────────────┐ │              │  │PostgreSQL│        │
   │ │   Ollama    │ │              │  └──────────┘        │
   │ │ (Local AI)  │ │              │                      │
   │ └─────────────┘ │              └──────────────────────┘
   └─────────────────┘
```

## File Structure

```
docker/
├── docker-compose.yml          # Main orchestration
├── Dockerfile.vscode           # Custom Code-Server image
├── .env.example               # Configuration template
├── supervisord.conf           # Process manager
├── start-services.sh          # Startup script
├── start_aider_api_docker.py  # Aider API wrapper
├── supabase/
│   └── kong.yml              # API gateway config
├── templates/
│   └── saas-starter/         # Production SaaS template
├── Makefile                  # Convenience commands
├── test-setup.sh             # Validation tests
└── generate-secrets.sh       # Security tool
```

## Environment Variables

Key environment variables (see `.env.example`):

```bash
# API Keys
OPENAI_API_KEY=sk-...           # Required for Aider
ANTHROPIC_API_KEY=sk-ant-...    # Optional alternative

# Code-Server
CODE_SERVER_PASSWORD=aider      # Web interface password

# Supabase
POSTGRES_PASSWORD=your-super-secret-password
JWT_SECRET=your-super-secret-jwt-token
ANON_KEY=...
SERVICE_ROLE_KEY=...

# Aider
AIDER_MODEL=gpt-4              # AI model to use
AIDER_CACHE_PROMPTS=true       # Enable caching
```

## Security

### Development

- Default passwords in `.env.example` are for development only
- Never commit `.env` file to version control
- Use the provided `generate-secrets.sh` for production

### Production

```bash
# Generate secure secrets
./generate-secrets.sh

# Review and update .env with generated values
# Update passwords, JWT secrets, and API keys
```

## System Requirements

### Minimum

- **CPU**: 2 cores
- **RAM**: 4GB
- **Disk**: 10GB free space
- **Network**: Internet connection for pulling images and AI API calls

### Recommended

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Disk**: 20GB+ SSD
- **Network**: Stable broadband connection

## Support

### Documentation

- [Quick Start Guide](quickstart.md)
- [Setup Guide](setup.md)
- [Troubleshooting](troubleshooting.md)
- [Examples](examples.md)

### External Resources

- [Aider Documentation](https://aider.chat/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Code-Server Documentation](https://coder.com/docs/code-server)
- [Docker Documentation](https://docs.docker.com/)

### Community

- [GitHub Issues](https://github.com/Aider-AI/aider/issues)
- [Aider Discord](https://discord.gg/aider)
- [Supabase Discord](https://discord.supabase.com/)

## Contributing

Contributions welcome! See [Contributing Guide](../CONTRIBUTING.md).

## License

This Docker setup is part of the Aider project. See [LICENSE](../LICENSE.txt).

---

**Quick Navigation:**  
[Quick Start](quickstart.md) | [Setup Guide](setup.md) | [Examples](examples.md) | [Troubleshooting](troubleshooting.md) | [Optimizations](optimizations.md)

*Ready to start? Head to the [Quick Start Guide](quickstart.md)!*
