#!/bin/bash

# Start script for ValleyPreview Perfume E-commerce Platform on Railway
# This script handles both development and production environments
# Unique identifier to force rebuild: START_SCRIPT_ID_20250917_1730

echo "=== ValleyPreview Perfume E-commerce Platform ==="
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-5000}"

# Function to check if we're running on Railway
is_railway() {
    [ -n "$RAILWAY_ENVIRONMENT" ] || [ -n "$RAILWAY_PROJECT_ID" ] || [ -n "$RAILWAY_SERVICE_NAME" ]
}

# Function to convert images to WebP format
convert_images_to_webp() {
    echo "Converting images to WebP format..."
    
    # Check if cwebp is available
    if command -v cwebp >/dev/null 2>&1; then
        # Convert JPG images to WebP
        if [ -d "client/src/assets" ]; then
            for file in client/src/assets/*.jpg; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file" .jpg)
                    echo "Converting $filename.jpg to WebP..."
                    cwebp -q 80 "$file" -o "client/src/assets/${filename}.webp"
                fi
            done
            
            # Convert PNG images to WebP
            for file in client/src/assets/*.png; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file" .png)
                    echo "Converting $filename.png to WebP..."
                    cwebp -q 80 "$file" -o "client/src/assets/${filename}.webp"
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

# Function to install dependencies
install_dependencies() {
    echo "Installing project dependencies..."
    
    # Install npm dependencies
    if is_railway; then
        # On Railway, use npm ci for faster, reliable builds
        npm ci --only=production
    else
        # For local development
        npm install
    fi
    
    # Check if installation was successful
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
}

# Function to build the project
build_project() {
    echo "Building project..."
    
    # Run build script
    npm run build
    
    # Check if build was successful
    if [ $? -ne 0 ]; then
        echo "Error: Failed to build project"
        exit 1
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
    
    # Always build the project in production to ensure we have the latest build
    # This is more reliable than checking for the dist directory
    if is_railway; then
        echo "Running on Railway - building project to ensure latest version"
        build_project
    elif [ ! -d "dist" ]; then
        echo "Dist directory not found - building project"
        build_project
    else
        echo "Using pre-built dist directory"
    fi
    
    # Check what files exist in the dist/server directory
    echo "Contents of dist/server directory:"
    if [ -d "dist/server" ]; then
        ls -la dist/server
    else
        echo "dist/server directory does not exist"
        echo "Contents of dist directory:"
        if [ -d "dist" ]; then
            ls -la dist
        else
            echo "dist directory does not exist"
        fi
    fi
    
    # Start the production server - directly execute the correct command
    echo "Server will be available at http://localhost:${PORT:-5000}"
    echo "Executing: cross-env NODE_ENV=production node dist/server/index.js"
    cross-env NODE_ENV=production node dist/server/index.js
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