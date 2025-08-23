# Deaddrop Bot

This repository hosts a Telegram bot designed to generate URLs for any received files, including photos, videos, zips, and more.

## Getting Started

To set up the Deaddrop bot, please follow these steps:

1. **Copy Files**: Place `deaddrop.pb.js` into the `pb_hooks` directory of your PocketBase instance.

   Make sure to replace `dd.th61.com/` with your own domain: `yourpocketbasedomain.com/deaddrop/`.

2. **Import Collection**: Import the collection from `pb_schema.json` by navigating to **Settings > Import Collections**.

   **Important**: During the import process, select the "Merge with existing collections" option.

3. **Configure Metadata**: Create new records in the `deaddrop_meta` collection:

   - `botToken`: Input your Telegram Bot Token.

4. **Setup Telegram Webhook**: Make an HTTP request to configure the webhook with the Telegram Bot API.

   Use the following URL format: `https://api.telegram.org/bot{my_bot_token}/setWebhook?url={URL_ENCODED_BOT_ENDPOINT}`

   Replace `{URL_ENCODED_BOT_ENDPOINT}` with the URL-encoded version of `https://yourpocketbasedomain.com/hook`.

## How It Works

Whenever the Telegram bot receives a new message, it triggers a webhook containing that message.

The webhook endpoint saves the file ID from the message into the `deaddrop` collection and replies with a generated URL.

When a user clicks this URL, PocketBase retrieves the file ID from the `deaddrop` collection and streams the file content directly from Telegram servers as a response.
