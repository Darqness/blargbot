var e = module.exports = {};
var path = require('path');
var util = require('util');
const Jimp = require('jimp');
const fs = require('fs');
const GIFEncoder = require('gifencoder');
const request = require('request');

e.init = () => {
    e.category = bu.CommandType.GENERAL;
};

e.requireCtx = require;

e.isCommand = true;
e.hidden = false;
e.usage = 'triggered [user]';
e.info = `Shows everyone how triggered you are.`;
e.longinfo = `<p>Shows everyone how triggered you are.</p>`;

e.execute = async function(msg, words) {
    let user = msg.author;
    if (words[1]) {
        user = await bu.getUser(msg, words.slice(1).join(' '));
    }
    await bot.sendChannelTyping(msg.channel.id);
    let frameCount = 4;
    let frames = [];

    request({
        uri: user.avatarURL,
        encoding: null
    }, async function(err, res, body) {
        let avatar = await Jimp.read(body);
        avatar.resize(320, 320);
        let triggered = await Jimp.read(path.join(__dirname, '..', 'img', `triggered.png`))
        triggered.resize(200, 30);
        let buffers = [];
        let encoder = new GIFEncoder(256, 256);
        let stream = encoder.createReadStream();

        stream.on('data', function(buffer) {
            buffers.push(buffer);
        });
        stream.on('end', function() {
            let buffer = Buffer.concat(buffers);
            bu.send(msg, undefined, {
                file: buffer,
                name: 'TRIGGERED.gif'
            });
        });


        let base = new Jimp(256, 256);

        let temp = base.clone();
        let x = -32 + (bu.getRandomInt(-16, 16));
        let y = -32 + (bu.getRandomInt(-16, 16));
        temp.composite(avatar, x, y);
        x = 28 + (bu.getRandomInt(-4, 4));
        y = 210 + (bu.getRandomInt(-4, 4));
        temp.composite(triggered, x, y);
        frames.push(temp.bitmap.data);

        temp = base.clone();
        x = -32 + (bu.getRandomInt(-16, 16));
        y = -32 + (bu.getRandomInt(-16, 16));
        temp.composite(avatar, x, y);
        x = 28 + (bu.getRandomInt(-4, 4));
        y = 210 + (bu.getRandomInt(-4, 4));
        temp.composite(triggered, x, y);
        frames.push(temp.bitmap.data);

        temp = base.clone();
        x = -32 + (bu.getRandomInt(-16, 16));
        y = -32 + (bu.getRandomInt(-16, 16));
        temp.composite(avatar, x, y);
        x = 28 + (bu.getRandomInt(-4, 4));
        y = 210 + (bu.getRandomInt(-4, 4));
        temp.composite(triggered, x, y);
        frames.push(temp.bitmap.data);

        temp = base.clone();
        x = -32 + (bu.getRandomInt(-16, 16));
        y = -32 + (bu.getRandomInt(-16, 16));
        temp.composite(avatar, x, y);
        x = 28 + (bu.getRandomInt(-4, 4));
        y = 210 + (bu.getRandomInt(-4, 4));
        temp.composite(triggered, x, y);
        frames.push(temp.bitmap.data);

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(20);
        for (let frame of frames) encoder.addFrame(frame);
        encoder.finish();
    })
};