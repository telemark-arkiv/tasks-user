'use strict'

const envs = process.env
const tag = envs.TASKS_USER_TAG || 'tasks-user'
const logTime = require('./log-time')

var store = {}

module.exports = function (options) {
  const seneca = this

  seneca.add('role:tasks, type:user', getTasksUser)
  seneca.add('info:tasks, type:user', updateTasksUser)

  return tag
}

function repackStore (data) {
  var repack = []

  if (data) {
    Object.keys(data).forEach((dataKey) => {
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

  seneca.act({cmd: 'collect-tasks', type: 'user', user: user})

  console.log(`${tag} - ${logTime()}: collects tasks - ${user}`)

  const result = {
    user: user,
    data: repackStore(store[user])
  }

  console.log(`${tag} - ${logTime()}: returns tasks - ${user} - found ${result.data.length}`)
  done(null, result)
}

function updateTasksUser (msg, done) {
  done(null, {ok: true})

  const user = msg.data.user
  const system = msg.data.system
  const data = msg.data.data

  if (!store[user]) {
    store[user] = {}
  }

  if (!store[user][system]) {
    store[user][system] = []
  }

  store[user][system] = data

  console.log(`${tag} - ${logTime()}: stored data - ${system} - ${user}`)
}
