const express = require('express');

const { createReadStream, getStreamURLPromise } = require('./stream');
const { createFullHead } = require('./util');
const searchVideoReq = require('./youtube-api');

const app = express();

const searchVideo = async ({ params }, res) => {
    const videoId = await searchVideoReq(params.videoSearch);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ videoId }));
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

app.get('/', (req, res) => res.send('See https://github.com/tsirlucas/youtube-cacheable-audio-stream'));

app.get('/searchAudioStream/:videoSearch', searchAudioStream);

app.get('/searchVideo/:videoSearch', searchVideo);

app.get('/getAudioStream/:videoId', getAudioStream);

app.listen(process.env.PORT || 3000, () => console.log('Server listening on port 3000!'));

if (proccess.env.HEROKU_ENV) {
    // prevent heroku app from sleeping

    const http = require("http");
    
    setInterval(function () {
        http.get("https://youtube-cacheable-audio-stream.herokuapp.com/");
    }, 300000); // every 5 minutes (300000)
}