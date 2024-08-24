# FROM node:18-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# Nginx stage
# FROM nginx:alpine

# COPY --from=builder /app/dist/currency-conversion/browser /usr/share/nginx/html
# COPY --from=builder /app/nginx.conf /usr/share/nginx/conf/nginx.conf


FROM nginx:alpine
COPY dist/currency-conversion/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80