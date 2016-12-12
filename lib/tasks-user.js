'use strict'

const Loki = require('lokijs')
const envs = process.env
const tag = envs.TASKS_USER_TAG || 'tasks-user'
const logTime = require('./log-time')

const db = new Loki('../db/tasks.json')
const tasks = db.addCollection('tasks')

module.exports = function (options) {
  const seneca = this

  seneca.add('role:tasks, type:user', getTasksUser)
  seneca.add('info:tasks, type:user', updateTasksUser)

  return tag
}

function repackStore (data) {
  var repack = []
  const dropKeys = (item) => ['user', 'meta', '$loki'].indexOf(item) === -1
  if (data) {
    Object.keys(data).filter(dropKeys).forEach((dataKey) => {
      const items = data[dataKey] || []
      items.forEach((item) => {
        repack.push(item)
      })
    })
  }

  return repack
}

function getTasksUser (args, done) {
  const seneca = this
  const user = args.user

  console.log(`${tag} - ${logTime()}: collects tasks - ${user}`)

  const result = {
    user: user,
    data: repackStore(tasks.findOne({user: user}))
  }

  console.log(`${tag} - ${logTime()}: returns tasks - ${user} - found ${result.data.length}`)

  done(null, result)

  seneca.act({cmd: 'collect-tasks', type: 'user', user: user})
}

function updateTasksUser (msg, done) {
  done(null, {ok: true})

  const user = msg.data.user
  const system = msg.data.system
  const data = msg.data.data
  const userTasks = tasks.findOne({user: user})

  if (!userTasks) {
    var payload = {
      user: user
    }
    payload[system] = data
    tasks.insert(payload)
  } else {
    userTasks[system] = data
    tasks.update(userTasks)
  }

  console.log(`${tag} - ${logTime()}: stored data - ${system} - ${user}`)
}
