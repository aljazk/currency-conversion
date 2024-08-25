FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Nginx stage
FROM nginx:alpine

COPY --from=builder /app/dist/currency-conversion/browser /usr/share/nginx/html
