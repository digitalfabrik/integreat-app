#!/bin/bash
HOST=$1

cat openconnect.config openconnect.local.config > openconnect.tmp.config
openconnect --config=openconnect.tmp.config ${HOST}
rm openconnect.tmp.config
