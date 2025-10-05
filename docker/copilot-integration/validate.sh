#!/bin/bash
# Validation script for GitHub Copilot + Aider integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Copilot + Aider Integration - Validation"
echo "========================================="
echo ""

# Track test results
PASSED=0
FAILED=0

# Test function
test_item() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing: $name ... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Change to repository root
cd "$(dirname "$0")/../.."
REPO_ROOT=$(pwd)

echo "Repository: $REPO_ROOT"
echo ""

# Test 1: Check if Dockerfile exists
test_item "Dockerfile.copilot exists" "test -f docker/Dockerfile.copilot"

# Test 2: Check if start.sh exists
test_item "start.sh exists" "test -f docker/copilot-integration/start.sh"

# Test 3: Check if start.sh is executable
test_item "start.sh is executable" "test -x docker/copilot-integration/start.sh"

# Test 4: Check if run.sh exists
test_item "run.sh exists" "test -f docker/copilot-integration/run.sh"

# Test 5: Check if run.sh is executable
test_item "run.sh is executable" "test -x docker/copilot-integration/run.sh"

# Test 6: Check if settings.json exists
test_item "settings.json exists" "test -f docker/copilot-integration/settings.json"

# Test 7: Validate settings.json is valid JSON
test_item "settings.json is valid JSON" "jq empty docker/copilot-integration/settings.json 2>/dev/null || python3 -m json.tool docker/copilot-integration/settings.json > /dev/null"

# Test 8: Check if .env.example exists
test_item ".env.example exists" "test -f docker/copilot-integration/.env.example"

# Test 9: Check if README.md exists
test_item "README.md exists" "test -f docker/copilot-integration/README.md"

# Test 10: Check if QUICKSTART.md exists
test_item "QUICKSTART.md exists" "test -f docker/copilot-integration/QUICKSTART.md"

# Test 11: Check if docker-compose.yml exists
test_item "docker-compose.yml exists" "test -f docker/copilot-integration/docker-compose.yml"

# Test 12: Check if extension-hooks directory exists
test_item "extension-hooks directory exists" "test -d docker/copilot-integration/extension-hooks"

# Test 13: Check if integration-config.json exists
test_item "integration-config.json exists" "test -f docker/copilot-integration/extension-hooks/integration-config.json"

# Test 14: Validate integration-config.json is valid JSON
test_item "integration-config.json is valid JSON" "jq empty docker/copilot-integration/extension-hooks/integration-config.json 2>/dev/null || python3 -m json.tool docker/copilot-integration/extension-hooks/integration-config.json > /dev/null"

# Test 15: Check if supervisord.conf exists
test_item "supervisord.conf exists" "test -f docker/supervisord.conf"

# Test 16: Dockerfile has required base image
test_item "Dockerfile uses correct base image" "grep -q 'FROM python:3.10-slim-bookworm' docker/Dockerfile.copilot"

# Test 17: Dockerfile installs Node.js
test_item "Dockerfile installs Node.js" "grep -q 'nodejs' docker/Dockerfile.copilot"

# Test 18: Dockerfile installs GitHub CLI
test_item "Dockerfile installs GitHub CLI" "grep -q 'github-cli' docker/Dockerfile.copilot"

# Test 19: Dockerfile installs Supabase CLI
test_item "Dockerfile installs Supabase CLI" "grep -q 'supabase.com/cli/install.sh' docker/Dockerfile.copilot"

# Test 20: Dockerfile installs code-server
test_item "Dockerfile installs code-server" "grep -q 'code-server.dev/install.sh' docker/Dockerfile.copilot"

# Test 21: Dockerfile exposes port 8080
test_item "Dockerfile exposes port 8080" "grep -q 'EXPOSE.*8080' docker/Dockerfile.copilot"

# Test 22: Dockerfile exposes port 5000
test_item "Dockerfile exposes port 5000" "grep -q 'EXPOSE.*5000' docker/Dockerfile.copilot"

# Test 23: start.sh creates integration config
test_item "start.sh creates integration config" "grep -q 'copilot-aider/integration.json' docker/copilot-integration/start.sh"

# Test 24: start.sh installs Copilot extension
test_item "start.sh installs Copilot extension" "grep -q 'GitHub.copilot' docker/copilot-integration/start.sh"

# Test 25: settings.json enables Copilot
test_item "settings.json enables Copilot" "grep -q 'github.copilot.enable' docker/copilot-integration/settings.json"

# Test 26: settings.json configures Aider provider
test_item "settings.json configures Aider provider" "grep -q 'aider.aiProvider.copilot.enabled' docker/copilot-integration/settings.json"

# Test 27: Check Docker is available (for build test)
if command -v docker > /dev/null 2>&1; then
    test_item "Docker is available" "true"
    
    # Optional: Test syntax of Dockerfile
    if command -v hadolint > /dev/null 2>&1; then
        test_item "Dockerfile passes hadolint" "hadolint docker/Dockerfile.copilot"
    fi
else
    echo -e "${YELLOW}WARNING:${NC} Docker not available, skipping Docker-related tests"
fi

# Print summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Build the Docker image:"
    echo "     ./docker/copilot-integration/run.sh build"
    echo ""
    echo "  2. Run the container:"
    echo "     ./docker/copilot-integration/run.sh run"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
