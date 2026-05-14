# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG PUBLIC_API_URL
ARG PUBLIC_APP_NAME
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_APP_NAME=$PUBLIC_APP_NAME

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001

# Copy built application from builder
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

# Switch to non-root user
USER astro

# Expose port
EXPOSE 3000

# Health check (optional, uncomment if needed)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application using dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "./dist/server/entry.mjs"]
