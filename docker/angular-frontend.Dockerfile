# ====== Build stage ======
FROM node:20-alpine AS build
WORKDIR /app

# Copy & install
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .

# Build production và cố định output-path để tránh lệ thuộc tên project
RUN npm run build -- --configuration=production

# ====== Runtime stage ======
FROM nginx:1.27-alpine

# file Nginx phục vụ SPA & fallback
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Xóa sạch html mặc định để chắc chắn không còn "Welcome to nginx!"
RUN rm -rf /usr/share/nginx/html/*

# copy artefact Angular
COPY --from=build /app/dist/codecampus/browser/ /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
