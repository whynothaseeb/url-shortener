# Use Node 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 4000

# Command to run the backend
CMD ["npx", "nodemon", "server.js"]