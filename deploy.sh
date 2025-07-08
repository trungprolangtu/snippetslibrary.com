#!/bin/bash

# Exit on error, undefined var, or pipefail
set -euo pipefail

DEPLOY_DIR="/var/www/snippetslibrary"
ENV_FILE="$HOME/.env"
SERVER_ENV="$DEPLOY_DIR/server/.env"
APP_NAME="snippetslibrary"

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log() {
  echo -e "${CYAN}[INFO]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Go to the project directory
log "Switching to project directory: $DEPLOY_DIR"
cd "$DEPLOY_DIR" || error "Failed to cd into $DEPLOY_DIR"

# Add bun to path
export PATH="$HOME/.bun/bin:/usr/local/bin:$PATH"

# Check if bun is available
if ! command -v bun &> /dev/null; then
  error "bun is not installed or not in PATH"
fi

# Copy environment variables
log "Copying environment variables..."
if [[ ! -f "$ENV_FILE" ]]; then
  error ".env file not found in home directory"
fi
cp "$ENV_FILE" "$SERVER_ENV"
success "Environment file copied."

# Install deps and build
log "Installing dependencies..."
bun install

log "Building the project..."
bun run build:server
success "Build complete."

# Restart or start with PM2
log "Restarting app with PM2..."
if pm2 list | grep -q "$APP_NAME"; then
  pm2 restart "$APP_NAME"
  success "App restarted with PM2."
else
  pm2 start "bun run start:prod" --name "$APP_NAME"
  success "App started with PM2."
fi

log "🎉 Deployment complete."