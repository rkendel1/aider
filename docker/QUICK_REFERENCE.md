# Aider VS Code Extension + Docker - Quick Reference

## 🚀 Quick Start (3 Steps)

```bash
# 1. Setup
cd docker
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 2. Start
docker compose up -d --build

# 3. Access
# Open: http://localhost:8443
# Password: aider
```

**That's it!** The Aider extension is pre-installed and ready to use.

---

## 📋 Common Commands

### Using Makefile (Recommended)

```bash
cd docker

make build          # Build extension + Docker images
make up             # Start all services
make down           # Stop all services
make restart        # Restart services
make logs           # View logs
make health         # Check service health
make status         # Show supervisor status
make shell          # Open shell in container
```

### Using Docker Compose Directly

```bash
cd docker

docker compose up -d --build    # Build and start
docker compose down             # Stop
docker compose restart          # Restart
docker compose logs -f          # View logs
docker compose ps               # Show status
```

---

## 🔧 Development Workflow

### Update Extension Code

```bash
# Make changes to vscode-extension/src/*

# Rebuild and restart:
cd docker
./build-extension.sh
docker compose build
docker compose up -d
```

### Check Extension Status

```bash
# List installed extensions
docker exec -it docker-code-server-1 code-server --list-extensions

# View extension settings
docker exec -it docker-code-server-1 cat /home/coder/.local/share/code-server/User/settings.json
```

---

## 🌐 Service URLs

| Service | URL | Notes |
|---------|-----|-------|
| Code-Server | http://localhost:8443 | VS Code in browser |
| Aider API | http://localhost:5000 | Backend API |
| API Health | http://localhost:5000/api/health | Health check |
| Supabase API | http://localhost:8000 | Optional |
| PostgreSQL | localhost:5432 | Optional |

---

## 📦 What's Included

- ✅ Code-Server (VS Code in browser)
- ✅ Aider VS Code Extension (pre-installed)
- ✅ Aider API Server (auto-configured)
- ✅ Supabase Stack (database, auth, storage)
- ✅ Persistent volumes for data
- ✅ Automatic configuration

---

## 🐛 Troubleshooting

### Extension not showing?

```bash
# Check if installed
docker exec -it docker-code-server-1 code-server --list-extensions

# Rebuild from scratch
docker compose down
make build-no-cache
docker compose up -d
```

### Can't connect to API?

```bash
# Check API health
curl http://localhost:5000/api/health

# Check supervisor status
make status

# View logs
make logs SERVICE=code-server
```

### Need to reset everything?

```bash
# WARNING: Deletes all data!
docker compose down -v
docker compose up -d --build
```

---

## 📁 File Structure

```
docker/
├── Dockerfile.vscode           # Main Docker image
├── docker-compose.yml          # Service orchestration
├── start-services.sh          # Startup script
├── build-extension.sh         # Extension build script
├── Makefile                   # Convenience commands
├── .env.example              # Environment template
├── README.md                 # Full documentation
├── QUICKSTART.md             # Quick start guide
└── EXTENSION_DOCKER_SETUP.md # Implementation details

vscode-extension/
├── src/                      # Extension source code
├── out/                      # Compiled JavaScript
├── package.json              # Extension manifest
└── aider-vscode-0.1.0.vsix  # Packaged extension
```

---

## 🔑 Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key

**Optional:**
- `CODE_SERVER_PASSWORD` - Code-Server password (default: aider)
- `ANTHROPIC_API_KEY` - Claude API key
- `AIDER_MODEL` - AI model to use

---

## 💡 Pro Tips

1. **Use the Makefile**: It simplifies common tasks
2. **Check health regularly**: `make health` shows all service status
3. **View logs**: `make logs` helps debug issues
4. **Backup workspace**: `make backup-workspace` before major changes
5. **Use secrets generator**: `./generate-secrets.sh` for production

---

## 📚 More Documentation

- **Full Setup Guide**: `docker/README.md`
- **Quick Start**: `docker/QUICKSTART.md`
- **Implementation Details**: `docker/EXTENSION_DOCKER_SETUP.md`
- **Troubleshooting**: `docker/TROUBLESHOOTING.md`

---

## 🎯 Key Features

✨ **Pre-installed Extension**: No manual installation needed  
⚙️ **Auto-configured**: Settings configured on startup  
🚀 **One Command Setup**: `docker compose up -d --build`  
🔄 **Easy Updates**: Rebuild with one command  
📖 **Great Documentation**: Comprehensive guides included  

---

**Need help?** Check the full documentation or open an issue!
