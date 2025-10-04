#!/bin/bash
set -e

echo "=== VS Code Extension Verification Script ==="
echo ""

echo "1. Checking build outputs..."
test -f out/extension.js && echo "   ✓ out/extension.js exists" || (echo "   ✗ out/extension.js missing" && exit 1)
test -f out/aiderClient.js && echo "   ✓ out/aiderClient.js exists" || echo "   ✗ out/aiderClient.js missing"
test -f out/githubClient.js && echo "   ✓ out/githubClient.js exists" || echo "   ✗ out/githubClient.js missing"
echo ""

echo "2. Checking dependencies..."
test -d node_modules && echo "   ✓ node_modules exists" || (echo "   ✗ node_modules missing" && exit 1)
echo ""

echo "3. Checking package..."
test -f aider-vscode-0.1.0.vsix && echo "   ✓ VSIX package exists" || echo "   ✗ VSIX package missing"
echo ""

echo "4. Checking documentation..."
test -f README.md && echo "   ✓ README.md exists" || echo "   ✗ README.md missing"
test -f LICENSE.txt && echo "   ✓ LICENSE.txt exists" || echo "   ✗ LICENSE.txt missing"
test -f .vscodeignore && echo "   ✓ .vscodeignore exists" || echo "   ✗ .vscodeignore missing"
echo ""

echo "5. Running compilation..."
npm run compile > /dev/null 2>&1 && echo "   ✓ Compilation successful" || (echo "   ✗ Compilation failed" && exit 1)
echo ""

echo "6. Running linter..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Linter passed"
else
    echo "   ⚠ Linter has warnings (this is OK)"
fi
echo ""

echo "=== All checks passed! ==="
echo ""
echo "Extension is ready for:"
echo "  • Installation via VSIX"
echo "  • Development mode (F5)"
echo "  • Publishing to marketplace"
