# Dockerfile for ValleyPreview Perfume E-commerce Platform
# Multi-stage build for optimal image size
# COMPLETE REBUILD TRIGGER - 2025-09-18 19:00 UTC
# This Dockerfile forces a complete rebuild to fix the index.js vs index.cjs issue
# Added unique identifier to force rebuild: REBUILD_ID_20250918_1900

# Build stage
FROM node:20-alpine AS builder

# Install bash and webp tools
RUN apk update && \
    apk add --no-cache bash libwebp-tools && \
    echo "Installed required tools"

# Set working directory
WORKDIR /app

# Copy package files FIRST to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (both production and dev)
RUN npm ci || npm install

# Explicitly install TypeScript and Vite
RUN npm install -g typescript vite

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install bash and webp tools
RUN apk update && \
    apk add --no-cache bash libwebp-tools && \
    echo "Installed required tools"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy start script
COPY --from=builder /app/start.sh ./start.sh

# Make start script executable
RUN chmod +x ./start.sh

# Expose port
EXPOSE 5000

# Health check with generous timing
HEALTHCHECK --interval=45s --timeout=15s --start-period=60s --retries=5 \
  CMD node -e "const port = process.env.PORT || 5000; require('http').get(\`http://localhost:\${port}/health\`, (res) => { if (res.statusCode !== 200) process.exit(1); })"

# Start the application
CMD ["bash", "./start.sh"]