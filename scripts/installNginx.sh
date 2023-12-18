#!/bin/bash
set -e

cd ~
apt update
# version 1.18.0-6ubuntu14.4
apt install nginx-light -y

# 配置 nginx 将 80 请求代理到 localhost 3000 端口
config="
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        location / {
            proxy_pass http://localhost:3000; 
        }
    }
"
echo -e $config >> nginx_default
cd /etc/nginx/sites-enabled/
mv default .default_bak
mv ~/nginx_default default

systemctl enable nginx
systemctl start nginx
systemctl status nginx

echo "Nginx has been installed and started successfully!"