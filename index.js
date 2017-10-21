const express = require('express');
const request = require('request-stream');
const queryString = require('query-string');

const { exec } = require('child_process');

const app = express();

const getStreamURLPromise = (url) => {
    return new Promise((resolve, reject) => {
        exec(`youtube-dl ${url} -f bestaudio -g`, (err, stdout, stderr) =>
            err ? reject(err) : resolve(stdout));
    });
};

const requestStreamPromise = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, {}, (err, readStream) => {
            err ? reject(err) : resolve(readStream);
        })
    })
};

const createPartialHead = (range, fileSize, { mime }) => {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;
    const chunksize = (end - start) + 1;

    return {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mime,
        'client-protocol': 'quic',
        'x-content-type-options': 'nosniff'
    };
};

const createFullHead = (fileSize, { mime }) => ({
    'Content-Length': fileSize,
    'Content-Type': mime,
});

const getQueryStringParams = (streamURL) => {
    const paramsString = streamURL.split('.com/')[1];
    return queryString.parse(paramsString);
};

const getAudioStream = async ({ params, headers }, res) => {
    const streamURL = await getStreamURLPromise(params.videoID);

    const qsParams = getQueryStringParams(streamURL);

    const fileSize = qsParams.clen;
    const range = headers.range;

    const readStream = await requestStreamPromise(streamURL);

    if (range) {
        const head = createPartialHead(range, fileSize, qsParams);

        res.writeHead(206, head);
        readStream.pipe(res);
    } else {
        const head = createFullHead(fileSize, qsParams);

        res.writeHead(200, head);
        readStream.pipe(res)
    }
};

app.get('/', (req, res) => res.send('/getVideoStream/:videoID'));

app.get('/getAudioStream/:videoID', getAudioStream);

app.listen(3000, () => console.log('Server listening on port 3000!'));