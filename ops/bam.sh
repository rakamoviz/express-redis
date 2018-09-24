#!/bin/bash
miku-stop
miku-start

OPS_DIR=$(cd `dirname $0` && pwd)
eval $(minikube docker-env)

cd $OPS_DIR/docker/redis-container
./build.sh

cd $OPS_DIR/docker/express-api-container
./build.sh

cd $OPS_DIR/k8s

minikube addons enable ingress
sleep 30

kubectl delete service express-api
kubectl delete service redis
kubectl delete deployment express-api-deployment
kubectl delete deployment redis-deployment

kubectl create -f redis-deployment.yaml
sleep 15
kubectl create -f redis-service.yaml
sleep 15

kubectl create -f express-api-deployment.yaml
sleep 15
kubectl create -f express-api-service.yaml
sleep 15

kubectl create -f express-api-ingress.yaml