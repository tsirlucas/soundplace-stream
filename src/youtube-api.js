const google = require('googleapis');

const apiKey = 'AIzaSyA_qBWIjU7NZ1jmDRfi2OyfcOUH0ntjlJ8';
const service = google.youtube('v3');

const searchCB = (err, response, resolve, reject) => {
    if (err) reject(err);

    const { items } = response;
    if (items.length === 0) {
        reject('No video found.');
    } else {
        const video = items[0].id;
        resolve(video.videoId);
    }
};

const searchRequest = (query) =>
    new Promise((resolve, reject) => {
        service.search.list({
            auth: apiKey,
            part: 'id',
            q: query,
            maxResults: 1
        }, (err, response) => searchCB(err, response, resolve, reject))
    });

module.exports = searchRequest;

