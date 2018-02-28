const { SoloEmitter, Emitter } = require('../dist/eray')

// SoloEmitter is used for single event emitter
let soloEmitter = SoloEmitter.of()
const listener = (r) => { console.log('listener 1:' + r) }

soloEmitter.on(listener)
soloEmitter.once((r) => { console.log('listener 2:' + r) })
soloEmitter.emit([1, 2])
//=> listener 1:1,2
//=> listener 2:1,2

soloEmitter.removeAllListeners()
soloEmitter.emit([3, 4])
//=> no listener no output

soloEmitter.prependListener(listener)
soloEmitter.prependOnceListener((r) => { console.log('listener 2:' + r) })
soloEmitter.emit([5, 6])
//=> listener 2:5,6
//=> listener 1:5,6

soloEmitter.emit([7, 8])
//=> listener 1:7,8

soloEmitter.off(listener)
soloEmitter.emit([7, 8])
//=> no listener no output


// Emitter is used for multiple event emitter
let emitter = Emitter.of()

emitter.on('x', listener)
emitter.once('x', (r) => { console.log('listener 2:' + r) })
emitter.emit('x', [1, 2])
//=> listener 1:1,2
//=> listener 2:1,2

emitter.removeAllListeners('x')
emitter.emit([3, 4])
//=> no listener no output

emitter.prependListener('y', listener)
emitter.prependOnceListener('y', (r) => { console.log('listener 2:' + r) })
emitter.emit('y', [5, 6])
//=> listener 2:5,6
//=> listener 1:5,6

emitter.emit('y', [7, 8])
//=> listener 1:7,8

emitter.off('y', listener)
emitter.emit('y', [7, 8])
//=> no listener no output
