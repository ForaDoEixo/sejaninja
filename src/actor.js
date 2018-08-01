const sheet = require('./sheets/actor')
const PIXI = require('pixi.js')

const defaultOpts = {
    mood: 'offline', 
    direction: 'north', 
    x: 0 , y: 0,
    speed: 0.3,
    tint: 0xFFFFFF
}

const directions = ['north', 'east', 'south', 'west']
const moves = {
    north: {x:  16, y: -8, ox: -2, oy: -6},
    east:  {x:  16, y:  8, ox: -2, oy: 3},
    south: {x: -16, y:  8, ox: -19, oy: 3},
    west:  {x: -16, y: -8, ox: -19, oy: -6}
}

const hops = () => 0

module.exports = class Actor {
    constructor(cache, optArg) {
        const opts = Object.assign(defaultOpts, optArg)
        this.cache = cache
        this._mood = opts.mood
        this._direction = opts.direction
       
        this.sprite = new PIXI.extras.AnimatedSprite(this.getTextures())
        let move = moves[opts.direction]
        this.move(move.ox, move.oy)

        this.sprite.animationSpeed = opts.speed
        this.sprite.tint = opts.tint
        this.sprite.loop = false
        this.hops = hops()
        this.sprite.onComplete = () => {
            move = moves[this.direction]
            this.move(move.x, move.y)
            console.log('move', move)
            
            if (! this.hops-- ) {
                this.hops = hops()
                this.direction = directions[
                    (directions.indexOf(this.direction) + directions.length + 1)%directions.length
                ]
                console.log('direction', this.direction)
            } else {
                this.sprite.gotoAndPlay(0)
            }
        }
        this.move(opts.x, opts.y)

        this._reloadSprite(opts.mood)
        console.log('actor', this)
    }

    getTextures() {
        if (this._mood !== 'hopping')
            return [this.cache[this._mood + '_' + this._direction]]
        const frames = []
        
        for (let i = 0; i <13; i++) {
            frames.push(this.cache[this._mood + '_' + this._direction + i].clone())
        }
        return frames
    }

    get mood() { return this._mood }
    set mood(mood) {
        this._mood = mood; 
        this._reloadSprite(mood)
    }

    _reloadSprite(mood) {
        this.sprite._textures = this.getTextures()
        this.sprite.gotoAndPlay(0)
    }

    get direction() { return this._direction }
    set direction(dir) { 
        if (dir !== this._direction) {
            const prev = moves[dir]
            const next = moves[this._direction]
            console.log('moving', dir)
            this.move(prev.ox - next.ox, prev.oy - next.oy)
        }
        this._direction = dir; 
        this._reloadSprite()
    }

    move(x, y) {
        this.sprite.x += x
        this.sprite.y += y
    }

    add() {
        this.stage.addChild(this.sprite)
    }
}
