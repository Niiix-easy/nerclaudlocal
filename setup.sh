#!/usr/bin/env bash
set -e

# Setup script for Neer-Data-Base Multi-tenant Architecture

echo "🚀 Starting Neer-Data-Base setup..."

# 1. Setup environment variables if not present
if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
fi

# 2. Start Docker Services
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U neer -d neer_data_base; do
  sleep 2
done

# 3. Run Prisma migrations inside the API container
echo "🗄️ Running Prisma database push & seed via API container..."
docker-compose exec -T api pnpm --filter @neer/database db:push
docker-compose exec -T api pnpm --filter @neer/database db:seed

echo "✅ Setup complete! The Neer Data Base platform is starting up."
echo "Dashboards:"
echo " - Dashboard: http://localhost:3010"
echo " - API: http://localhost:3000"
echo ""
echo "Run 'docker-compose logs -f' to view logs."
