#!/bin/bash

# Start script for ValleyPreview Perfume E-commerce Platform on Railway
# This script handles both development and production environments

echo "=== ValleyPreview Perfume E-commerce Platform ==="
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-5000}"

# Function to check if we're running on Railway
is_railway() {
    [ -n "$RAILWAY_ENVIRONMENT" ] || [ -n "$RAILWAY_PROJECT_ID" ]
}

# Function to convert images to WebP format
convert_images_to_webp() {
    echo "Converting images to WebP format..."
    
    # Check if cwebp is available
    if command -v cwebp >/dev/null 2>&1; then
        # Convert JPG images to WebP
        if [ -d "assets" ]; then
            for file in assets/*.jpg; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file" .jpg)
                    echo "Converting $filename.jpg to WebP..."
                    cwebp -q 80 "$file" -o "assets/${filename}.webp"
                fi
            done
            
            # Convert PNG images to WebP
            for file in assets/*.png; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file" .png)
                    echo "Converting $filename.png to WebP..."
                    cwebp -q 80 "$file" -o "assets/${filename}.webp"
                fi
            done
        else
            echo "Assets directory not found, skipping image conversion"
        fi
    else
        echo "Warning: cwebp not found, skipping image conversion"
        echo "For WebP conversion, please install WebP tools:"
        echo "Ubuntu/Debian: apt-get install webp"
        echo "CentOS/RHEL: yum install libwebp-tools"
        echo "macOS: brew install webp"
    fi
}

# Function to start development server
start_development() {
    echo "Starting development server..."
    
    # Convert images to WebP format
    convert_images_to_webp
    
    # Start the development server
    echo "Server will be available at http://localhost:${PORT:-5000}"
    npm run dev
}

# Function to start production server
start_production() {
    echo "Starting production server..."
    
    # On Railway, we might want to skip image conversion for faster deploys
    if ! is_railway; then
        # Convert images to WebP format
        convert_images_to_webp
    else
        echo "Skipping image conversion on Railway for faster deployment"
    fi
    
    # Start the production server
    echo "Server will be available at http://localhost:${PORT:-5000}"
    npm run start
}

# Main execution logic
if is_railway; then
    echo "Running on Railway"
    # On Railway, always run in production mode
    start_production
else
    case "${NODE_ENV:-development}" in
        production)
            echo "Running in production mode"
            start_production
            ;;
        development|*)
            echo "Running in development mode"
            start_development
            ;;
    esac
fi