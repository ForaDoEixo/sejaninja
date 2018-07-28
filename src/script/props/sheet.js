'use strict'

const cubicInOut = (t, b = 0, c = 25 , d = 50) => {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

const animate = (se) => (t) => cubicInOut(t, se.s, se.e - se.s)
const bounds = (min, max) => (v) => v < min ? min : v > max ? max : v

var map = {
  ninja: {
    main: {x: 0, y: 13, w: 39, h: 70, ox: 0, oy: 13},
    light: {x: 0, y: 0, w: 5, h: 4, ox: 13, oy: 13}
  },
  seja: {
      main: {x: 44, y: 0, w: 179, h: 100, ox: 0, oy: 0},
      shade: {x: 225, y: 3, w: 20, h: 30,
              mask: {x: bounds(112, 175) , y: y => y},
              ox: animate({s: 172, e: 98}),
              oy: animate({s: 14, e: 77})},
  },
  seed: {
    plant: {x: 36, y: 0, w: 16, h: 22, ox: 2, oy: 2},
    orb: {x: 36, y: 22, w: 8, h: 8, ox: 8, oy: 4}
  },
  flag: {x: 6, y: 0, w: 9, h: 13, ox: 5, oy: -30}
}

module.exports = Sheet

function Sheet (spriteName) {
  this.map = JSON.parse(JSON.stringify(map[spriteName]))
}
