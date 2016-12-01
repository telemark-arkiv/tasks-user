'use strict'

const envs = process.env
const wait = envs.TASKS_USER_WAIT || 222
const tag = envs.TASKS_USER_TAG || 'tasks-user'

const opts = {
  size: 99999,
  wait: parseInt(wait, 10)
}

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
      repack.concat(data[dataKey].data)
    })
  }

  return repack
}

function getTasksUser (args, done) {
  const seneca = this
  const user = args.user

  seneca.act({cmd: 'collect-tasks', type: 'user', user: user})

  console.log(`${tag}: collects tasks - ${user}`)

  function respond () {
    const result = {
      user: user,
      data: repackStore(store[user])
    }
    done(null, result)
  }

  setTimeout(respond, opts.wait)
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

  console.log(`${tag}: stored data - ${system} - ${user}`)
}
