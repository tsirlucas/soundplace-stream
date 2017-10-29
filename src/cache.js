const NodeCache = require('node-cache');
const { requestStreamURL } = require('./stream');

const myCache = new NodeCache();

myCache.on('expired', (key) => requestStreamURL(key));

const getStreamURLFromCache = (key) =>
    new Promise((resolve, reject) =>
        myCache.get(key, (err, value) => {
            if (err || value === undefined) {
                resolve(null);
            } else {
                resolve(value);
            }
        }));

const cacheStreamURL = (videoId, streamURL) => {
    myCache.set(videoId, streamURL, 43200);
};

module.exports = { cacheStreamURL, getStreamURLFromCache };