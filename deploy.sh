#!/bin/bash
DEPLOY_DIR="/var/www/snippetslibrary"
cd $DEPLOY_DIR

# Ensure bun is in PATH
export PATH="$HOME/.bun/bin:/usr/local/bin:$PATH"

# Verify bun is available
if ! command -v bun &> /dev/null; then
  echo "Error: bun is not installed or not in PATH"
  exit 1
fi

# Install dependencies and build the project
echo "Installing dependencies and building the project..."
bun install
bun run build
pm2 restart snippetslibrary || pm2 start "bun run start:prod" --name snippetslibrary