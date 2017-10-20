const express = require('express');
const exec = require('child_process').exec;
const fs = require('fs');
const request = require('request-stream');

const app = express();

const getStreamURL = (url, callback) => {
    exec(`youtube-dl ${url} -f bestaudio -g`, (error, stdout, stderr) => {
        callback(stdout);
    });
};

app.get('/', (req, res) => res.send('/getVideoStream/:videoID'));

app.get('/getAudioStream/:videoID', ({ params }, res) => {
    getStreamURL(params.videoID, (streamUrl) => {
        request.get(streamUrl, {}, (err, readStream) => {
            readStream.on('error', () => {
                res.status(404).end();
            });
            readStream.on('end', () => {
                res.end();
            });

            readStream.pipe(res, { end: false });
        });
    });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));