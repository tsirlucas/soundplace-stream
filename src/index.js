const express = require('express');

const { createReadStream, getStreamURLPromise } = require('./stream');
const { preCache } = require('./cache');
const { createFullHead } = require('./util');
const searchVideoReq = require('./youtube-api');

const app = express();

const searchVideo = async ({ params }, res) => {
    const videoId = await searchVideoReq(params.videoSearch);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ videoId }));

    preCache(videoId);
};

const getAudioStream = async ({ params, headers }, res) => {
    if (headers.save) {
        const { readStream, size } = await createReadStream(params.videoId);
        const head = createFullHead(size);

        res.writeHead(200, head);
        readStream.pipe(res)
    } else {
        const streamURL = await getStreamURLPromise(params.videoId);

        res.redirect(streamURL);
    }
};

const searchAudioStream = async ({ params, headers }, res) => {
    const videoId = await searchVideoReq(params.videoSearch);

    await getAudioStream({ params: { videoId }, headers }, res);
};

app.get('/', (req, res) => res.send('See https://github.com/tsirlucas/youtube-cacheable-audio-stream for more information'));

app.get('/searchAudioStream/:videoSearch', searchAudioStream);

app.get('/searchVideo/:videoSearch', searchVideo);

app.get('/getAudioStream/:videoId', getAudioStream);

module.exports = app;