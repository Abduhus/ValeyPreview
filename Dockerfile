# Dockerfile for ValleyPreview Perfume E-commerce Platform
# Multi-stage build for optimal image size

# Build stage
FROM node:20-alpine AS builder

# Install bash and webp tools
RUN apk add --no-cache bash libwebp-tools

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback mechanism
RUN npm ci --only=production || npm install --only=production

# Copy source code
COPY . .

# Install dev dependencies needed for build
RUN npm install --include=dev

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install bash and webp tools
RUN apk add --no-cache bash libwebp-tools

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback mechanism
RUN npm ci --only=production || npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./dist/server
COPY --from=builder /app/client ./dist/client
COPY --from=builder /app/shared ./dist/shared

# Copy assets
COPY --from=builder /app/client/src/assets ./dist/client/src/assets

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { if (res.statusCode !== 200) process.exit(1); })"

# Start command
CMD ["npm", "run", "start"]