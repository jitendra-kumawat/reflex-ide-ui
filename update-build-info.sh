#!/usr/bin/env bash
build_date=`date +%d\ %B,\ %Y`
echo $0 $1 $2
sed -i.bak  "s/%DATE%/$build_date/g" dist/apps/app/config/build_info.json
sed -i.bak "s/%VERSION%/$1/g" dist/apps/app/config/build_info.json
