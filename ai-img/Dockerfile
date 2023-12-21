# https://hub.docker.com/r/kasmweb/ubuntu-jammy-desktop
FROM kasmweb/ubuntu-jammy-desktop:1.14.0-rolling
USER root

RUN apt update

ARG INIT_NVM='export NVM_DIR="$HOME/.nvm" &&  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'
# 安装 node 16，以及一些必要的包
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN echo $INIT_NVM >> /home/kasm-default-profile/.bashrc && \
    eval $INIT_NVM && \
    nvm install 16

# 安装 robotjs，控制 鼠标 & 键盘
RUN apt install libxtst-dev libpng++-dev -y
RUN eval $INIT_NVM && npm install -g node-gyp@10.0.1 && npm i -g robotjs@0.6.0

# # 安装 opencv，能够进行图片识别
RUN sudo apt install libopencv-dev python3-opencv -y

# 启动 web-ai 服务
RUN eval $INIT_NVM && npm i pm2 -g
RUN mkdir -p projects
RUN cd projects && \
    git clone https://github.com/zhangliu/web-ai.git && \
    cd web-ai && \
    git checkout dev && \
    eval $INIT_NVM && npm i && npm run prod
RUN echo 'npm run prod' >> /home/kasm-default-profile/.bashrc

WORKDIR projects/web-ai