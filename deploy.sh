#!/bin/bash
DEPLOY_DIR="/var/www/snippetslibrary"
cd $DEPLOY_DIR

bun install
bun run build
pm2 restart snippetslibrary || pm2 start "bun run start:prod" --name snippetslibrary