'use strict'

const legacyLogger = require('seneca-legacy-logger')
const Seneca = require('seneca')
const Mesh = require('seneca-mesh')
const tasksUser = require('./lib/tasks-user')
const envs = process.env

const options = {
  seneca: {
    internal: {
      logger: legacyLogger
    },
    tag: envs.TASKS_USER_TAG || 'tasks-user'
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:tasks, type:user', model: 'consume'},
      {pin: 'info:tasks, type:user', model: 'observe'}
    ]
  },
  isolated: {
    host: envs.TASKS_USER_HOST || 'localhost',
    port: envs.TASKS_USER_PORT || '8000'
  }
}

const Service = Seneca(options.seneca)

if (envs.TASKS_USER_ISOLATED) {
  Service.listen(options.isolated)
} else {
  Service.use(Mesh, options.mesh)
}

Service.use(tasksUser, {})
