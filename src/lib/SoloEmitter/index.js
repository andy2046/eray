const { verifyFunction, verifyMaxListeners } = require('../helpers')

const SoloEmitter = (function () {
  let _defaultMaxListeners = 10

  class SoloEmitter {
    constructor (opts) {
      this._opts = opts
      this._MaxListeners = null
      this._currentListeners = []
      this._nextListeners = this._currentListeners
    }

    _ensureCanMutateNextListeners () {
      if (this._nextListeners === this._currentListeners) {
        this._nextListeners = this._currentListeners.slice()
      }
    }

    on (listener) {
      verifyFunction(listener)
      this._ensureCanMutateNextListeners()
      this._checkMaxListenersExceeded()
      this._nextListeners.push(listener)
      return this
    }

    addListener (listener) {
      return this.on(listener)
    }

    once (listener) {
      verifyFunction(listener)
      const context = this
      return this.on(function f (...args) {
        context.removeListener(f)
        listener.apply(context, args)
      })
    }

    off (listener) {
      return this.removeListener(listener)
    }

    removeListener (listener) {
      this._ensureCanMutateNextListeners()
      const index = this._nextListeners.indexOf(listener)
      if (index > -1) {
        this._nextListeners.splice(index, 1)
      }
      return this
    }

    removeAllListeners () {
      this._currentListeners = []
      this._nextListeners = this._currentListeners
      return this
    }

    getMaxListeners () {
      return this._MaxListeners || _defaultMaxListeners
    }

    setMaxListeners (MaxListeners) {
      verifyMaxListeners(MaxListeners)
      this._MaxListeners = MaxListeners
      return this
    }

    listenerCount () {
      return this._nextListeners.length
    }

    listeners () {
      return this._nextListeners.slice()
    }

    prependListener (listener) {
      verifyFunction(listener)
      this._ensureCanMutateNextListeners()
      this._checkMaxListenersExceeded()
      this._nextListeners.unshift(listener)
      return this
    }

    prependOnceListener (listener) {
      verifyFunction(listener)
      const context = this
      return this.prependListener(function f (...args) {
        context.removeListener(f)
        listener.apply(context, args)
      })
    }

    _checkMaxListenersExceeded () {
      if (this._nextListeners.length > this.getMaxListeners()) {
        if (console && console.warn) {
          console.warn('Warning: MaxListeners Exceeded')
        }
      }
    }

    emit (...args) {
      this._currentListeners = this._nextListeners
      const listeners = this._currentListeners

      if (!listeners.length) {
        return false
      }

      for (let i = 0; i < listeners.length; i++) {
        listeners[i](...args)
      }
      return true
    }
  }

  Object.defineProperty(SoloEmitter, 'defaultMaxListeners', {
    configurable: false,
    enumerable: true,
    get () { return _defaultMaxListeners },
    set (n) {
      verifyMaxListeners(n)
      _defaultMaxListeners = n
    }
  })

  Object.defineProperty(SoloEmitter, 'of', {
    value: function (opts) {
      return new SoloEmitter(opts)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return SoloEmitter
})()

module.exports = SoloEmitter
