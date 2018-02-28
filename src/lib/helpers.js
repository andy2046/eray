function verifyFunction (f) {
  const type = typeof f

  if (type !== 'function') {
    throw new TypeError('Expected a function but got ' + type)
  }
}

function verifyMaxListeners (MaxListeners) {
  if (!(typeof MaxListeners === 'number' && MaxListeners >= 1)) {
    throw new TypeError('Expected MaxListeners to be a number >= 1')
  }
}

module.exports = {
  verifyFunction,
  verifyMaxListeners
}
