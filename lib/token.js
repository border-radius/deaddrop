'use strict'

var crypto = require('crypto')

module.exports = () => {
  var randomString = crypto.randomBytes(9).toString('base64')
  randomString = randomString.replace(/\//g, '-')
  randomString = randomString.replace(/\+/g, '_')
  randomString = randomString.replace(/\=/g, '.')

  return randomString
}
