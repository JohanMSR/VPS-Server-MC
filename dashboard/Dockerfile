FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create config directory
RUN mkdir -p /app/config

# Expose port
EXPOSE 6060

# Start application
CMD ["npm", "start"]
