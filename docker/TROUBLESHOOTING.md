# Troubleshooting Guide

Common issues and solutions for the Aider Docker setup.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Connection Issues](#connection-issues)
- [Performance Issues](#performance-issues)
- [Data and Volume Issues](#data-and-volume-issues)
- [Supabase Issues](#supabase-issues)
- [Cache Issues](#cache-issues)

## Installation Issues

### Docker Compose version error

**Error**: `The Compose file './docker-compose.yml' is invalid...`

**Solution**: Make sure you're using Docker Compose v2.0+:
```bash
docker compose version
```

If you have an older version, update Docker Desktop or install the latest Docker Compose plugin.

### Build fails with "context" error

**Error**: `unable to prepare context: path "..." not found`

**Solution**: Make sure you're in the `docker/` directory when running commands:
```bash
cd /path/to/aider/docker
docker compose up -d
```

### Permission denied errors during build

**Error**: `permission denied while trying to connect to the Docker daemon socket`

**Solution**: 
1. Add your user to the docker group:
   ```bash
   sudo usermod -aG docker $USER
   ```
2. Log out and back in
3. Or run with sudo (not recommended for production)

## Connection Issues

### Cannot access code-server at localhost:8443

**Symptoms**: Browser shows "This site can't be reached" or connection timeout.

**Diagnosis**:
```bash
# Check if container is running
docker compose ps

# Check if port is accessible
curl http://localhost:8443

# View logs
docker compose logs code-server
```

**Solutions**:

1. **Container not running**: Start it
   ```bash
   docker compose up -d code-server
   ```

2. **Port conflict**: Another service is using port 8443
   ```bash
   # Find what's using the port
   sudo lsof -i :8443  # Linux/Mac
   netstat -ano | findstr :8443  # Windows
   
   # Change the port in docker-compose.yml
   # From: "8443:8443"
   # To:   "9443:8443"
   docker compose up -d
   ```

3. **Firewall blocking**: Check firewall settings
   ```bash
   # Linux
   sudo ufw allow 8443
   
   # macOS
   # System Preferences → Security & Privacy → Firewall → Firewall Options
   ```

### Aider API not responding

**Symptoms**: `curl http://localhost:5000/api/health` fails or times out.

**Diagnosis**:
```bash
# Check supervisor status
docker exec -it docker-code-server-1 supervisorctl status

# View API logs
docker exec -it docker-code-server-1 supervisorctl tail -f aider-api

# Check if process is running
docker exec -it docker-code-server-1 ps aux | grep python
```

**Solutions**:

1. **API not started**: Restart supervisor
   ```bash
   docker exec -it docker-code-server-1 supervisorctl restart aider-api
   ```

2. **API key not set**: Check environment
   ```bash
   docker exec -it docker-code-server-1 env | grep OPENAI_API_KEY
   ```
   
   If empty, set it in `.env` file and restart:
   ```bash
   docker compose restart code-server
   ```

3. **Python import errors**: Rebuild the container
   ```bash
   docker compose up -d --build
   ```

### VS Code Extension can't connect to Aider

**Symptoms**: Extension shows "Connection failed" or similar error.

**Solutions**:

1. **Check API is running**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Verify extension settings**:
   - Open Settings in code-server (Ctrl+,)
   - Search for "Aider"
   - Ensure `aider.apiEndpoint` is set to `http://localhost:5000`

3. **Check browser console**:
   - Open Developer Tools (F12)
   - Look for CORS or network errors
   - If you see CORS errors, this is a bug - the API should have CORS enabled

## Performance Issues

### Container is slow or unresponsive

**Diagnosis**:
```bash
# Check resource usage
docker stats

# Check container logs
docker compose logs --tail=100
```

**Solutions**:

1. **Increase Docker resources**:
   - Docker Desktop → Settings → Resources
   - Increase CPU and Memory allocation
   - Recommended: 4 CPU cores, 4GB RAM minimum

2. **Too many services running**:
   ```bash
   # Stop Supabase if not needed
   docker compose stop supabase-db supabase-kong supabase-auth supabase-rest supabase-realtime supabase-storage
   ```

3. **Disk I/O issues**:
   - Use Docker volumes instead of bind mounts for better performance
   - Clear unused Docker resources:
     ```bash
     docker system prune -a
     ```

### Code-server feels laggy

**Solutions**:

1. **Disable unnecessary extensions** in code-server

2. **Use a faster connection** if accessing remotely

3. **Reduce browser zoom** (sometimes helps with rendering)

4. **Check network latency** (for remote access):
   ```bash
   ping localhost  # Should be < 1ms for local
   ```

## Data and Volume Issues

### Changes not persisting after restart

**Symptoms**: Files or settings disappear after `docker compose down`.

**Diagnosis**:
```bash
# Check volumes
docker volume ls | grep docker

# Inspect a volume
docker volume inspect docker_workspace
```

**Solutions**:

1. **Using wrong directory**: Make sure you're working in `/workspace`
   ```bash
   docker exec -it docker-code-server-1 pwd
   # Should show: /workspace
   ```

2. **Volume not mounted**: Check docker-compose.yml has volume mounts:
   ```yaml
   volumes:
     - workspace:/workspace
   ```

3. **Accidentally removed volumes**:
   ```bash
   # Never use -v flag unless you want to delete data!
   # Wrong: docker compose down -v
   # Right: docker compose down
   ```

### Cannot write to workspace

**Symptoms**: "Permission denied" when saving files.

**Solutions**:

1. **Check ownership**:
   ```bash
   docker exec -it docker-code-server-1 ls -la /workspace
   ```
   
   Should be owned by `coder` user.

2. **Fix permissions**:
   ```bash
   docker exec -it docker-code-server-1 sudo chown -R coder:coder /workspace
   ```

### Lost all my data!

**Prevention**:
```bash
# NEVER use -v flag unless you're sure
docker compose down  # Safe - keeps volumes
docker compose down -v  # DANGEROUS - deletes volumes!
```

**Recovery**:
If volumes are deleted, data is unrecoverable. Always backup important data.

**Backup strategy**:
```bash
# Backup workspace
docker run --rm -v docker_workspace:/data -v $(pwd):/backup ubuntu tar czf /backup/workspace-backup.tar.gz -C /data .

# Restore workspace
docker run --rm -v docker_workspace:/data -v $(pwd):/backup ubuntu tar xzf /backup/workspace-backup.tar.gz -C /data
```

## Supabase Issues

### Cannot connect to PostgreSQL

**Symptoms**: `psql: could not connect to server` or connection refused.

**Diagnosis**:
```bash
# Check if database is healthy
docker compose ps supabase-db

# Check logs
docker compose logs supabase-db

# Test connection
docker exec -it docker-supabase-db-1 psql -U postgres -c "SELECT 1"
```

**Solutions**:

1. **Wait for database to be ready**:
   ```bash
   # Wait for health check to pass
   docker compose ps
   # Status should show "healthy"
   ```

2. **Port conflict**:
   - Change PostgreSQL port in docker-compose.yml
   - From: `"5432:5432"`
   - To: `"5433:5432"`

3. **Wrong password**:
   - Check `.env` file for `POSTGRES_PASSWORD`
   - Use that password when connecting

### Supabase API returns 404

**Symptoms**: API requests to `http://localhost:8000` return 404.

**Diagnosis**:
```bash
# Check Kong is running
docker compose ps supabase-kong

# Check Kong logs
docker compose logs supabase-kong

# Verify Kong config
docker exec -it docker-supabase-kong-1 cat /var/lib/kong/kong.yml
```

**Solutions**:

1. **Kong not configured**: Check `supabase/kong.yml` exists and is valid

2. **Service dependencies**: Ensure all Supabase services are running:
   ```bash
   docker compose ps
   ```

3. **Restart Kong**:
   ```bash
   docker compose restart supabase-kong
   ```

### Supabase Auth not working

**Solutions**:

1. **Check JWT secret**: Make sure `JWT_SECRET` in `.env` is at least 32 characters

2. **Regenerate keys**:
   ```bash
   openssl rand -base64 32
   # Copy output to JWT_SECRET in .env
   docker compose restart
   ```

## Cache Issues

### Aider not using cache / high token usage

**Diagnosis**:
```bash
# Check cache directory exists
docker exec -it docker-code-server-1 ls -la /home/coder/.aider/cache

# Check environment variable
docker exec -it docker-code-server-1 env | grep AIDER_CACHE_DIR

# Check cache size
docker exec -it docker-code-server-1 du -sh /home/coder/.aider/cache
```

**Solutions**:

1. **Cache directory not created**:
   ```bash
   docker exec -it docker-code-server-1 mkdir -p /home/coder/.aider/cache
   docker exec -it docker-code-server-1 chown -R coder:coder /home/coder/.aider
   ```

2. **Volume not mounted**: Check docker-compose.yml:
   ```yaml
   volumes:
     - aider-cache:/home/coder/.aider
   ```

3. **Environment variable not set**: Check `.env` file has:
   ```
   AIDER_CACHE_DIR=/home/coder/.aider/cache
   ```

### Cache is too large

**Solutions**:

1. **Clear cache**:
   ```bash
   docker exec -it docker-code-server-1 rm -rf /home/coder/.aider/cache/*
   ```

2. **Limit cache size**: Currently not implemented, but you can periodically clean it

## Build Issues

### Docker build is slow

**Symptoms**: Building the Docker image takes a very long time.

**Solutions**:

1. **Use Docker build cache**: The optimized Dockerfiles now combine RUN commands to reduce layers and improve cache utilization
   ```bash
   # Build with cache
   docker compose build
   
   # If cache is corrupted, rebuild without cache
   docker compose build --no-cache
   ```

2. **Parallel builds**: Use BuildKit for faster parallel builds
   ```bash
   # Enable BuildKit (add to .env or .bashrc)
   export DOCKER_BUILDKIT=1
   export COMPOSE_DOCKER_CLI_BUILD=1
   
   docker compose build
   ```

3. **Optimize context**: The `.dockerignore` file now excludes unnecessary files like tests, documentation, and git history

### Out of disk space during build

**Symptoms**: `no space left on device` error during build.

**Diagnosis**:
```bash
# Check Docker disk usage
docker system df

# Check available disk space
df -h
```

**Solutions**:

1. **Clean up Docker resources**:
   ```bash
   # Remove unused images
   docker image prune -a
   
   # Remove unused volumes
   docker volume prune
   
   # Remove build cache
   docker builder prune
   
   # Full cleanup (WARNING: removes all unused resources)
   docker system prune -a --volumes
   ```

2. **Increase Docker storage**: Docker Desktop → Settings → Resources → Disk image size

## Supabase CLI Issues

### Supabase CLI not found

**Symptoms**: `supabase: command not found` when running Supabase CLI commands.

**Diagnosis**:
```bash
# Check if CLI is installed
docker exec -it docker-code-server-1 which supabase

# Check PATH
docker exec -it docker-code-server-1 echo $PATH
```

**Solutions**:

1. **Rebuild the container**: The CLI should be installed automatically
   ```bash
   docker compose up -d --build code-server
   ```

2. **Manual installation** (if needed):
   ```bash
   docker exec -it docker-code-server-1 /bin/bash
   
   # Inside container
   ARCH=$(uname -m)
   if [ "$ARCH" = "x86_64" ]; then
       SUPABASE_ARCH="linux-amd64"
   else
       SUPABASE_ARCH="linux-arm64"
   fi
   wget -qO supabase.tar.gz "https://github.com/supabase/cli/releases/latest/download/supabase_${SUPABASE_ARCH}.tar.gz"
   tar -xzf supabase.tar.gz -C /usr/local/bin
   rm supabase.tar.gz
   ```

3. **Verify installation**:
   ```bash
   docker exec -it docker-code-server-1 supabase --version
   ```

### Supabase CLI connection errors

**Symptoms**: CLI commands fail to connect to the database.

**Solutions**:

1. **Check database is running**:
   ```bash
   docker compose ps supabase-db
   ```

2. **Use correct connection string**: The CLI should connect to `localhost:5432` from within the container, or use the service name `supabase-db` within the Docker network

3. **Check authentication**: Use the correct password from `.env`:
   ```bash
   docker exec -it docker-code-server-1 env | grep POSTGRES_PASSWORD
   ```

## General Debugging Tips

### View all logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f code-server
docker compose logs -f supabase-db

# Last 100 lines
docker compose logs --tail=100

# Follow new logs
docker compose logs -f --tail=0
```

### Inspect a container

```bash
# Get a shell
docker exec -it docker-code-server-1 /bin/bash

# Check processes
docker exec -it docker-code-server-1 ps aux

# Check network
docker exec -it docker-code-server-1 netstat -tulpn

# Check environment
docker exec -it docker-code-server-1 env
```

### Reset everything

```bash
# Stop all containers
docker compose down

# Remove volumes (WARNING: DATA LOSS!)
docker compose down -v

# Remove images
docker compose down --rmi all

# Full clean
docker system prune -a --volumes

# Start fresh
docker compose up -d --build
```

### Check Docker daemon

```bash
# Docker info
docker info

# Docker version
docker version

# Restart Docker
# macOS/Windows: Restart Docker Desktop
# Linux:
sudo systemctl restart docker
```

## Still Having Issues?

1. **Check the logs** - Most issues show up in logs
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Output of `docker compose ps`
   - Relevant logs
   - Steps to reproduce
   - Your environment (OS, Docker version)

## Useful Commands Reference

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart a service
docker compose restart code-server

# Rebuild a service
docker compose up -d --build code-server

# Check status
docker compose ps

# Execute command in container
docker exec -it docker-code-server-1 <command>

# View supervisor status
docker exec -it docker-code-server-1 supervisorctl status

# Restart aider API
docker exec -it docker-code-server-1 supervisorctl restart aider-api

# Check volumes
docker volume ls

# Inspect volume
docker volume inspect docker_workspace

# Check disk usage
docker system df

# Clean up
docker system prune
```
