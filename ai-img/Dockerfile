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

# 安装 robotjs 依赖的库
RUN apt install libxtst-dev libpng++-dev -y
RUN eval $INIT_NVM && npm install -g node-gyp@10.0.1

# # 安装 opencv，能够进行图片识别
RUN sudo apt install libopencv-dev python3-opencv -y

# 启动 web-ai 服务
RUN mkdir -p projects

# ARG CACHEBUST=1

RUN cd projects && \
    git clone https://github.com/zhangliu/web-ai.git && \
    cd web-ai && \
    git checkout dev && \
    eval $INIT_NVM && npm i && npm run prod
RUN echo 'cd ~/projects/web-ai && npm run prod' >> /home/kasm-default-profile/.bashrc

WORKDIR projects/web-ai