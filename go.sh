#!/bin/bash

# execute this script from the directory that the script is in

cd client
docker build -t client:latest .
cd ..

cd comments
docker build -t comments:latest .
cd ..

cd event-bus
docker build -t event-bus:latest .
cd ..

cd moderation
docker build -t moderation:latest .
cd ..

cd posts
docker build -t posts:latest .
cd ..

cd query
docker build -t query:latest .
cd ..

# kubectl
cd infra/k8s
for file in .
do
  kubectl apply -f $file
done

deploys=`kubectl get deployments -n default | tail -n7 | cut -d ' ' -f 1`
for deploy in $deploys; do
  kubectl rollout restart deployments/$deploy -n default
done