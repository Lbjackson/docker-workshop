# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# TODO: Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# TODO: Production stage
FROM node:20-alpine AS production
WORKDIR /app

# TODO: Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# TODO: SET ENV variables
ENV NODE_ENV=production

# TODO: install production dependencies


# Expose the port
EXPOSE 3000

# Create start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
