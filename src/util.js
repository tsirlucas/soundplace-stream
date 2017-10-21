const queryString = require('query-string');

const createFullHead = (size) => ({
    'Content-Length': size,
    'Content-Type': 'audio/webm',
});

const getQueryStringParams = (streamURL) => {
    const paramsString = streamURL.split('.com/')[1];
    return queryString.parse(paramsString);
};

module.exports = { createFullHead, getQueryStringParams };