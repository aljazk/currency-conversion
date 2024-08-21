# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY /dist .

# Expose the port your app will listen on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]