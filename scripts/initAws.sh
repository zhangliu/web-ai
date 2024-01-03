#!/bin/bash
set -e

# 安装 node 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# 安装 docker
sudo snap install docker
sudo chmod 666 /var/run/docker.sock

