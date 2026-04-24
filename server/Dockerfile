# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Start app
CMD ["node", "server.js"]
