# Dockerfile for ValleyPreview Perfume E-commerce Platform
# Multi-stage build for optimal image size

# Build stage
FROM node:20-alpine AS builder

# Install bash and webp tools
RUN echo "Installing bash and webp tools..." && \
    apk update && \
    apk add --no-cache bash libwebp-tools && \
    echo "Verifying bash installation..." && \
    bash --version && \
    echo "Bash installation completed"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback mechanism
RUN echo "Installing dependencies..." && \
    (npm ci --only=production || npm install --only=production) && \
    echo "Dependencies installed"

# Copy source code
COPY . ./

# Install dev dependencies needed for build
RUN echo "Installing dev dependencies..." && \
    npm install --include=dev && \
    echo "Dev dependencies installed"

# Build the application
RUN echo "Building application..." && \
    npm run build && \
    echo "Build completed"

# Production stage
FROM node:20-alpine AS production

# Install bash and webp tools
RUN echo "Installing bash and webp tools..." && \
    apk update && \
    apk add --no-cache bash libwebp-tools && \
    echo "Verifying bash installation..." && \
    bash --version && \
    echo "Bash installation completed"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback mechanism
RUN echo "Installing dependencies..." && \
    (npm ci --only=production || npm install --only=production) && \
    echo "Dependencies installed"

# Copy built files from builder stage
# Copy the entire dist directory structure
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets

# Copy start scripts
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/start-simple.sh ./start-simple.sh

# Make start scripts executable
RUN chmod +x ./start.sh ./start-simple.sh

# Expose port
EXPOSE 5000

# Health check - more robust version
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://localhost:$$PORT/health || exit 1

# Start command - using bash explicitly to run the script
CMD ["bash", "./start-simple.sh"]