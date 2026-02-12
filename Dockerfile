FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libsqlite3-dev \
    nodejs \
    npm \
    && docker-php-ext-install \
    pdo \
    pdo_sqlite \
    zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Install and build frontend assets
RUN npm install && npm run build

# Create database directory and set permissions
RUN mkdir -p /database && \
    touch /database/database.sqlite && \
    chmod 777 /database/database.sqlite

# Set environment variables
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/database/database.sqlite
ENV APP_ENV=production
ENV APP_DEBUG=false

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD mkdir -p /database && \
    touch /database/database.sqlite && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-8000}FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libsqlite3-dev \
    nodejs \
    npm \
    && docker-php-ext-install \
    pdo \
    pdo_sqlite \
    zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Install and build frontend assets
RUN npm install && npm run build

# Create database directory and set permissions
RUN mkdir -p /database && \
    touch /database/database.sqlite && \
    chmod 777 /database/database.sqlite

# Set environment variables
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/database/database.sqlite
ENV APP_ENV=production
ENV APP_DEBUG=false

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD mkdir -p /database && \
    touch /database/database.sqlite && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-8000}