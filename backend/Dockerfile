FROM node:18 AS builder

WORKDIR /build

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source files
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:18-slim AS runner

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules/ ./node_modules/
COPY --from=builder /build/dist/ ./dist/
COPY --from=builder /build/tsconfig.json ./

CMD ["npm", "start"]