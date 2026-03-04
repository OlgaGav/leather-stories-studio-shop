#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-}"
if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
  echo "Usage: ./deploy.sh staging|prod"
  exit 1
fi

if [[ "$ENV" == "prod" ]]; then
  DIR="/opt/leather-shop/prod"
else
  DIR="/opt/leather-shop/staging"
fi

cd "$DIR"

echo "Pull latest images..."
docker compose pull

echo "Restart stack..."
docker compose up -d

echo "Prune old images..."
docker image prune -f

docker compose ps

echo "Done: $ENV deployed"