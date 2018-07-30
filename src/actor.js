const sheet = require('./sheets/actor')
const PIXI = require('pixi.js')

const defaultOpts = {
    mood: 'offline', 
    direction: 'north', 
    x: 0 , y: 0 
}

module.exports = class Actor {
    constructor(cache, optArg) {
        const opts = Object.assign(defaultOpts, optArg)
        this.cache = cache

        // XXX(xaiki): ordering here is a bit trickier than it should be
        this._mood = opts.mood
        this._direction = opts.direction

        this.sprite = new PIXI.Sprite()
        this.sprite.texture = this.getTextures()[0]
        this.move(opts.x, opts.y)

        this._resetMood(opts.mood)
        console.log('actor', this)
    }

    getTextures() {
        clearInterval(this.anim)
        if (this._mood !== 'hopping')
            return [this.cache[this._mood + '_' + this._direction]]
        const frames = []
        
        for (let i = 0; i <13; i++) {
            frames.push(this.cache[this._mood + '_' + this._direction + i])
        }
        
        this.ti = 0
        const sprite = this.sprite
        this.anim = setInterval(() => {
            console.log('tick')
            this.ti++
            this.ti %= frames.length
            sprite.setTexture(frames[this.ti])
        }, 500)

        return frames
    }

    get mood() { return this._mood }
    set mood(mood) {
        this._mood = mood; 
        this._resetMood(mood)
    }

    _resetMood(mood) {
        console.log('reset mood', mood)
        this.sprite.texture = this.getTextures()[0]
    }

    get direction() { return this._direction }
    set direction(dir) { this._direction = dir; this._reloadSprite() }

    move(x, y) {
        this.pos = {x, y}
        this.sprite.x = x
        this.sprite.y = y
    }

    add() {
        this.stage.addChild(this.sprite)
    }
}
