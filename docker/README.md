# Aider with Code-Server, Supabase, and Caching

This Docker setup provides a complete development environment with:
- **Code-Server**: VS Code in your browser
- **Aider API**: AI pair programming backend
- **Supabase**: Open-source Firebase alternative (database, auth, storage, realtime)
- **Persistent Volumes**: Data persistence across container restarts
- **Caching**: Reduced token usage through intelligent caching

## Quick Start

### 1. Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- At least 4GB RAM available for Docker
- An OpenAI API key (or other supported AI provider)

### 2. Setup

1. **Clone the repository** (if not already done):
   ```bash
   cd /path/to/aider
   ```

2. **Configure environment variables**:
   ```bash
   cd docker
   cp .env.example .env
   ```

3. **Edit `.env` file** with your settings:
   ```bash
   # Required: Add your OpenAI API key
   OPENAI_API_KEY=sk-...
   
   # Optional: Set a secure password for code-server
   CODE_SERVER_PASSWORD=your-secure-password
   
   # Optional: Configure Supabase passwords for production
   POSTGRES_PASSWORD=secure-postgres-password
   JWT_SECRET=$(openssl rand -base64 32)
   ```

### 3. Build and Start

```bash
cd docker
docker compose up -d --build
```

**Note**: The first build will take longer as it needs to build the VS Code extension and Docker images. The extension is built automatically as part of the process.

If you prefer to use the Makefile:
```bash
make build    # Builds extension and Docker images
make up       # Starts all services
```

This will:
- Build the VS Code extension from source
- Build the aider+code-server container with the extension pre-installed
- Start Supabase services (PostgreSQL, Auth, REST API, Realtime, Storage)
- Create persistent volumes for data storage
- Start both code-server and aider API server

### 4. Access Services

- **Code-Server**: http://localhost:8443
  - Password: Value of `CODE_SERVER_PASSWORD` from `.env` (default: `aider`)
  
- **Aider API**: http://localhost:5000
  - Health check: http://localhost:5000/api/health
  
- **Supabase API**: http://localhost:8000
  - PostgreSQL: localhost:5432
  - Supabase Studio: Not included (use Supabase CLI locally if needed)

### 5. Using Aider in Code-Server

Once code-server is running:

1. **Open your project**:
   - Your project files should be in the `/workspace` directory
   - You can mount your local project: See "Custom Project Mount" below

2. **The Aider extension is pre-installed**:
   - The extension is automatically built and installed during the Docker image build
   - It's pre-configured to connect to `http://localhost:5000`
   - No manual installation or configuration needed!

3. **Start using Aider**:
   - Click the Aider icon in the Activity Bar (left sidebar)
   - Start chatting with Aider!

**Note**: If you need to verify the extension is installed:
```bash
docker exec -it docker-code-server-1 code-server --list-extensions
```
You should see `aider.aider-vscode` in the output.

## Building from Source

The VS Code extension is built as part of the Docker image build process. The workflow is:

1. **Extension is built outside Docker** (in your host environment):
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   npm run package
   ```
   This creates `aider-vscode-0.1.0.vsix`

2. **Docker build copies and installs the .vsix**:
   ```bash
   cd docker
   docker compose build
   ```

**Automated Build**: The Makefile automates this for you:
```bash
make build    # Runs build-extension.sh, then docker compose build
make up       # Starts all services
```

**Manual Build**: If you prefer to build manually:
```bash
./build-extension.sh    # Builds the VS Code extension
docker compose build    # Builds Docker images with the extension
docker compose up -d    # Starts services
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         code-server + aider-api                │    │
│  │  ┌──────────────┐    ┌──────────────────┐     │    │
│  │  │ Code-Server  │    │   Aider API      │     │    │
│  │  │   (VS Code)  │───▶│   (Flask)        │     │    │
│  │  │   :8443      │    │   :5000          │     │    │
│  │  └──────────────┘    └──────────────────┘     │    │
│  └────────────────────────────────────────────────┘    │
│                           │                             │
│  ┌────────────────────────┼─────────────────────────┐  │
│  │                 Supabase Stack                    │  │
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

Persistent Volumes:
  - workspace: Your project files
  - aider-cache: Aider cache for reduced token usage
  - code-server-config: Code-server settings and extensions
  - supabase-db: PostgreSQL database data
  - supabase-storage: File storage data
```

## Persistent Volumes

The setup includes several persistent volumes:

- **workspace**: Your project files (mounted at `/workspace`)
- **aider-cache**: Aider's cache directory (reduces token usage by caching API responses)
- **code-server-config**: Code-server configuration and installed extensions
- **supabase-db**: PostgreSQL database data
- **supabase-storage**: Supabase storage files

Data in these volumes persists across container restarts and rebuilds.

## Caching Strategy

Aider implements caching to minimize token usage:

### How Caching Works

1. **Response Caching**: API responses are cached based on request parameters
2. **Model Context Caching**: Recent conversation context is cached
3. **File Content Caching**: File content hashes are cached to avoid re-sending unchanged files

### Cache Configuration

The cache is configured via environment variables in `.env`:

```bash
# Cache directory (persisted in volume)
AIDER_CACHE_DIR=/home/coder/.aider/cache

