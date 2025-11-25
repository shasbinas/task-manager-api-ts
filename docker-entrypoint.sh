#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ] && [ -n "$PGHOST" ] && [ -n "$PGUSER" ] && [ -n "$PGPASSWORD" ] && [ -n "$PGDATABASE" ]; then
  export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT:-5432}/${PGDATABASE}?sslmode=require"
  echo "DATABASE_URL not provided; constructed from platform PG env vars."
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting Task Manager API..."
node dist/server.js

