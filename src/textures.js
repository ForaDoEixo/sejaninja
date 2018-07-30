import * as PIXI from 'pixi.js'

export default class TextureCache {
    constructor(resources) {
        this.resources = resources
        this.textures = {}
    }

    get(key) {
        return this.textures[key]
    }

    set(key, value) {
        this.textures[key] = Object.assign({}, this.textures[key], value)
    }

    load(key, sheet) {
        console.log('parsing', key, sheet)
        const cache = Object.keys(sheet).reduce((acc, cur) => {
            const image = sheet[cur]
            const texture = this.resources[key].texture.clone()
            const rectangle = new PIXI.Rectangle(image.x, image.y, image.w, image.h)
            
            texture.frame = rectangle
            return Object.assign({}, acc, {
                [cur]: texture
            })
        }, {})
        this.set(key, cache)
        return cache
    }
}
