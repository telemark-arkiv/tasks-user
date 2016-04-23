'use strict'

var Seneca = require('seneca')
var Mesh = require('seneca-mesh')
var tasksUser = require('./lib/tasks-user')
var envs = process.env

var options = {
  seneca: {
    tag: envs.TASKS_USER_TAG || 'tasks-user'
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:tasks, type:user', model: 'consume'},
      {pin: 'info:tasks, type:user', model: 'observe'}
    ]
  },
  compilo: {
    url: envs.TASKS_COLLECTOR_COMPILO_URL || 'http://compilo.no'
  },
  isolated: {
    host: envs.TASKS_USER_HOST || 'localhost',
    port: envs.TASKS_USER_PORT || '8000'
  }
}
var Service = Seneca(options.seneca)

if (envs.TASKS_USER_ISOLATED) {
  Service.listen(options.isolated)
} else {
  Service.use(Mesh, options.mesh)
}

Service.use('entity')
Service.use('jsonfile-store',{folder:'storage'})
Service.use(tasksUser, options.compilo)
