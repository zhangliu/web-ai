#!/bin/bash
set -e

__DIR__=$(dirname "$0")/..

# 启动一个 kasmweb 桌面docker，登录用户: kasm_user
# see: https://hub.docker.com/r/kasmweb/ubuntu-jammy-desktop
docker pull kasmweb/desktop:1.10.0
docker run --rm --user root -it --shm-size=512m -p 3000:6901 -e VNC_PW=admin kasmweb/ubuntu-jammy-desktop:1.14.0-rolling




# # see: https://sikulix.github.io/docs/start/installation/
# wget https://launchpad.net/sikuli/sikulix/2.0.5/+download/sikulixide-2.0.5.jar