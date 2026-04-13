# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app (e.g. TypeScript -> dist)
RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

# Expose your app port
EXPOSE 3000

# Run the app
CMD ["node", "dist/server.js"]