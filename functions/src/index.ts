import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

const config = functions.config();

const bot = new Telegraf(config.telegram.token, {
    telegram: { webhookReply: true },
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('hello', (ctx) => ctx.reply('Hello, friend!'));

const PROJECT_ID = 'song-bot-1232f';
const REGION = 'us-central1';
const FUNCTION_NAME = 'botFunction';

const url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`;
const url_dev = `https://969f-46-250-20-79.ngrok.io/${PROJECT_ID}/${REGION}/${FUNCTION_NAME}`;

bot.telegram.setWebhook(url);

// error handling
bot.catch((err, ctx) => {
    functions.logger.error('[Bot] Error', err);
    ctx.reply(
        `Ooops, encountered an error for ${ctx.updateType}`,
        err as ExtraReplyMessage
    );
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const botFunction = async (req: Request, res: Response) => {
    functions.logger.log('Incoming message', req.body);
    try {
        await bot.handleUpdate(req.body);
    } finally {
        res.status(200).end();
    }
};

bot.launch();

exports.botFunction = functions.https.onRequest(botFunction);
