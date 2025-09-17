#!/bin/sh
# entrypoint.sh

# Tạo file config.json dựa vào biến môi trường API_URL
cat <<EOF > /usr/share/nginx/html/config.json
{
  "API_URL": "${API_URL}"
}
EOF

# Chạy nginx foreground
nginx -g 'daemon off;'
