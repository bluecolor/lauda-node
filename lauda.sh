#!/bin/bash

export LD_LIBRARY_PATH=/home/ceyhun/projects/lab/lauda/lib/instantclient_12_2

node src/app.js \
--source-url "localhost:49161/xe" \
--source-username lauda \
--source-password lauda \
--source-table  lauda.source_table \
--target-table  lauda.target_table \
--target-url "localhost:49161/xe" \
--target-username lauda \
--target-password lauda \
--create \
--path "/home/ceyhun/projects/lab/lauda/test/data" \
--parallel 4
