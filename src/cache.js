const fs = require('fs');

const checkCacheDir = () => {
    if (!fs.existsSync('./cache/')) {
        fs.mkdirSync('./cache/');
    }
};

const checkCache = (cacheURL) => fs.existsSync(cacheURL);

const createStreamFromCache = (cacheURL) => {
    const readStream = fs.createReadStream(cacheURL);
    const { size } = fs.statSync(cacheURL);

    return { readStream, size };
};

const cacheStream = (cacheURL, { readStream }) => {
    const writeStream = fs.createWriteStream(cacheURL);
    readStream.pipe(writeStream);
};

module.exports = { checkCacheDir, checkCache, createStreamFromCache, cacheStream };