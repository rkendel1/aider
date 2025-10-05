#!/bin/bash
# Script to build the VS Code extension before Docker build
set -e

echo "================================"
echo "Building Aider VS Code Extension"
echo "================================"

# Navigate to extension directory
cd "$(dirname "$0")/../vscode-extension"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install Node.js and npm first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed, skipping npm install"
fi

# Compile TypeScript
echo "Compiling TypeScript..."
npm run compile

# Package the extension
echo "Packaging extension..."
npm run package

# Verify the .vsix file was created
if ls aider-vscode-*.vsix 1> /dev/null 2>&1; then
    echo "✓ Extension built successfully: $(ls aider-vscode-*.vsix)"
    echo ""
    echo "You can now build the Docker image with:"
    echo "  cd ../docker"
    echo "  docker compose build"
    echo "  # or"
    echo "  make build"
else
    echo "✗ ERROR: Extension package (.vsix) was not created"
    exit 1
fi
