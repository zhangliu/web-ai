#!/bin/bash
set -e

shotCmd="import -window root /home/kasm-user/projects/ubuntu-env-test/test.png"

while ! $shotCmd; do
    echo "screen shot test"
    sleep 2
done