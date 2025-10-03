# Docker Setup with Code-Server and Supabase

This directory contains a complete Docker-based development environment combining:

- **Code-Server**: VS Code running in your browser
- **Aider**: AI pair programming assistant via REST API
- **Supabase**: Complete backend-as-a-service (PostgreSQL, Auth, Storage, Realtime)

## Quick Links

📚 **Documentation:**
- [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes
- [Full Documentation](README.md) - Comprehensive guide
- [Overview](OVERVIEW.md) - Architecture and summary
- [Integration Examples](EXAMPLES.md) - Real-world usage examples
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Docker Optimizations](DOCKER_OPTIMIZATIONS.md) - Performance improvements and Supabase CLI

🛠️ **Tools:**
- [Makefile](Makefile) - Convenience commands
- [Test Script](test-setup.sh) - Validation tests
- [Secret Generator](generate-secrets.sh) - Production security

## What You Get

✅ **Browser-Based IDE**: Access VS Code from anywhere via http://localhost:8443
✅ **AI Pair Programming**: Aider integrated and ready at http://localhost:5000
✅ **Complete Backend**: PostgreSQL, Auth, REST API, Realtime, Storage
✅ **Supabase CLI**: Pre-installed for database management and migrations
✅ **Persistent Data**: All data survives container restarts
✅ **Token Optimization**: Intelligent caching reduces AI API costs
✅ **Optimized Performance**: Fast builds with reduced image sizes
✅ **Production Ready**: Security tools, health checks, and best practices included

## Quick Start

```bash
# 1. Navigate to docker directory
cd docker

# 2. Create environment configuration
cp .env.example .env

# 3. Add your OpenAI API key
# Edit .env and set: OPENAI_API_KEY=sk-your-key-here

# 4. Start everything
docker compose up -d

# 5. Access code-server
# Open browser to: http://localhost:8443
# Password: aider (or value from CODE_SERVER_PASSWORD)
```

That's it! You now have:
- Code-Server running at http://localhost:8443
- Aider API at http://localhost:5000
- Supabase API at http://localhost:8000
- PostgreSQL at localhost:5432

## Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| Code-Server | 8443 | VS Code web interface |
| Aider API | 5000 | AI pair programming backend |
| Supabase API | 8000 | REST API gateway (Kong) |
| PostgreSQL | 5432 | Database |

## Persistent Volumes

All data is stored in Docker volumes:

- **workspace** - Your project files
- **aider-cache** - Aider cache (reduces token usage)
- **code-server-config** - VS Code settings and extensions
- **supabase-db** - PostgreSQL database data
- **supabase-storage** - File storage data

## Common Commands

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

# Open shell in container
make shell

# Run validation tests
make test

# Generate secure secrets
make secrets

# Backup workspace
make backup-workspace

# Show all commands
make help
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Compose                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │      code-server Container (Supervisor)         │    │
│  │  ┌──────────────┐    ┌──────────────────┐     │    │
│  │  │ Code-Server  │    │   Aider API      │     │    │
│  │  │   :8443      │───▶│   :5000          │     │    │
│  │  └──────────────┘    └──────────────────┘     │    │
│  └────────────────────────────────────────────────┘    │
│                           │                             │
│  ┌────────────────────────┼─────────────────────────┐  │
│  │              Supabase Stack                       │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐ │  │
│  │  │ PostgreSQL  │  │   Kong   │  │    Auth     │ │  │
│  │  │   :5432     │  │  :8000   │  │  (GoTrue)   │ │  │
│  │  └─────────────┘  └──────────┘  └─────────────┘ │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐ │  │
│  │  │     REST    │  │ Realtime │  │   Storage   │ │  │
│  │  │ (PostgREST) │  │          │  │             │ │  │
│  │  └─────────────┘  └──────────┘  └─────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Environment Configuration

Key environment variables (configure in `.env`):

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key

