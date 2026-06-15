# ─── Stage 1: Build the Frontend ──────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies and build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Build the Backend ───────────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Install dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy the rest of the backend source code
COPY backend/ ./

# ─── Stage 3: Production Image ────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built backend
COPY --from=backend-builder /app/backend /app

# Copy built frontend to the expected static directory
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose the API port
EXPOSE 5000

# Start command
# We run db:push to ensure NeonDB schema is up to date, then start Express
CMD ["sh", "-c", "npx prisma db push && npm start"]
