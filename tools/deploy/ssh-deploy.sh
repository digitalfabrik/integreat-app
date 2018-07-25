#!/usr/bin/env bash

HOST=$1
REMOTE_DIR=$2
CHOWN=$3

yarn build

rsync -vr -n --delete $(mktemp -d)/ ${HOST}:${REMOTE_DIR}

read -p "Do you really want to delete these files? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rsync -vr --delete $(mktemp -d)/ ${HOST}:${REMOTE_DIR}
fi

rsync -vIacz --progress --stats --chmod=774 --chown=${CHOWN} . ${HOST}:${REMOTE_DIR}
