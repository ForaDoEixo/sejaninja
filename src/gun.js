const Gun = require('gun/gun')
const gun = Gun(['http://localhost:8080/gun'])
const chain = gun.get('ninjaZ')

export default chain
