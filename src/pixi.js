'use strict;'
import * as PIXI from 'pixi.js'
import {makeMap} from './map'
import Actor from './actor'
import TextureCache from './textures'

const pixi = () => {
    const WIDTH = 700
    const HEIGHT = 300

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const app = new PIXI.Application({
        width: WIDTH, 
        height:HEIGHT, 
        resolution: 2,
        sharedTicker: true
    })
    const stage = app.stage
    
    const onLoaded = () => {
        const cache = new TextureCache(PIXI.loader.resources)
        cache.load('world', require('./map').sheet)
        cache.load('actor', require('./sheets/actor'))

        console.log(cache)

      // An iso tile is twice as wide as it is tall (2w x h)
      function gfxTile(stage, signature) { 
          if (signature === 'GGGG') {
              signature += Math.floor(Math.random()*9)
          }
          const texture = cache.get('world')[signature]

          return (x, y) => {
              const tile = new PIXI.Sprite(texture)
              tile.x = x
              tile.y = y
              
              stage.addChild(tile)
          }
      }

        const terrain = makeMap(8)
        var tileHeight = 16;
        var tileWidth = 16;

        function drawMap(terrain, xOffset) {
            var tileType, x, y, isoX, isoY, idx;

            for (var i = 0, iL = terrain.length; i < iL; i++) {
                for (var j = 0, jL = terrain[i].length; j < jL; j++) {
                    // cartesian 2D coordinate
                    x = j * tileWidth;
                    y = i * tileHeight;

                    // iso coordinate
                    isoX = x - y;
                    isoY = (x + y) / 2;

                    tileType = terrain[i][j];
                    const drawTile = gfxTile(stage, tileType)
                    drawTile(xOffset + isoX, isoY);
                }
            }
        }
        console.log(terrain)
        drawMap(terrain, WIDTH / 8);

        const addActor = (opts) => {
            const actor = new Actor(cache.get('actor'), Object.assign({}, {
                mood: 'hopping',
            }, opts))
            
            stage.addChild(actor.sprite) 
        }
        addActor({x: 200, y: 100})

            setTimeout(() => {        
        for (let i = 0; i < 100; i++) {

                addActor({
                    x: Math.floor(Math.random()*350), 
                    y: Math.floor(Math.random()*250),
                    tint: Math.floor(Math.random()*0xFFFFFF),
                })
        }
            }, Math.random()*500)
    }

    PIXI.loader    
          .add ([{name: 'world', url: require('./img/static-tiles.png')}])
          .add ([{name: 'actor', url: require('./img/actors.png')}])
          .load(onLoaded)
    
    app.start()
    return app
}
export default pixi
