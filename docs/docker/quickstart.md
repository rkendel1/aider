# Docker Quick Start

Get up and running with Aider + Code-Server + Supabase in 5 minutes!

## Prerequisites

- **Docker**: Docker Desktop or Docker Engine 20.10+
- **Docker Compose**: v2.0+
- **API Key**: OpenAI or Anthropic API key
- **RAM**: 4GB+ available
- **Disk**: 10GB+ free space

## 5-Minute Setup

### Step 1: Navigate to Directory

```bash
cd docker
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Add Your API Key

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
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Or use Anthropic:
```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

### Step 4: Start Everything

```bash
docker compose up -d
```

First time takes 3-5 minutes to download and build images.

**What's happening:**
- Building custom Code-Server image
- Starting Supabase stack (PostgreSQL, Auth, Storage, etc.)
- Starting Ollama for local AI
- Preloading vision model (llama3.2-vision)
- Setting up volumes and networks

### Step 5: Access Services

**Code-Server (VS Code in browser):**
- URL: http://localhost:8443
- Password: `aider` (or value from `CODE_SERVER_PASSWORD` in `.env`)

**Aider API:**
- URL: http://localhost:5000
- Test: `curl http://localhost:5000/api/health`
- Expected: `{"status":"ok","version":"0.1.0"}`

**Supabase Studio:**
- URL: http://localhost:3000
- Manage database, auth, storage

**Supabase API:**
- URL: http://localhost:8000

### Step 6: Verify Installation

**Check all services running:**
```bash
docker compose ps
```

All services should show "running" status.

**Test Aider API:**
```bash
curl http://localhost:5000/api/health
```

**Check Ollama:**
```bash
docker exec -it docker-code-server-1 ollama list
```

Should show `llama3.2-vision` model.

### Step 7: Configure Extension (Optional)

If Aider VS Code extension is installed in Code-Server:

1. Open Settings (Ctrl+,)
2. Search for "Aider"
3. Verify `aider.apiEndpoint` is `http://localhost:5000`
4. Extension should connect automatically

## What's Running?

| Service | URL | Description |
|---------|-----|-------------|
| Code-Server | http://localhost:8443 | VS Code in browser |
| Aider API | http://localhost:5000 | AI pair programming backend |
| Supabase Studio | http://localhost:3000 | Database management |
| Supabase API | http://localhost:8000 | REST API gateway |
| PostgreSQL | localhost:5432 | Database |

## Common Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f code-server
docker compose logs -f aider-api
```

### Stop Services

```bash
# Stop all
docker compose down

# Stop but keep volumes (preserves data)
docker compose stop
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart code-server
```

### Rebuild After Changes

```bash
docker compose up -d --build
```

### Check Service Status

```bash
docker compose ps
```

### Access Container Shell

```bash
# Code-Server container
docker exec -it docker-code-server-1 /bin/bash

# Inside container, check processes
supervisorctl status
```

## Using Makefile

Convenience commands available via Makefile:

```bash
# Start services
make up

# Stop services
make down

# View logs
make logs

# Check health
make health

# Run tests
make test

# Rebuild everything
make rebuild

# Clean and reset (WARNING: deletes data!)
make clean
```

## Troubleshooting

### Code-Server Won't Start

**Check if running:**
```bash
docker compose ps code-server
```

**View logs:**
```bash
docker compose logs code-server
```

**Common issues:**
- Port 8443 already in use
- Insufficient memory
- Docker not running

**Solutions:**
```bash
# Change port in docker-compose.yml
ports:
  - "8444:8443"  # Use different port

# Increase Docker memory in Docker Desktop settings
# Restart Docker
```

### Aider API Not Responding

**Check API status:**
```bash
docker exec -it docker-code-server-1 supervisorctl status aider-api
```

**Restart API:**
```bash
docker exec -it docker-code-server-1 supervisorctl restart aider-api
```

**Check logs:**
```bash
docker exec -it docker-code-server-1 supervisorctl tail -f aider-api
```

**Common issues:**
- Missing API key
- Invalid API key
- Network issues

**Solutions:**
```bash
# Verify API key in .env
cat .env | grep API_KEY

