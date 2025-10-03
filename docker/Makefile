.PHONY: help build up down restart logs clean ps health

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs (use 'make logs SERVICE=code-server' for specific service)
	@if [ -z "$(SERVICE)" ]; then \
		docker-compose logs -f; \
	else \
		docker-compose logs -f $(SERVICE); \
	fi

clean: ## Stop and remove all containers, networks, and volumes (WARNING: deletes data!)
	@echo "WARNING: This will delete all data in volumes!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "All containers, networks, and volumes removed."; \
	else \
		echo "Cancelled."; \
	fi

ps: ## Show running containers
	docker-compose ps

health: ## Check health of all services
	@echo "Checking service health..."
	@echo ""
	@echo "Code-Server:"
	@curl -s http://localhost:8443 > /dev/null && echo "  ✓ Running on http://localhost:8443" || echo "  ✗ Not responding"
	@echo ""
	@echo "Aider API:"
	@curl -s http://localhost:5000/api/health > /dev/null && echo "  ✓ Running on http://localhost:5000" || echo "  ✗ Not responding"
	@echo ""
	@echo "Supabase API:"
	@curl -s http://localhost:8000 > /dev/null && echo "  ✓ Running on http://localhost:8000" || echo "  ✗ Not responding"
	@echo ""
	@echo "PostgreSQL:"
	@docker exec docker-supabase-db-1 pg_isready -U postgres > /dev/null 2>&1 && echo "  ✓ Running on localhost:5432" || echo "  ✗ Not responding"

shell: ## Open a shell in the code-server container
	docker exec -it docker-code-server-1 /bin/bash

env: ## Create .env file from template
	@if [ -f .env ]; then \
		echo ".env file already exists. Not overwriting."; \
	else \
		cp .env.example .env; \
		echo ".env file created. Please edit it and add your API keys."; \
	fi

secrets: ## Generate secure secrets for production
	./generate-secrets.sh

status: ## Show status of supervisor services
	docker exec -it docker-code-server-1 supervisorctl status

test: ## Run validation tests
	./test-setup.sh

backup-workspace: ## Backup workspace volume to workspace-backup.tar.gz
	docker run --rm -v docker_workspace:/data -v $(PWD):/backup ubuntu tar czf /backup/workspace-backup.tar.gz -C /data .
	@echo "Workspace backed up to workspace-backup.tar.gz"

restore-workspace: ## Restore workspace from workspace-backup.tar.gz
	@if [ ! -f workspace-backup.tar.gz ]; then \
		echo "Error: workspace-backup.tar.gz not found"; \
		exit 1; \
	fi
	docker run --rm -v docker_workspace:/data -v $(PWD):/backup ubuntu tar xzf /backup/workspace-backup.tar.gz -C /data
	@echo "Workspace restored from workspace-backup.tar.gz"
