const express = require('express');
const request = require('request-stream');

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

const getAudioStream = async ({ params }, res) => {
    const streamURL = await getStreamURLPromise(params.videoID);
    const readStream = await requestStreamPromise(streamURL);

    readStream.on('error', () => {
        res.status(404).end();
    });
    readStream.on('end', () => {
        res.end();
    });

    readStream.pipe(res, { end: false });
};

app.get('/', (req, res) => res.send('/getVideoStream/:videoID'));

app.get('/getAudioStream/:videoID', getAudioStream);

app.listen(3000, () => console.log('Server listening on port 3000!'));