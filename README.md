# microblog

## Requirements
- `minikube`
- `kubectl`
- `docker`

## Setup
```Bash
minikube start
eval $(minikube docker-env)
kubectl create namespace microblog
minikube addons enable ingress
MINIKUBE_IP=$(minikube ip)
echo "$MINIKUBE_IP posts.com" | sudo tee -a /etc/hosts
bash setup.sh
```

## Learning Objectives
- Posts, Comments, and Query
    - decoupling and independence of business features
- Moderation
    - async microservice flow of events
    - event-driven comment creation, moderation, and update
- Event Bus
    - DLQ
    - how to plan around microservice downtime

## Project Description
`microservices-from-scratch` is a monorepo of 5 microservices.

This project is a web app with Posts and Comments.

All services, including the event bus, have been built from scratch in order to show a deep understanding of microservice architecture,

### Features
| MICROSERVICE | PURPOSE |
|---|---|
| Posts | - creation of Posts<br>- stores all Posts |
| Comments | - creation of Comments<br>- stores all Comments |
| Query | - fetching Posts and Comments for display<br>- stores all Posts and Comments<br>- only stores information necessary for faster fetching |
| Moderation | - determine if Comment is appropriate for display |

## Disclaimer
Many design elements of this project (e.g. storing Posts and Comments in-memory, absense of hot-reload, creating an in-house Event Bus, etc.) were chosen for instructional purposes and should not be used in any production-grade environments.
