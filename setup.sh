#!/usr/bin/env bash

# ==============================================================================
# setup.sh — Provision a new Ubuntu VPS for Bun + PM2 deployments
# ============================================================================== 

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log()     { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]  ${NC} $1"; }
error()   { echo -e "${RED}[ERR] ${NC} $1"; exit 1; }

# 1) Must be root
if [[ "$EUID" -ne 0 ]]; then
  error "Run me with sudo so I can do system changes."
fi

# Paths & vars
DEPLOY_USER="deploy"
HOME_DIR="/home/$DEPLOY_USER"
APP_DIR="/var/www/snippetslibrary"
KEY_PATH="$HOME_DIR/.ssh/id_deploy_action"
REQUIRED_PKGS=(curl git build-essential openssh-server ufw unzip)

# 2) Early exit if everything's already in place
log "Checking for a previously completed setup…"
if id "$DEPLOY_USER" &>/dev/null \
   && sudo -u "$DEPLOY_USER" bash -lc 'command -v bun' &>/dev/null \
   && command -v pm2 &>/dev/null \
   && ufw status | grep -q "Status: active" \
   && [[ -d "$APP_DIR" ]] \
   && [[ -f "$KEY_PATH" ]]; then
  success "All components already installed/configured—nothing to do!"
  exit 0
fi

# 3) Update & install essentials
log "Updating apt cache…"
apt update -y

log "Installing system packages: ${REQUIRED_PKGS[*]}…"
apt install -y "${REQUIRED_PKGS[@]}"

# 4) Firewall
log "Configuring UFW to allow SSH…"
ufw allow OpenSSH
ufw --force enable
success "UFW is active."

# 5) Deploy user
log "Ensuring user '$DEPLOY_USER' exists…"
if id "$DEPLOY_USER" &>/dev/null; then
  log "User exists—skipping."
else
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  success "User $DEPLOY_USER created."
fi

# SSH directory for deploy user
log "Setting up SSH directory for $DEPLOY_USER…"
mkdir -p "$HOME_DIR/.ssh"
chmod 700 "$HOME_DIR/.ssh"
chown "$DEPLOY_USER":"$DEPLOY_USER" "$HOME_DIR/.ssh"
success "SSH folder ready."

# 6) Bun install (idempotent)
if sudo -u "$DEPLOY_USER" bash -lc 'command -v bun' &>/dev/null; then
  success "Bun already installed."
else
  log "Installing Bun runtime…"
  sudo -u "$DEPLOY_USER" bash -c "curl -fsSL https://bun.sh/install | bash"
  echo 'export PATH="$HOME/.bun/bin:$PATH"' >> "$HOME_DIR/.bashrc"
  echo 'export PATH="$HOME/.bun/bin:$PATH"' > /etc/profile.d/bun.sh
  chmod +x /etc/profile.d/bun.sh
  chown "$DEPLOY_USER":"$DEPLOY_USER" "$HOME_DIR/.bashrc"
  success "Bun installed and PATH configured."
fi

# 7) Node.js & PM2 (idempotent)
if command -v pm2 &>/dev/null; then
  success "PM2 already installed."
else
  log "Installing Node.js LTS + PM2…"
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt install -y nodejs
  npm install -g pm2@latest
  success "Node.js & PM2 ready."
fi

# 8) App directory
log "Creating app directory at $APP_DIR…"
mkdir -p "$APP_DIR"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"
chmod -R 755 "$APP_DIR"
success "App directory exists."

# 9) CI SSH key
if [[ -f "$KEY_PATH" ]]; then
  success "CI SSH key already present."
else
  log "Generating ed25519 SSH key for GitHub Actions…"
  sudo -u "$DEPLOY_USER" ssh-keygen -t ed25519 -N "" -f "$KEY_PATH" <<< y &>/dev/null
  success "Key at $KEY_PATH"
fi

# 10) Final instructions
PUBLIC_IP=$(curl -s ifconfig.me)

echo -e "\n${GREEN}🎉 Setup Complete!${NC}\n"

echo -e "Now add these GitHub Actions secrets to your repo:"
echo -e "  • ${CYAN}VPS_HOST${NC}    = ${PUBLIC_IP}"
echo -e "  • ${CYAN}VPS_PORT${NC}    = 22"
echo -e "  • ${CYAN}VPS_USER${NC}    = ${DEPLOY_USER}"
echo -e "  • ${CYAN}VPS_SSH_KEY${NC} = contents of ${KEY_PATH}\n"

echo -e "And make sure your deploy user can SSH back in:"
echo -e "  cat ${KEY_PATH}.pub >> ${HOME_DIR}/.ssh/authorized_keys\n"
echo -e "Commit your workflow.yml and enjoy automated deploys! 🚀"
echo -e "\n${CYAN}Remember to run 'source /etc/profile.d/bun.sh' or restart your shell to apply Bun PATH changes.${NC}\n"