#!/bin/bash
set -e  # Прерывать выполнение при ошибках

REPLACEMENT_STRING="$1"

# 1. Безопасная замена только в конфигурационных файлах
find "./nginx.conf" "./docker-compose.yml" -type f -exec sed -i "s/city-party.netlify.app/${REPLACEMENT_STRING}/g" {} +

# 2. Перезапуск сервисов (без Certbot)
sudo docker compose down && \
sudo docker compose up -d --build

echo "Deployment complete for domain: ${REPLACEMENT_STRING}"