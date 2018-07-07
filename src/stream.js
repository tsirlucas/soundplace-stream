const fs = require('fs');
const { exec } = require('child_process');

const request = require('request-stream');

const { getStreamURLFromCache, cacheStreamURL } = require('./cache');
const { getQueryStringParams } = require('./util');

const requestStreamURL = (videoId) =>
    new Promise((resolve, reject) => {
        exec(`youtube-dl https://www.youtube.com/watch?v=${videoId} -f bestaudio -g --force-ipv4 -x --audio-format vorbis`, (err, stdout, stderr) => {
            if (err) return reject(err);

            const resURL = stdout.replace(/\n$/, '');
            cacheStreamURL(videoId, resURL);
            resolve(resURL)
        });
    });

const getStreamURLPromise = async (videoId) => {
    const streamURL = await getStreamURLFromCache(videoId);

    return new Promise((resolve, reject) => {
        if (streamURL) return resolve(streamURL);
        requestStreamURL(videoId).then(resolve).catch(reject)
    });
};

const requestStreamPromise = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, {}, (err, readStream) => {
            err ? reject(err) : resolve(readStream);
        })
    })
};

const createReadStream = async (videoId) => {
    const streamURL = await getStreamURLPromise(videoId);
    const { clen } = getQueryStringParams(streamURL);

    const readStream = await requestStreamPromise(streamURL);

    return { readStream, size: clen };
};

module.exports = { createReadStream, getStreamURLPromise, requestStreamURL };