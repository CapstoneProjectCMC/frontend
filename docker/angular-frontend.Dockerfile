# ====== Build stage ======
FROM node:20-alpine AS build
WORKDIR /app

# Copy & install
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
# Angular 19 đã default prod; nhưng dùng cấu hình production vẫn OK
RUN npm run build

# ====== Runtime stage ======
FROM nginx:1.29-alpine
# file Nginx phục vụ SPA & fallback
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# copy artefact Angular
COPY --from=build /app/dist/codecampus /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
