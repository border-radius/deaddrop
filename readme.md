deaddrop
==============

Telegram bot for easy filesharing: send any file to bot and get public link

Installation
============

```
git clone https://github.com/border-radius/deaddrop
cd deaddrop
npm install
```

Also, you need to create `config.json` like this:

```
{
  "url": "http://deaddrop.ftp.sh",
  "mongodb": "mongodb://localhost/deaddrop",
  "token": "TELEGRAM_BOT_TOKEN",
  "options": {
    "polling": {
      "timeout": 5
    }
  }
}

```

Launch server:

```
node index.js
```
