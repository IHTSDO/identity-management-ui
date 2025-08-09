#!/bin/bash

# Setup SSL certificates for nginx
echo "Setting up SSL certificates for nginx..."

# Create SSL directories if they don't exist
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Generate SSL certificate for local.ihtsdotools.org
echo "Generating SSL certificate for local.ihtsdotools.org..."
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/local.ihtsdotools.org.key \
    -out /etc/ssl/certs/local.ihtsdotools.org.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=local.ihtsdotools.org"

# Set proper permissions
sudo chmod 644 /etc/ssl/certs/local.ihtsdotools.org.crt
sudo chmod 600 /etc/ssl/private/local.ihtsdotools.org.key

echo "SSL certificates created successfully!"
echo "Certificate: /etc/ssl/certs/local.ihtsdotools.org.crt"
echo "Private key: /etc/ssl/private/local.ihtsdotools.org.key"

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid!"
    echo "You can now reload nginx with: sudo nginx -s reload"
else
    echo "Nginx configuration has errors. Please check the configuration."
fi
