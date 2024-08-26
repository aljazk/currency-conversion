# Use a Node.js base image
FROM node:22-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY /src ./src
COPY /tsconfig.json ./tsconfig.json
COPY /tsconfig.build.json ./tsconfig.build.json
COPY /jest.config.js ./jest.config.js
COPY /tsoa.json ./tsoa.json

RUN npm run test
RUN npm run build
RUN npm run swagger

FROM node:22-alpine

# Copy build
COPY --from=builder /app/dist .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Expose the port your app will listen on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]

