'use strict'

var envs = process.env
var pkg = require('../package.json')

module.exports = function (options) {
  var seneca = this

  seneca.add('role:tasks, type:user', getTasksUser)

  return {
    name: envs.TASKS_COLLECTOR_COMPILO_TAG || 'tasks-user'
  }
}

function getTasksUser (args, callback) {
  var seneca = this
  var result = {
    serviceid: pkg.name,
    version: pkg.version,
    timestamp: new Date().getTime(),
    user: args.user,
    results: []
  }

  seneca.act('cmd:collect-tasks, type:user', args)
  callback(null, result)
}
