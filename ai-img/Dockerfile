FROM kasmweb/ubuntu-jammy-desktop:1.14.0-rolling
USER root

RUN apt update

# 截图测试
# 构建一个node服务
RUN apt install imagemagick -y
RUN apt install nodejs -y
COPY ./service3000.js ./projects/ubuntu-env-test/service3000.js
RUN echo 'nohup node ~/projects/ubuntu-env-test/service3000.js &' >> /home/kasm-default-profile/.bashrc
