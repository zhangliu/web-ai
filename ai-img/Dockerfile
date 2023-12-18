FROM kasmweb/ubuntu-jammy-desktop:1.14.0-rolling
USER root

RUN apt update

# 截图测试
RUN apt install imagemagick -y
COPY ./screen-shot-test.sh ./projects/ubuntu-env-test/screen-shot-test.sh
RUN chmod +x ./projects/ubuntu-env-test/screen-shot-test.sh
RUN echo 'nohup sh ~/projects/ubuntu-env-test/screen-shot-test.sh &' >> /home/kasm-default-profile/.bashrc

# 构建一个node服务
RUN apt install nodejs -y
COPY ./service3000.js ./projects/ubuntu-env-test/service3000.js
RUN echo 'nohup node ~/projects/ubuntu-env-test/service3000.js &' >> /home/kasm-default-profile/.bashrc