**Optional:**
- `CODE_SERVER_PASSWORD` - Password for code-server (default: aider)
- `ANTHROPIC_API_KEY` - For Claude models
- `AIDER_MODEL` - Specific model to use
- `POSTGRES_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - Supabase JWT secret (change for production!)

See [.env.example](.env.example) for all options.

## Caching & Token Optimization

Aider implements intelligent caching to reduce token usage:

- **Cache Location**: `/home/coder/.aider/cache` (persisted in Docker volume)
- **What's Cached**: API responses, file content hashes, conversation context
- **Benefits**: Reduced token costs, faster responses for similar requests
- **Management**: `docker exec -it docker-code-server-1 du -sh /home/coder/.aider/cache`

Clear cache if needed:
```bash
docker exec -it docker-code-server-1 rm -rf /home/coder/.aider/cache/*
```

## Security

### Development (Default)
The default configuration is suitable for local development.

### Production
For production deployment:

1. **Generate secure secrets**:
   ```bash
   make secrets
   ```

2. **Update .env with generated values**

3. **Enable HTTPS**: Use a reverse proxy (nginx, Traefik) with SSL

4. **Restrict network access**: Don't expose all ports publicly

5. **Update regularly**:
   ```bash
   docker compose pull
   docker compose up -d
   ```

See [README.md](README.md#security-considerations) for detailed security guidance.

## Integration Examples

### Example 1: Build a Todo App

```javascript
// Ask Aider in code-server:
"Create a todo app using Supabase for data storage"

// Aider will generate complete HTML/JavaScript code
// using the Supabase REST API at http://localhost:8000
```

### Example 2: Add Authentication

```javascript
// Ask Aider:
"Add user authentication using Supabase Auth"

// Aider generates sign-up, sign-in, and user management code
```

See [EXAMPLES.md](EXAMPLES.md) for more detailed integration examples.

## Troubleshooting

### Can't access code-server?

```bash
# Check if container is running
docker compose ps

# View logs
docker compose logs code-server

# Verify port is free
lsof -i :8443
```

### Aider API not responding?

```bash
# Check API health
curl http://localhost:5000/api/health

# Check supervisor status
docker exec -it docker-code-server-1 supervisorctl status

# Restart API
docker exec -it docker-code-server-1 supervisorctl restart aider-api
```

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for comprehensive troubleshooting guide.

## File Structure

```
docker/
├── docker-compose.yml          # Main orchestration
├── Dockerfile.vscode           # Custom image
├── .env.example               # Configuration template
├── supervisord.conf           # Process manager
├── start-services.sh          # Startup script
├── start_aider_api_docker.py  # Aider API wrapper
├── supabase/
│   └── kong.yml              # API gateway config
├── README.md                  # Full documentation
├── QUICKSTART.md             # Quick start guide
├── OVERVIEW.md               # Architecture overview
├── EXAMPLES.md               # Integration examples
├── TROUBLESHOOTING.md        # Troubleshooting guide
├── Makefile                  # Convenience commands
├── test-setup.sh             # Validation tests
└── generate-secrets.sh       # Security tool
```

## System Requirements

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available for Docker
- 10GB+ disk space

## Contributing

Found an issue or want to improve the setup?

1. Test your changes
2. Update documentation
3. Submit a pull request

## License

This Docker setup is part of the Aider project. See the main repository LICENSE file.

## Support & Resources

- **Aider Documentation**: https://aider.chat/
- **Supabase Documentation**: https://supabase.com/docs
- **Code-Server Documentation**: https://coder.com/docs/code-server
- **Docker Documentation**: https://docs.docker.com/

## Credits

This Docker setup integrates:
- [Aider](https://github.com/paul-gauthier/aider) - AI pair programming
- [Code-Server](https://github.com/coder/code-server) - VS Code in browser
- [Supabase](https://github.com/supabase/supabase) - Open source Firebase alternative
