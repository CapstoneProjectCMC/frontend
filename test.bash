# các biến của bạn
IMG=""

docker rm -f codecampus-frontend 2>/dev/null || true
docker run -d --name codecampus-frontend ^
  --restart unless-stopped ^
  -p 4200:80 ^
  yunomix280304/codecampus-frontend:latest

# kiểm tra
docker logs -n 50 codecampus-frontend
curl -I http://localhost:4200
