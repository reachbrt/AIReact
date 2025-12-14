#!/bin/bash

# AIReact NPM Publishing Script
# Run this script manually to publish all packages to npm
# It will prompt for OTP for each package (2FA required)

set -e

echo "🚀 Publishing @aireact packages to npm..."
echo "================================================"
echo "Make sure you're logged in: npm whoami"
echo "Current user: $(npm whoami 2>/dev/null || echo 'Not logged in')"
echo ""

PACKAGES=(
  "core"
  "chatbot"
  "autosuggest"
  "smartform"
  "analytics"
  "image-caption"
  "emotion-ui"
  "doc-intelligence"
  "predictive-input"
  "smart-notify"
  "voice-actions"
  "smart-datatable"
  "360-spin"
)

# Build all packages first
echo "📦 Building all packages..."
npm run build:packages

echo ""
echo "📤 Publishing packages..."
echo ""

for pkg in "${PACKAGES[@]}"; do
  echo "----------------------------------------"
  echo "Publishing @aireact/$pkg..."
  cd "packages/$pkg"
  npm publish --access public
  cd ../..
  echo "✅ @aireact/$pkg published!"
  echo ""
done

echo "================================================"
echo "🎉 All packages published successfully!"
echo ""
echo "View your packages at:"
echo "https://www.npmjs.com/settings/aireact/packages"

