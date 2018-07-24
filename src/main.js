'use strict'
import gun from './gun'

var util = require('./script/common/util.js')
var Preloader = require('./script/engine/preloader.js')
var Game = require('./script/engine/game.js')
var Renderer = require('./script/engine/renderer.js')
var Canvas = require('./script/engine/canvas.js')
var UI = require('./script/ui/ui.js')
var bs = require('browser-storage')

var Konami = require('konami')

// TODO: Loading screen while preloading images, connecting to websocket, and generating world
console.log('Loading...')
var packageInfo = require('../package.json')
var version = packageInfo.version
var preloader = new Preloader(initGame)
var game

function initGame (images) {
  game = new Game({ step: 1000 / 60 })
  game.konami = new Konami()
  game.konami.load('http://midianinja.org')
  game.renderer = new Renderer({ game: game, images: images })
  var canvas = new Canvas({ id: 'main', game: game, initialScale: 2, backgroundColor: '#181213' })
  game.renderer.addCanvas(canvas)
  game.bindCanvas(canvas)
  game.ui = new UI(game)
  // game.showGrid = true;
  // game.timeRenders = true;

  // game.on('update', function () {
  //    // Update
  // });
  initWebsocket()

  window.pause = function () { game.paused = true }
  window.unpause = function () { game.paused = false }
  window.game = game
}

function initWebsocket () {
  var World = require('./script/environment/world.js')
  var Users = require('./script/actors/users.js')
  var Decorator = require('./script/props/decorator.js')
  var users, world, decorator

  game.reset()
  game.renderer.clear()
  const userList = {}
  const ninjas = {}
  world = new World(game, Math.round(3.3 * Math.sqrt(32)))
  decorator = new Decorator(game, world)
  game.decorator = decorator
  users = new Users(game, world)
  game.renderer.canvases[0].onResize()
  const addUser = (user) => {
      if (userList.hasOwnProperty(user.uid)) return
      const actor = users.addActor(user)
  }

  const hashCode = (s) => (
    s.split('')
      .reduce((a, b) => { a = ((a << 2) - a) + b.charCodeAt(0); return a & a }, 0) % 0xffffff)
    .toString(16).padStart(6, '0')


    gun.map().on((data, key) => {
        console.error('key', key, 'data', data)
        ninjas[key] = data
        addUser({
            username: '@' + key,
            id: key,
            link: data.link,
            status: 'online',
            roleColor: '#' + hashCode(key)
        })
    })


  const sendMessage = (ninja) => (
      ninja && users.queueMessage({
          uid: ninja.uid,
          message: ninja.says,
          channel: 'Ninja General'
      })
  )

  setInterval(() => {
      if (Math.random() * 10 < 8) return

      sendMessage(ninjas[util.pickInObject(ninjas)])
  }, 500)
  setInterval(() => (decorator && decorator.beacon.ping()), 2000)

  window.testMessage = function (message) {
    var msg = message ? message.text : 'hello, test message yo!'
    var uid = message ? message.uid : users.actors[Object.keys(users.actors)[0]].uid
    var channel = message ? message.channel : '1'
    /* ws.emit('data', JSON.stringify({ type: 'message',
      data: {
        uid: uid, message: msg, channel: channel
      }})) */
  }
}

window.onpopstate = function (event) {
  var server = { id: event.state.server }
  if (event.state.password) server.password = event.state.password
  joinServer(server)
}

function joinServer (server) {
  var connectionMessage = { type: 'connect', data: { server: server.id } }
  if (server.password) connectionMessage.data.password = server.password
  console.log('Requesting to join server', server.id)
//  ws.write(new Buffer(JSON.stringify(connectionMessage)))
}

function getStartupServer () {
  // Get startup server, first checking URL params, then localstorage
  var startupServer = { id: util.getURLParameter('s') } // Check URL params
  if (!startupServer.id) {
    startupServer = bs.getItem('dzone-default-server') // Check localstorage
    if (startupServer) startupServer = JSON.parse(startupServer)
  }
  if (!startupServer/* || !game.servers[startupServer.id] */) startupServer = { id: 'default' }
  if (util.getURLParameter('p')) startupServer.password = util.getURLParameter('p')
  return startupServer
}

// setTimeout(function() { game.paused = true; },1000);
