# tasks-user
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

```
$ docker build -t tasks-user .
```

Start

```
$ docker run -d --net host --name tasks-user tasks-user
```

From hub.docker.com

```
$ docker run -d --net host --name tasks-user telemark/tasks-user
```

Call the service

```
$ curl -d '{"role":"tasks", "type": "user", "user":"gasg"}' -v http://192.168.99.100:8000/act
$ curl -d '{"info":"tasks", "type": "user", "data":{}}' -v http://192.168.99.100:8000/act
```