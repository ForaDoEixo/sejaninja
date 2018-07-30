'use strict'

const map = {
    online_north: { x: 28, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    online_south: { x: 0, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    online_east: { x: 14, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    online_west: { x: 28, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    idle_north: { x: 56, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    idle_south: { x: 42, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    idle_east: { x: 56, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    idle_west: { x: 42, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    offline_north: { x: 84, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    offline_south: { x: 70, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    offline_east: { x: 84, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    offline_west: { x: 70, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
    hopping_north: { x: 0, y: 83, w: 35, h: 27, ox: -2, oy: -6 },
    hopping_south: { x: 0, y: 137, w: 35, h: 27, ox: -19, oy: 3 },
    hopping_east: { x: 0, y: 56, w: 35, h: 27, ox: -2, oy: 3 },
    hopping_west: { x: 0, y: 110, w: 35, h: 27, ox: -19, oy: -6 }
}

for (let i = 0; i < 13; i++) {
    map['hopping_north' + i] = Object.assign(map.hopping_north, {x: i*map.hopping_north.w})
    map['hopping_south' + i] = Object.assign(map.hopping_south, {x: i*map.hopping_south.w})
    map['hopping_east' + i] = Object.assign(map.hopping_east, {x: i*map.hopping_east.w})
    map['hopping_west' + i] = Object.assign(map.hopping_west, {x: i*map.hopping_west.w})
}

module.exports = map
