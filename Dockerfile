# Multi-stage production container build for Ghost-Watch C2 Terminal

# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json ./
RUN npm install

# Copy source code and configuration
COPY . .

# Build Vite client assets and bundle Express server with esbuild
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled bundles and static assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/metadata.json ./metadata.json

# Expose standard Ghost-Watch C2 port
EXPOSE 3000

# Run production server
CMD ["node", "dist/server.cjs"]
