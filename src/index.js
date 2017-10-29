const express = require('express');
const https = require('https');
const http = require('http');

const { checkCacheDir } = require('./cache');
const { createReadStream, getStreamURLPromise } = require('./stream');
const { createFullHead } = require('./util');

const app = express();

checkCacheDir();

const getAudioStream = async ({ params, headers }, res) => {

    if (headers.save) {
        const { readStream, size } = await createReadStream(params.videoSearch);
        const head = createFullHead(size);

        res.writeHead(200, head);
        readStream.pipe(res)
    } else {
        const streamURL = await getStreamURLPromise(params.videoSearch);

        res.redirect(streamURL);
        await createReadStream(params.videoSearch, streamURL);
    }
};

app.get('/', (req, res) => res.send('/getVideoStream/:videoSearch'));

app.get('/getAudioStream/:videoSearch', getAudioStream);

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);