# Disable update checks (recommended in containers)
AIDER_NO_CHECK_UPDATE=1
```

### Cache Management

- **View cache size**: `docker exec -it docker-code-server-1 du -sh /home/coder/.aider/cache`
- **Clear cache**: `docker exec -it docker-code-server-1 rm -rf /home/coder/.aider/cache/*`
- **Cache location**: Stored in the `aider-cache` Docker volume

## Supabase Integration

### What is Supabase?

Supabase provides:
- **PostgreSQL Database**: Powerful open-source database
- **Authentication**: User management and auth
- **REST API**: Auto-generated from your database schema
- **Realtime**: Subscribe to database changes
- **Storage**: File storage with access control

### Accessing Supabase

1. **Database Connection**:
   ```bash
   psql -h localhost -p 5432 -U postgres
   # Password: Value from POSTGRES_PASSWORD in .env
   ```

2. **REST API**:
   ```bash
   curl http://localhost:8000/rest/v1/
   ```

3. **From Code**:
   ```javascript
   // In your application code
   const supabaseUrl = 'http://localhost:8000'
   const supabaseKey = process.env.SUPABASE_ANON_KEY
   ```

### Supabase Configuration

All Supabase services are configured through environment variables in `.env`:

- `POSTGRES_PASSWORD`: PostgreSQL password
- `JWT_SECRET`: Secret for JWT tokens (change for production!)
- `SUPABASE_ANON_KEY`: Anonymous access key
- `SUPABASE_SERVICE_KEY`: Service role key (admin access)

### Using Supabase CLI

The code-server container includes the Supabase CLI for database management and migrations:

1. **Access the container**:
   ```bash
   docker exec -it docker-code-server-1 /bin/bash
   ```

2. **Check Supabase CLI version**:
   ```bash
   supabase --version
   ```

3. **Initialize a Supabase project** (within the container):
   ```bash
   cd /workspace
   supabase init
   ```

4. **Create a migration**:
   ```bash
   supabase migration new create_users_table
   ```

5. **Link to your Supabase instance**:
   ```bash
   # Using the local Docker Supabase
   supabase link --project-ref local --password ${POSTGRES_PASSWORD}
   ```

6. **Apply migrations**:
   ```bash
   supabase db push
   ```

7. **Generate TypeScript types from your schema**:
   ```bash
   supabase gen types typescript --local > types/database.types.ts
   ```

**Note**: The Supabase CLI is pre-installed in the code-server container and can be used to manage your database schema, run migrations, and generate types for your application.

## Advanced Usage

### Custom Project Mount

To work on a specific project from your host machine:

```bash
cd docker
docker-compose down
# Edit docker-compose.yml and change the workspace volume:
# From:
#   - workspace:/workspace
# To:
#   - /path/to/your/project:/workspace
docker-compose up -d
```

### Running Only Specific Services

```bash
# Start only code-server and aider (no Supabase)
docker-compose up -d code-server

# Start only Supabase services
docker-compose up -d supabase-db supabase-kong supabase-auth supabase-rest
```

### Custom Aider Configuration

Create a startup script in your workspace:

```bash
# In /workspace/.aider/start_aider_api.py
# This will be used by supervisor to start aider
```

Or modify the supervisor configuration in `docker/supervisord.conf`.

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f code-server
docker-compose logs -f supabase-db

# Aider API logs (via supervisor)
docker exec -it docker-code-server-1 tail -f /home/coder/.config/supervisor/aider-api-*.log
```

## Troubleshooting

### Code-Server Not Accessible

1. Check if container is running:
   ```bash
   docker-compose ps
   ```

2. Check logs:
   ```bash
   docker-compose logs code-server
   ```

3. Verify port is not in use:
   ```bash
   lsof -i :8443  # On Mac/Linux
   netstat -ano | findstr :8443  # On Windows
   ```

### Aider API Not Responding

1. Check if API is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Check supervisor status:
   ```bash
   docker exec -it docker-code-server-1 supervisorctl status
   ```

3. View API logs:
   ```bash
   docker exec -it docker-code-server-1 supervisorctl tail -f aider-api
   ```

### Supabase Connection Issues

1. Check if database is ready:
   ```bash
   docker-compose logs supabase-db
   ```

2. Test database connection:
   ```bash
   docker exec -it docker-supabase-db-1 psql -U postgres -c "SELECT 1"
   ```

3. Verify all services are healthy:
   ```bash
   docker-compose ps
   ```

### Cache Not Working

1. Verify cache directory exists:
   ```bash
   docker exec -it docker-code-server-1 ls -la /home/coder/.aider/cache
   ```

2. Check environment variables:
   ```bash
   docker exec -it docker-code-server-1 env | grep AIDER
   ```

3. Check volume mount:
   ```bash
   docker volume inspect docker_aider-cache
   ```

### Reset Everything

```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes (WARNING: This deletes all data!)
docker-compose down -v

# Rebuild and start fresh
docker-compose up -d --build
```

## Security Considerations

### For Development

The default configuration is suitable for local development.

### For Production

If deploying to production:

1. **Change all passwords and secrets**:
   ```bash
   CODE_SERVER_PASSWORD=strong-password
   POSTGRES_PASSWORD=strong-postgres-password
   JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Generate new Supabase keys**:
   - Use Supabase CLI to generate proper JWT keys
   - Update `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`

3. **Use HTTPS**:
   - Configure SSL certificates for code-server
   - Use a reverse proxy (nginx, Traefik) with SSL

4. **Network Security**:
   - Don't expose all ports publicly
   - Use a firewall
   - Consider using a VPN

5. **Update regularly**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Resource Management

### Memory Usage

Typical memory usage:
- code-server + aider: ~500MB-1GB
- Supabase stack: ~1-2GB
- Total: ~2-3GB

Adjust Docker resources in Docker Desktop settings if needed.

### Disk Usage

```bash
# Check volume sizes
docker system df -v

# Clean up unused resources
docker system prune -a --volumes
```

## Contributing

Found an issue or want to improve this setup? Contributions are welcome!

1. Test your changes locally
2. Update this README if needed
3. Submit a pull request

## License

This Docker setup is part of the Aider project. See the main repository LICENSE file.
