const { requestStreamURL } = require('./stream');
const Cache = require('./cache.singleton');

Cache.on('expire', requestStreamURL);

const getStreamURLFromCache = (key) =>
    new Promise((resolve, reject) =>
        Cache.get(key, (err, value) => {
            if (err || value === undefined) {
                resolve(null);
            } else {
                resolve(value);
            }
        }));

const cacheStreamURL = (videoId, streamURL) => {
    Cache.set(videoId, streamURL, 14400);
};

// requestStreamURL redirects to cacheStreamURL
const preCache = requestStreamURL;

module.exports = { cacheStreamURL, getStreamURLFromCache, preCache };