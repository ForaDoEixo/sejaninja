const sheet = require('./sheets/world')

const buildNoiseMap = (width, height) => {
    const map = []
    for (var y = 0; y < height; y++) {
        map.push([])
        for (var x = 0; x < width; x++) {
            map[y].push(Math.random())
        }
    }
    return map
}

const coords = ['W', 'N', 'E', 'S']

for (let i = 0; i < 9; i++) {
    sheet['GGGG' + i] = { x: i*32, y: 6*18, w: 32, h: 18 }
}

const noise2Tile = (noise) =>  {
    const map = []
    for ( let y = 0; y < noise.length - 1; y++) {
        map[y] = []
        for ( let x = 0; x < noise[y].length -1 ; x++) {
            map[y][x] = n2E(noise[y][x]) + n2E(noise[y][x+1]) 
                + n2E(noise[y+1][x+1]) + n2E(noise[y+1][x])
        }
    }
    return map
}

const n2E = p => p < 0.2 ? 'E' : p < 0.4 ? 'S' : 'G'

const makeMap = (size) => {
    const S = (size/2)*4
    const R = size
    const Br = R/3  + 1
    const sr = R/1.5 + 1
    const noise = {
        B: buildNoiseMap(Br, Br),
        s: buildNoiseMap(sr, sr)
    }
    const Bb = (Br - 1)/S
    const sb = (sr - 1)/S
    
    const map = []
    for (let y = 0; y < S; y++) {
        map[y] = []
        for (let x = 0; x < S; x++) {
            const c = 1 - (Math.abs(x - R) + Math.abs(y - R))/R
            map[y][x] = (
                noise.B[Math.floor(y * Bb)][Math.floor(x * Bb)] +
                    noise.s[Math.floor(y * sb)][Math.floor(x * sb)]*2)/1.5*c
        }
    }
    console.log(map.length, map[0].length, map)
    return noise2Tile(map)
}


module.exports = {
    makeMap,
    sheet
}

