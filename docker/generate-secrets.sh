#!/bin/bash
# Generate secure secrets for production deployment

set -e

echo "======================================"
echo "Secure Secrets Generator"
echo "======================================"
echo ""
echo "This script generates secure random secrets for your production deployment."
echo "Copy these values to your .env file."
echo ""

# Function to generate a random secret
generate_secret() {
    openssl rand -base64 32 | tr -d '\n'
}

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "Error: openssl is required but not installed."
    echo "Please install openssl and try again."
    exit 1
fi

echo "Generated Secrets:"
echo "=================="
echo ""

echo "# Code-Server Password (minimum 8 characters recommended)"
CODE_PASSWORD=$(openssl rand -base64 12 | tr -d '\n')
echo "CODE_SERVER_PASSWORD=$CODE_PASSWORD"
echo ""

echo "# PostgreSQL Password"
POSTGRES_PASSWORD=$(generate_secret)
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo ""

echo "# JWT Secret (must be at least 32 characters)"
JWT_SECRET=$(generate_secret)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

echo "======================================"
echo "IMPORTANT NOTES:"
echo "======================================"
echo ""
echo "1. Copy these values to your .env file"
echo "2. Keep these secrets secure and never commit them to version control"
echo "3. For SUPABASE_ANON_KEY and SUPABASE_SERVICE_KEY, you should use"
echo "   Supabase CLI or generate proper JWT tokens with your JWT_SECRET"
echo ""
echo "To generate Supabase JWT tokens:"
echo "  npm install -g supabase"
echo "  supabase init"
echo "  supabase start"
echo ""
echo "Or use the default demo keys for development (NOT for production!)"
echo ""
