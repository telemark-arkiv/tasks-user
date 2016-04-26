'use strict'

var envs = process.env

var opts = {
  size: 99999,
  wait: 222
}


module.exports = function (options) {
  var seneca = this

  seneca.add('role:tasks, type:user', getTasksUser)
  seneca.add('info:tasks, type:user', updateTasksUser)

  return {
    name: envs.TASKS_USER_TAG || 'tasks-user'
  }
}

function getTasksUser (args, done) {
  var seneca = this
  var user = args.user
  var store = seneca.make('tasks', 'user')

  seneca.act({cmd: 'collect-tasks', type: 'user', user: user})

  function respond () {
    store.list$({user: user}, function (error, list) {
      if (error) {
        console.error(error)
        done(null, {})
      } else {
        var data = {
          user: user,
          data: []
        }

        list.forEach(function (item) {
          data.data = data.data.concat(item.data)
        })

        done(null, data)
      }
    })
  }

  setTimeout(respond, opts.wait)
}

function updateTasksUser (msg, done) {

  done(null, {ok: true})

  var seneca = this
  var user = msg.data.user
  var system = msg.data.system
  var store = seneca.make('tasks', 'user')

  var data = {
    user: user,
    system: system,
    data: msg.data.data
  }

  store.list$( {user: user, system: system}, function (error, list) {
    if (error) {
      console.error(error)
    } else {
      if (list.length > 0) {
        // Data exists, let's overwrite it
        data.id = list[0].id
      }

      store.data$(data)

      store.save$(function (error, msg) {
        if (error) {
          console.error(error)
        } else {
          console.log(msg)
        }
      })
    }
  })
}
