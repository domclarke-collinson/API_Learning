# Use Node.js version 24 as the base image
FROM node:24-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Set default port as build argument
ARG PORT=3005

# Set environment variable for runtime
ENV PORT=${PORT}

# Expose the port (using the variable)
EXPOSE ${PORT}

# Run the application
CMD ["node", "dist/main.js"]    