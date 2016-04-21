'use strict'

var envs = process.env

module.exports = function (options) {
  var seneca = this

  seneca.add('info:tasks, type:user', updateTasksUser)

  return {
    name: envs.TASKS_COLLECTOR_COMPILO_TAG || 'tasks-user'
  }
}

function updateTasksUser (data, callback) {
  console.log(data)
  callback(null, data)
}
