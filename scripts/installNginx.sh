#!/bin/bash
set -e

cd ~
sudo apt update
# version 1.18.0-6ubuntu14.4
sudo apt install nginx-light -y

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

cd /etc/nginx/sites-enabled/
sudo cp default .default_bak
sudo chmod 666 default
echo -e $config > default

sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx

echo "Nginx has been installed and started successfully!"