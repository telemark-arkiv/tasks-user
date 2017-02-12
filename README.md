[![Build Status](https://travis-ci.org/telemark/tasks-user.svg?branch=master)](https://travis-ci.org/telemark/tasks-user)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
# tasks-user

[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/tasks-user.svg)](https://greenkeeper.io/)
Microservice to collect a user's task

## Inbound messages
This microservice listens for the following messages

- ```{role: 'tasks', type: 'user'}```
- ```{info: 'tasks', type: 'user'}```

## Outbound messages
This microservice emits the following messages

- ```{cmd: 'collect-tasks', type:'user'}```

## Docker
Build the image

```sh
$ docker build -t tasks-user .
```

Start

```sh
$ docker run -d --net host --name tasks-user tasks-user
```

From hub.docker.com

```sh
$ docker run -d --net host --name tasks-user telemark/tasks-user
```

Call the service

```sh
$ curl -d '{"role":"tasks", "type": "user", "user":"gasg"}' -v http://localhost:8000/act
$ curl -d '{"info":"tasks", "type": "user", "data":{"user": "gasg", "system": "npm", "data": ["awsm"]}}' -v http://localhost:8000/act
```