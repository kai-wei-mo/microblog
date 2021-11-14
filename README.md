# microservices-from-scratch

## Requirements
- `node >=16.0.0`
- `npm >=7.0.0`

## Setup
- open **six** terminal instances in the repo's root directory
- run each of the following commands (one command per terminal)
    1. `cd client && npm i && npm start`
    2. `cd posts && npm i && npm start`
    3. `cd comments && npm i && npm start`
    4. `cd query && npm i && npm start`
    5. `cd moderation && npm i && npm start`
    6. `cd event-bus && npm i && npm start`

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

### Demo 1 - Request Minimization
0. After each step, refresh the React app to show your changes
1. Open your browser's Network Tab
2. Create a Post
3. Create some Comments for the Post

Observe that only one request has been made to fetch all posts and their comments.

This is made possible by the Query microservice, which stores a copy of all Posts and Comments in proper microservice fashion.

### Demo 2 - Dead Letter Queue (DLQ)
0. After each step, refresh the React app to show your changes
1. Kill the Query service (i.e. Ctrl-C in the Query service terminal)
2. Create some Posts and Comments
3. Observe that your Posts and Comments do not show even after refreshing the React app
4. Restart the Query service (i.e. `npm start`)

Observe that your Posts and Comments now appear on the React app, and that there are logs of in Query service terminal showing evidece of DLQ event processing.

This is made possible by our custom event bus which stores all events to be queried by the Query service on start-up.

## Disclaimer
Certain design elements of this project (e.g. storing Posts and Comments in-memory, creating an Event Bus from a Node server, etc.) were chosen for instructional purposes and should not be used in any production-grade environments.
