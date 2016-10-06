'use strict'

var mongoose = require('mongoose')
var config = require('../config.json')

mongoose.Promise = global.Promise
mongoose.connect(config.mongodb)

var schema = new mongoose.Schema({
  id: String,
  author: String,
  message: Object,
  file_id: String,
  file_type: String,
  date: Number
})

module.exports = mongoose.model('item', schema)
