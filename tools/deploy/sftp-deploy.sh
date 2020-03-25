#!/usr/bin/env bash


REMOTE_DIR=$1
USERNAME=$2
KEYFILE=$3

sftp -i ${KEYFILE} ${USERNAME}@server10.integreat-app.de:${REMOTE_DIR} <<< $'put -r dist/*'
