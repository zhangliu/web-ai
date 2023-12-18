#!/bin/bash
set -e

shotCmd="import -window root ./test.png"

while ! $shotCmd; do
    echo "screen shot test"
    sleep 2
done