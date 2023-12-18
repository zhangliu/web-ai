#!/bin/bash
set -e

apt update
apt install imagemagick -y

mkdir -p ~/projects/ubuntu-env-test/
echo '
mkdir -p ~/projects/ubuntu-env-test && cd ~/projects/ubuntu-env-test
shotCmd="import -window root ./test.png"
while ! $shotCmd; do
    sleep 2
done
' >> ~/projects/ubuntu-env-test/shotImg.sh
chmod +x ~/projects/ubuntu-env-test/shotImg.sh
echo 'nohup sh ~/projects/ubuntu-env-test/shotImg.sh &' >> ~/.bashrc