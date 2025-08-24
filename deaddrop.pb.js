routerAdd('GET', '/deaddrop/{file}', e => {
  const botToken = $app.findFirstRecordByData('deaddrop_meta', 'key', 'botToken').get('value')
  const [publicId] = e.request.pathValue('file').split('.')

  const getMimeType = msg => {
    msg = JSON.parse(msg)

    if (msg.document) {
      return msg.document.mime_type
    }

    if (msg.audio) {
      return msg.audio.mime_type
    }

    if (msg.voice) {
      return 'audio/ogg'
    }

    if (msg.sticker) {
      return 'image/webp'
    }

    if (msg.photo) {
      return 'image/jpg'
    }
  }

  try {
    const file = $app.findFirstRecordByData('deaddrop', 'publicId', publicId)

    const res = $http.send({
      url: `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(file.get('fileId'))}`
    })

    const data = $http.send({
      url: `https://api.telegram.org/file/bot${botToken}/${res.json.result.file_path}`
    })

    return e.blob(200, getMimeType(file.get('message')), data.body)
  } catch (e) {}

  return e.redirect(307, 'https://dd.th61.com')
})

routerAdd('POST', '/hook', e => {
  const botToken = $app.findFirstRecordByData('deaddrop_meta', 'key', 'botToken').get('value')
  const body = e.requestInfo().body
  const msg = body?.message

  const reply = text => {
    if (!msg?.chat?.id) {
      return
    }

    $http.send({
      url: `https://api.telegram.org/bot${botToken}/sendMessage`,
      method: 'POST',
      body: JSON.stringify({
        chat_id: msg.chat.id,
        text,
        parse_mode: 'html',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const getFile = msg => {
    if (msg?.document) {
      return msg.document
    }

    if (msg?.audio) {
      return msg.audio
    }

    if (msg?.voice) {
      return msg.voice
    }

    if (msg?.sticker) {
      return msg.sticker
    }

    if (msg?.photo) {
      return msg.photo[msg.photo.length - 1]
    }
  }

  const getFileExt = msg => {
    if (msg?.sticker) {
      return 'webp'
    }

    if (msg?.voice) {
      return 'ogg'
    }

    if (msg?.audio) {
      return 'mp3'
    }

    if (msg?.document) {
      if (msg.document.file_type) {
        return msg.document.file_type
      }

      const fileNameParts = msg.document.file_name.split('.')

      if (fileNameParts.length > 1) {
        return fileNameParts.pop()
      }
    }

    return 'jpg'
  }

  const file = getFile(msg)
  const ext = getFileExt(msg)

  if (msg?.text === '/start') {
    reply('Send me any file or picture and I will host it online!')
  } else if (!file || !file.file_id) {
    reply('Just send me anything, dude.')
  } else {
    const model = $app.findCollectionByNameOrId('deaddrop')
    const record = new Record(model)

    record.set('publicId', Math.random().toString(36).slice(2))
    record.set('fileId', file.file_id)
    record.set('fileType', ext)
    record.set('author', [msg.from.first_name, msg.from.last_name].join(' '))
    record.set('origDate', new Date())
    record.set('message', msg)

    $app.save(record)

    reply(`https://dd.th61.com/${record.get('publicId')}.${ext}`)
  }

  return e.json(200, { ok: true })
})
