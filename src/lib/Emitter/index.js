const SoloEmitter = require('../SoloEmitter')
const { verifyFunction, verifyMaxListeners } = require('../helpers')

const Emitter = (function () {
  let _defaultMaxListeners = 10

  class Emitter {
    constructor (opts) {
      this._opts = opts
      this._events = {}
      this._MaxListeners = null
    }

    _initEventEmitter (eventName) {
      if (!this._events[eventName]) {
        this._events[eventName] = SoloEmitter.of(this._opts)
      }
    }

    on (eventName, listener) {
      verifyFunction(listener)
      this._initEventEmitter(eventName)
      this._events[eventName].on(listener)
      return this
    }

    addListener (eventName, listener) {
      return this.on(eventName, listener)
    }

    once (eventName, listener) {
      verifyFunction(listener)
      this._initEventEmitter(eventName)
      this._events[eventName].once(listener)
      return this
    }

    removeListener (eventName, listener) {
      if (this._events[eventName]) {
        this._events[eventName].removeListener(listener)
      }
      return this
    }

    off (eventName, listener) {
      return this.removeListener(eventName, listener)
    }

    removeAllListeners (eventName) {
      if (this._events[eventName]) {
        this._events[eventName].removeAllListeners()
      } else {
        const values = Object.values(this._events)
        for (let i = 0; i < values.length; i++) {
          values[i].removeAllListeners()
        }
      }
      return this
    }

    getMaxListeners () {
      return this._MaxListeners || _defaultMaxListeners
    }

    setMaxListeners (MaxListeners) {
      verifyMaxListeners(MaxListeners)
      this._MaxListeners = MaxListeners
      const values = Object.values(this._events)
      for (let i = 0; i < values.length; i++) {
        values[i].setMaxListeners(MaxListeners)
      }
      return this
    }

    listenerCount (eventName) {
      return this._events[eventName].listenerCount()
    }

    listeners (eventName) {
      return this._events[eventName].listeners()
    }

    prependListener (eventName, listener) {
      verifyFunction(listener)
      this._initEventEmitter(eventName)
      this._events[eventName].prependListener(listener)
      return this
    }

    prependOnceListener (eventName, listener) {
      verifyFunction(listener)
      this._initEventEmitter(eventName)
      this._events[eventName].prependOnceListener(listener)
      return this
    }

    eventNames () {
      return Object.keys(this._events)
    }

    emit (eventName, ...args) {
      if (!this._events[eventName]) {
        return false
      }
      return this._events[eventName].emit(...args)
    }
  }

  Object.defineProperty(Emitter, 'defaultMaxListeners', {
    configurable: false,
    enumerable: true,
    get () { return _defaultMaxListeners },
    set (n) {
      verifyMaxListeners(n)
      _defaultMaxListeners = n
      SoloEmitter.defaultMaxListeners = n
    }
  })

  Object.defineProperty(Emitter, 'of', {
    value: function (opts) {
      return new Emitter(opts)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return Emitter
})()

module.exports = Emitter
