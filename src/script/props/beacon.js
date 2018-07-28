'use strict'
var inherits = require('inherits')
var WorldObject = require('./../engine/worldobject.js')
var BetterCanvas = require('./../common/bettercanvas.js')
var Sheet = require('./sheet.js')
var Flag = require('./flag')

module.exports = Beacon
inherits(Beacon, WorldObject)

function Beacon (opts, x, y, z) {
  WorldObject.call(this, {
    position: { x: x, y: y, z: z },
    dimentions: { w: 2, W: 1},
    pixelSize: { x: 20, y: 20, z: 45 },
    height: 3.0
  })
  // console.log('beacon:',this.position);
  this.link = 'https://t.me/midianinja'
  this.unWalkable = true
  var self = this
  this.on('draw', function (canvas) {
    if (self.exists) canvas.drawEntity(self)
  })
  this.imageName = 'props'
  this.sheet = new Sheet(opts.sheet)
  if (this.sheet.map.shade) {
    this.animate = true
  }
  this.sprite.metrics = this.sheet.map.main
  if (opts.flag) { this.flag = new Flag({x, y, z}) }
  if (opts.hover) { this.hoverable = true }
}

Beacon.prototype.addToGame = function (game) {
  WorldObject.prototype.addToGame.call(this, game)
  this.game.on('update', this.onUpdate.bind(this))
  this.drawSprite()
  if (this.flag) { this.flag.addToGame(game) }
}

let t = 0
Beacon.prototype.drawSprite = function () {
  var canvas = new BetterCanvas(this.sheet.map.main.w, this.sheet.map.main.h + 13)
  canvas.drawImage(this.game.renderer.images[this.imageName],
    this.sheet.map.main.x, this.sheet.map.main.y, this.sheet.map.main.w, this.sheet.map.main.h,
    this.sheet.map.main.ox, this.sheet.map.main.oy, this.sheet.map.main.w, this.sheet.map.main.h)
  if (this.pinging && this.sheet.map.light) {
    canvas.drawImage(this.game.renderer.images[this.imageName],
      this.sheet.map.light.x, this.sheet.map.light.y, this.sheet.map.light.w, this.sheet.map.light.h,
      this.sheet.map.light.ox, this.sheet.map.light.oy, this.sheet.map.light.w, this.sheet.map.light.h, this.pinging / 100)
  }
  if (this.sheet.map.shade) {
    if (t < 50) {
      const context = canvas.context
      context.save()
      context.strokeStyle = 'red'
      context.beginPath()
      context.moveTo(149, 51)
      context.lineTo(178, 26)
      context.lineTo(178, 44)
      context.lineTo(149, 68)

      context.lineTo(148, 56)
      context.lineTo(148, 73)
      context.lineTo(119, 97)
      context.lineTo(119, 79)
      context.lineTo(148, 56)
      context.closePath()
      // context.stroke()
      context.clip()

      canvas.drawImage(this.game.renderer.images[this.imageName],
        this.sheet.map.shade.x, this.sheet.map.shade.y, this.sheet.map.shade.w, this.sheet.map.shade.h,
        this.sheet.map.shade.ox(t), this.sheet.map.shade.oy(t), this.sheet.map.shade.w, this.sheet.map.shade.h)
      context.restore()
    }
    t = (t + 1) % 150
  }
  this.sprite.image = canvas.canvas
}

Beacon.prototype.onUpdate = function () {
  if (this.pinging) {
    this.pinging = Math.max(0, this.pinging - 1)
    this.drawSprite()
  }

  if (this.animate) {
    this.drawSprite()
  }

  if (this.hoverable) {
    if (this.game.mouseOut || (this.game.mouseOver &&
                               (this.game.mouseOver.zDepth > this.zDepth || // Don't override closer objects
                                this.game.mouseOver.position.z > this.position.z)) || // Don't override higher objects
        this.game.ui.mouseOnElement) return // Ignore if mouse on UI element
    var mouse = {
      x: this.game.centerMouseX - this.game.renderer.canvases[0].panning.panned.x,
      y: this.game.centerMouseY - this.game.renderer.canvases[0].panning.panned.y
    }
    var metrics = this.sheet.map.main
    if (mouse.x + 15 >= metrics.ox &&
          mouse.x + 15 < metrics.w + metrics.ox &&
          mouse.y + 40 >= metrics.oy &&
          mouse.y + 40 < metrics.h + metrics.oy) {
      this.game.mouseOver = this
    } else if (this.game.mouseOver === this) {
      this.game.mouseOver = false
    }
  }
}

Beacon.prototype.ping = function () {
  this.pinging = 100
}
