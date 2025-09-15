# Dockerfile for ValleyPreview Perfume E-commerce Platform
# Multi-stage build for optimal image size

# Build stage
FROM node:20-alpine AS builder

# Install bash and webp tools with more explicit commands
RUN echo "Installing bash and webp tools..." && \
    apk update && \
    apk add --no-cache bash && \
    apk add --no-cache libwebp-tools && \
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
COPY . .

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

# Install bash and webp tools with more explicit commands
RUN echo "Installing bash and webp tools..." && \
    apk update && \
    apk add --no-cache bash && \
    apk add --no-cache libwebp-tools && \
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
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/start.sh ./start.sh

# Copy assets
COPY --from=builder /app/client/src/assets ./dist/client/src/assets

# Make start script executable
RUN chmod +x ./start.sh

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const port = process.env.PORT || 5000; require('http').get(\`http://localhost:\${port}/health\`, (res) => { if (res.statusCode !== 200) process.exit(1); })"

# Start command - using bash explicitly to run the script
CMD ["bash", "./start.sh"]