# Restart with new key
docker compose down
# Edit .env with correct key
docker compose up -d
```

### Supabase Not Starting

**Check all Supabase services:**
```bash
docker compose ps | grep supabase
```

**Restart Supabase:**
```bash
docker compose restart supabase-db supabase-auth supabase-rest
```

**Reset Supabase (WARNING: deletes data!):**
```bash
docker compose down -v
docker compose up -d
```

### Vision Model Not Loading

**Check Ollama status:**
```bash
docker exec -it docker-code-server-1 supervisorctl status ollama
```

**Verify model:**
```bash
docker exec -it docker-code-server-1 ollama list
```

**Manually pull model:**
```bash
docker exec -it docker-code-server-1 ollama pull llama3.2-vision
```

### Out of Disk Space

**Check Docker disk usage:**
```bash
docker system df
```

**Clean unused resources:**
```bash
docker system prune -a --volumes
```

### Reset Everything

**WARNING: This deletes all data!**

```bash
# Stop and remove everything
docker compose down -v

# Remove images
docker compose down --rmi all

# Rebuild from scratch
docker compose up -d --build
```

## Next Steps

### Explore Features

- **[Full Setup Guide](setup.md)** - Detailed configuration options
- **[Examples](examples.md)** - Real-world usage examples
- **[Optimizations](optimizations.md)** - Performance tuning
- **[Troubleshooting](troubleshooting.md)** - Complete troubleshooting guide

### Start Building

1. **Open Code-Server**: http://localhost:8443
2. **Create/Open Project**: File → Open Folder
3. **Install Extensions**: Aider extension should be available
4. **Start Coding**: Use Aider chat to build features

### Configure Supabase

1. **Access Studio**: http://localhost:3000
2. **Set Up Database**: Create tables and relationships
3. **Configure Auth**: Set up authentication providers
4. **Add Storage Buckets**: For file uploads
5. **Generate API Keys**: For your application

### Use Supabase CLI

Access CLI from container:
```bash
docker exec -it docker-code-server-1 /bin/bash
supabase --version
supabase help
```

Common CLI commands:
```bash
# Generate types
supabase gen types typescript --local

# Create migration
supabase migration new my_migration

# Apply migrations
supabase db push

# Reset database
supabase db reset
```

## Features Included

✅ **Code-Server**: Full VS Code in browser  
✅ **Aider API**: AI pair programming backend  
✅ **Supabase**: Complete BaaS platform  
✅ **Ollama**: Local AI models  
✅ **Vision Model**: Screenshot-to-code (llama3.2-vision)  
✅ **Persistent Storage**: Data survives restarts  
✅ **Auto-Restart**: Services recover from failures  
✅ **Supabase CLI**: Database management  
✅ **Optimized Builds**: Fast builds, smaller images  

## Tips

1. **First Run**: Takes longer due to image builds and model downloads
2. **API Keys**: Keep them secure, never commit to Git
3. **Volumes**: Data persists in Docker volumes
4. **Logs**: Use `docker compose logs -f` to debug issues
5. **Updates**: Run `docker compose pull` for latest images
6. **Backups**: Export important data before `down -v`

## Performance

**Expected resource usage:**
- CPU: 2-4 cores
- RAM: 4-8GB
- Disk: 10-20GB

**Optimize if needed:**
- Close unused services
- Adjust container resource limits
- Use Ollama for lightweight tasks
- Enable caching (see [Optimizations](optimizations.md))

## Support

- **Documentation**: [Full docs](README.md)
- **Examples**: [Integration examples](examples.md)
- **Issues**: [GitHub Issues](https://github.com/rkendel1/aider/issues)
- **Aider Docs**: https://aider.chat/
- **Supabase Docs**: https://supabase.com/docs

---

**Ready to code?** Open http://localhost:8443 and start building! 🚀

*Having issues? Check [Troubleshooting](#troubleshooting) or the [full guide](troubleshooting.md).*
