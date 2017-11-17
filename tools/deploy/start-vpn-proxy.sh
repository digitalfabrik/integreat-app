#!/bin/bash
HOST=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cat ${DIR}/openconnect.config ${DIR}/openconnect.local.config > ${DIR}/openconnect.tmp.config
openconnect --config=${DIR}/openconnect.tmp.config ${HOST}
rm openconnect.tmp.config
