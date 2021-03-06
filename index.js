'use strict'

var TelegramBot = require('node-telegram-bot-api')
var express = require('express')
var request = require('request')
var token = require('./lib/token')
var model = require('./lib/item')
var config = require('./config.json')

var bot = new TelegramBot(config.token, config.options)

bot.on('message', msg => {
  console.log(msg)
  if (msg.text === '/start') {
    return bot.sendMessage(msg.from.id, 'Send me any file or picture and I will host it online!')
  }

  var file = msg.document
  var filetype = file && file.file_type

  if (file && !filetype) {
    var fileNameParts = file.file_name.split('.')

    if (fileNameParts.length > 1) {
      filetype = fileNameParts.pop()
    }
  }

  if (!file && msg.photo) {
    file = msg.photo[msg.photo.length - 1]
  }

  if (!file && msg.audio) {
    file = msg.audio
    filetype = 'mp3'
  }

  if (!file && msg.voice) {
    file = msg.voice
    filetype = 'ogg'
  }

  if (!file && msg.sticker) {
    file = msg.sticker
    filetype = 'webp'
  }

  if (!file) {
    return bot.sendMessage(msg.from.id, 'Just send me anything, dude.')
  }

  var item = new model({
    id: token(),
    author: [msg.from.first_name, msg.from.last_name].join(' '),
    message: msg,
    file_id: file.file_id,
    file_type: filetype || 'jpg',
    date: msg.date
  })

  item.save().then((item) => {
    bot.sendMessage(msg.from.id, [
      config.url,
      [
        item.id,
        item.file_type
      ].join('.')
    ].join('/'))
  })
})

var app = express()

app.use(express.static(require('path').join(__dirname, 'static')))

app.get('/:id.:type', (req, res, next) => {
  if (!req.params || !req.params.id) {
    return
  }

  model.findOne({
    id: req.params.id
  }).then(item => {
    bot.getFileLink(item.file_id).then(link => request(link).on('response', function(resp) {
      delete resp.headers['content-disposition'];
      var type = item.file_type && item.file_type.toLowerCase()

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].indexOf(type) > -1) {
        resp.headers['content-type'] = ['image', type].join('/')
      }
      
      if (type === 'html') {
        resp.headers['content-type'] = ['text', 'html'].join('/')
      }
      
      if (type === 'js') {
        resp.headers['content-type'] = ['text', 'javascript'].join('/')
      }
      
      if (type === 'css') {
        resp.headers['content-type'] = ['text', 'css'].join('/')
      }
    }).pipe(res)).catch(next)
  }).catch(next)
})

app.listen(3000)
console.log('Server launched at', new Date())
