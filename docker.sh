#!/bin/sh
cd /home/admin/projects/gitinn/gitinn-fe/
git checkout HEAD ./
git pull
chmod +x ./docker.sh
chmod +x ./build.sh
isRun=$(docker ps |grep gitinn-fe | grep -v grep | wc -l)
echo "\n isrun:"
echo $isRun
echo "\n"
if [[ $isRun>0 ]]; then
    docker stop gitinn-fe
    docker rm -f gitinn-fe
fi;
docker build -t gitinn-fe ./
git checkout HEAD ./
docker create -p 7001:80 --name gitinn-fe gitinn-fe
docker start gitinn-fe
docker images |grep none |grep -v grep | awk '{print $3}' | xargs docker rmi -f
