# Use Node.js 24
FROM node:24-alpine

# Set working directory inside Docker
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Vite development port
EXPOSE 5173

# Start ReactJS
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]