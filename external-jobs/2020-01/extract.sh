#!/bin/bash

rm csv/*.csv
find external-jobs/2020-01 -path "*locales-csv.tar*" -type f -exec cp {} csv/$1 \;

