#!/bin/bash
# Ensure database folder exists
mkdir -p /database

# Create SQLite file if not exists
touch /database/database.sqlite

# Run migrations and seeders
php artisan migrate --force --seed

# Create storage symlink
php artisan storage:link

# Start the Laravel server
php artisan serve --host=0.0.0.0 --port=$PORT
