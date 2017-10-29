const fs = require('fs');
const { exec } = require('child_process');

const request = require('request-stream');

const { checkCache, createStreamFromCache, cacheStream } = require('./cache');
const { getQueryStringParams } = require('./util');

const getStreamURLPromise = (videoId) => {
    return new Promise((resolve, reject) => {
        exec(`youtube-dl https://www.youtube.com/watch?v=${videoId} -f bestaudio -g`, (err, stdout, stderr) =>
            err ? reject(err) : resolve(stdout.replace(/\n$/, '')));
    });
};

const requestStreamPromise = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, {}, (err, readStream) => {
            err ? reject(err) : resolve(readStream);
        })
    })
};

const requestStream = async (videoId, streamURL) => {
    streamURL = streamURL || await getStreamURLPromise(videoId);
    const { clen } = getQueryStringParams(streamURL);

    const readStream = await requestStreamPromise(streamURL);

    return { readStream, size: clen };
};

const createReadStream = async (videoId, streamURL) => {
    const cacheURL = `./cache/${videoId}.webm`;

    if (checkCache(cacheURL)) {
        return createStreamFromCache(cacheURL);
    }

    const readStream = await requestStream(videoId, streamURL);

    cacheStream(cacheURL, readStream);

    return readStream;
};

module.exports = { createReadStream, getStreamURLPromise };