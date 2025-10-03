#!/bin/bash
# Test script to validate the Docker setup

set -e

echo "========================================"
echo "Docker Setup Validation Tests"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_passed=0
test_failed=0

pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((test_passed++))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((test_failed++))
}

info() {
    echo -e "${YELLOW}ℹ INFO${NC}: $1"
}

# Test 1: Check required files exist
echo "Test 1: Checking required files..."
required_files=(
    "docker-compose.yml"
    "Dockerfile.vscode"
    ".env.example"
    "README.md"
    "QUICKSTART.md"
    "Makefile"
    "start-services.sh"
    "start_aider_api_docker.py"
    "supervisord.conf"
    "supabase/kong.yml"
)

cd "$(dirname "$0")"

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        pass "File exists: $file"
    else
        fail "File missing: $file"
    fi
done
echo ""

# Test 2: Validate docker-compose.yml
echo "Test 2: Validating docker-compose.yml..."
if command -v docker &> /dev/null; then
    if docker compose config > /dev/null 2>&1; then
        pass "docker-compose.yml is valid"
    else
        fail "docker-compose.yml has syntax errors"
    fi
else
    info "Docker not available, skipping compose validation"
fi
echo ""

# Test 3: Check Python syntax
echo "Test 3: Validating Python scripts..."
if python -m py_compile start_aider_api_docker.py 2>/dev/null; then
    pass "Python syntax is valid"
else
    fail "Python syntax errors found"
fi
echo ""

# Test 4: Check shell script syntax
echo "Test 4: Validating shell scripts..."
if bash -n start-services.sh; then
    pass "Shell script syntax is valid"
else
    fail "Shell script syntax errors found"
fi
echo ""

# Test 5: Check YAML files
echo "Test 5: Validating YAML files..."
if python -c "import yaml; yaml.safe_load(open('supabase/kong.yml'))" 2>/dev/null; then
    pass "Kong YAML is valid"
else
    fail "Kong YAML has syntax errors"
fi
echo ""

# Test 6: Check Dockerfile syntax (basic)
echo "Test 6: Checking Dockerfile..."
if grep -q "FROM python:3.10-slim-bookworm AS base" Dockerfile.vscode; then
    pass "Dockerfile has correct base image"
else
    fail "Dockerfile base image is incorrect"
fi

if grep -q "ENTRYPOINT.*dumb-init" Dockerfile.vscode; then
    pass "Dockerfile has dumb-init entrypoint"
else
    fail "Dockerfile missing dumb-init entrypoint"
fi
echo ""

# Test 7: Check environment variables in .env.example
echo "Test 7: Checking .env.example..."
required_vars=(
    "CODE_SERVER_PASSWORD"
    "OPENAI_API_KEY"
    "POSTGRES_PASSWORD"
    "JWT_SECRET"
    "AIDER_CACHE_DIR"
)

for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env.example; then
        pass "Environment variable defined: $var"
    else
        fail "Environment variable missing: $var"
    fi
done
echo ""

# Test 8: Check ports in docker-compose
echo "Test 8: Checking exposed ports..."
if grep -q "8443:8443" docker-compose.yml; then
    pass "Code-server port 8443 exposed"
else
    fail "Code-server port 8443 not exposed"
fi

if grep -q "5000:5000" docker-compose.yml; then
    pass "Aider API port 5000 exposed"
else
    fail "Aider API port 5000 not exposed"
fi

if grep -q "5432:5432" docker-compose.yml; then
    pass "PostgreSQL port 5432 exposed"
else
    fail "PostgreSQL port 5432 not exposed"
fi
echo ""

# Test 9: Check volumes configuration
echo "Test 9: Checking volume configuration..."
volumes=(
    "workspace"
    "aider-cache"
    "code-server-config"
    "supabase-db"
    "supabase-storage"
)

for volume in "${volumes[@]}"; do
    if grep -q "${volume}:" docker-compose.yml; then
        pass "Volume configured: $volume"
    else
        fail "Volume missing: $volume"
    fi
done
echo ""

# Test 10: Check supervisord configuration
echo "Test 10: Checking supervisord configuration..."
if grep -q "\[program:code-server\]" supervisord.conf; then
    pass "Supervisord has code-server program"
else
    fail "Supervisord missing code-server program"
fi

if grep -q "\[program:aider-api\]" supervisord.conf; then
    pass "Supervisord has aider-api program"
else
    fail "Supervisord missing aider-api program"
fi
echo ""

# Summary
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "${GREEN}Passed: $test_passed${NC}"
if [ $test_failed -gt 0 ]; then
    echo -e "${RED}Failed: $test_failed${NC}"
    exit 1
else
    echo -e "${GREEN}Failed: 0${NC}"
    echo ""
    echo "All tests passed! ✓"
    exit 0
fi
