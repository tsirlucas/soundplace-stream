const fs = require('fs');
const { exec } = require('child_process');

const request = require('request-stream');

const { checkCache, createStreamFromCache, cacheStream } = require('./cache');
const { getQueryStringParams } = require('./util');

const getStreamURLPromise = (url) => {
    return new Promise((resolve, reject) => {
        exec(`youtube-dl ${url} -f bestaudio -g`, (err, stdout, stderr) =>
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

const requestStream = async (videoID, streamURL) => {
    streamURL = streamURL || await getStreamURLPromise(videoID);
    const { clen } = getQueryStringParams(streamURL);

    const readStream = await requestStreamPromise(streamURL);

    return { readStream, size: clen };
};

const createReadStream = async (videoID, streamURL) => {
    const cacheURL = `./cache/${videoID}.webm`;

    if (checkCache(cacheURL)) {
        return createStreamFromCache(cacheURL);
    }

    const readStream = await requestStream(videoID, streamURL);

    cacheStream(cacheURL, readStream);

    return readStream;
};

module.exports = { createReadStream, getStreamURLPromise };