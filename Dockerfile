# --- Build Stage ---
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy all source code
    COPY . .
    
    # Generate Prisma client
    RUN npx prisma generate
    
    # Build the Next.js application
    RUN npm run build
    
    # --- Production Stage ---
    FROM node:20-alpine AS production
    WORKDIR /app
    
    # Copy only what's needed for production
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /app/next.config.mjs ./next.config.mjs
    
    ENV NODE_ENV=production
    
    # Expose port
    EXPOSE 3000
    
    # Create a start script
    RUN echo '#!/bin/sh' > /app/start.sh && \
        echo 'npx prisma migrate deploy' >> /app/start.sh && \
        echo 'npm start' >> /app/start.sh && \
        chmod +x /app/start.sh
    
    CMD ["/app/start.sh"]
    