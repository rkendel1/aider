#!/bin/bash

# GitHub Copilot + Aider - Quick Build and Run Script
# This script provides a convenient way to build and run the integrated container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Container and image names
IMAGE_NAME="code-server-aider"
CONTAINER_NAME="code-server-aider-container"

# Print colored message
print_msg() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_header() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}======================================${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Change to repository root
cd "$(dirname "$0")/../.."
REPO_ROOT=$(pwd)
print_msg "Repository root: $REPO_ROOT"

# Function to build the image
build_image() {
    print_header "Building Docker Image"
    print_msg "This may take several minutes..."
    
    docker build -f docker/Dockerfile.copilot -t "$IMAGE_NAME" .
    
    if [ $? -eq 0 ]; then
        print_msg "Image built successfully: $IMAGE_NAME"
    else
        print_error "Failed to build image"
        exit 1
    fi
}

# Function to stop and remove existing container
cleanup_container() {
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_msg "Removing existing container: $CONTAINER_NAME"
        docker rm -f "$CONTAINER_NAME" > /dev/null 2>&1
    fi
}

# Function to run the container
run_container() {
    print_header "Starting Container"
    
    # Check for .env file
    if [ -f "docker/copilot-integration/.env" ]; then
        print_msg "Using .env file from docker/copilot-integration/.env"
        ENV_FILE="docker/copilot-integration/.env"
    elif [ -f ".env" ]; then
        print_msg "Using .env file from repository root"
        ENV_FILE=".env"
    else
        print_warn "No .env file found. You may need to set environment variables manually."
        print_warn "Copy docker/copilot-integration/.env.example to .env and fill in your API keys."
        ENV_FILE=""
    fi
    
    # Create workspace directory if it doesn't exist
    mkdir -p "$REPO_ROOT/workspace"
    
    # Build docker run command
    RUN_CMD="docker run -d \
        --name $CONTAINER_NAME \
        -p 8080:8080 \
        -p 5000:5000 \
        -v $REPO_ROOT/workspace:/workspace"
    
    # Add env file if it exists
    if [ -n "$ENV_FILE" ]; then
        RUN_CMD="$RUN_CMD --env-file $ENV_FILE"
    fi
    
    # Add default password if no env file
    if [ -z "$ENV_FILE" ]; then
        RUN_CMD="$RUN_CMD -e PASSWORD=aider"
        print_warn "Using default password 'aider' - please change for production!"
    fi
    
    RUN_CMD="$RUN_CMD $IMAGE_NAME"
    
    # Run the container
    eval $RUN_CMD
    
    if [ $? -eq 0 ]; then
        print_msg "Container started successfully: $CONTAINER_NAME"
        print_msg ""
        print_msg "Waiting for services to start..."
        sleep 5
        
        print_header "Access Information"
        echo -e "  ${GREEN}Code Server:${NC} http://localhost:8080"
        echo -e "  ${GREEN}Aider API:${NC}   http://localhost:5000"
        echo -e ""
        if [ -n "$ENV_FILE" ]; then
            echo -e "  ${GREEN}Password:${NC}    Check your .env file (PASSWORD variable)"
        else
            echo -e "  ${GREEN}Password:${NC}    aider (default)"
        fi
        echo -e ""
        print_msg "To view logs: docker logs -f $CONTAINER_NAME"
        print_msg "To access shell: docker exec -it $CONTAINER_NAME bash"
    else
        print_error "Failed to start container"
        exit 1
    fi
}

# Function to show logs
show_logs() {
    print_header "Container Logs"
    docker logs -f "$CONTAINER_NAME"
}

# Function to stop container
stop_container() {
    print_header "Stopping Container"
    docker stop "$CONTAINER_NAME"
    print_msg "Container stopped"
}

# Function to show status
show_status() {
    print_header "Container Status"
    
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_msg "Container is running"
        echo ""
        docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        print_msg "Health check:"
        curl -s http://localhost:5000/api/health > /dev/null 2>&1 && \
            echo -e "  ${GREEN}✓${NC} Aider API is responding" || \
            echo -e "  ${RED}✗${NC} Aider API is not responding"
        
        curl -s http://localhost:8080 > /dev/null 2>&1 && \
            echo -e "  ${GREEN}✓${NC} Code Server is responding" || \
            echo -e "  ${RED}✗${NC} Code Server is not responding"
    else
        print_warn "Container is not running"
    fi
}

# Main menu
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build        Build the Docker image"
    echo "  run          Run the container (builds if needed)"
    echo "  rebuild      Rebuild image and restart container"
    echo "  stop         Stop the running container"
    echo "  restart      Restart the container"
    echo "  logs         Show container logs"
    echo "  status       Show container status"
    echo "  clean        Remove container and image"
    echo "  shell        Open shell in running container"
    echo ""
    echo "Examples:"
    echo "  $0 build              # Build the image"
    echo "  $0 run                # Start the container"
    echo "  $0 rebuild            # Rebuild and restart"
    echo "  $0 logs               # Show logs"
}

# Process command
case "$1" in
    build)
        build_image
        ;;
    run)
        # Check if image exists
        if ! docker images --format '{{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
            print_msg "Image not found, building..."
            build_image
        fi
        cleanup_container
        run_container
        ;;
    rebuild)
        cleanup_container
        build_image
        run_container
        ;;
    stop)
        stop_container
        ;;
    restart)
        stop_container
        sleep 2
        run_container
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        print_header "Cleaning Up"
        cleanup_container
        docker rmi "$IMAGE_NAME" > /dev/null 2>&1 || true
        print_msg "Cleanup complete"
        ;;
    shell)
        print_msg "Opening shell in container..."
        docker exec -it "$CONTAINER_NAME" bash
        ;;
    "")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
