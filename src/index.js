const express = require('express');

const { checkCacheDir } = require('./cache');
const { createReadStream, getStreamURLPromise } = require('./stream');
const { createFullHead } = require('./util');

const app = express();

checkCacheDir();

const getAudioStream = async ({ params, headers }, res) => {

    if (headers.save) {
        const { readStream, size } = await createReadStream(params.videoID);
        const head = createFullHead(size);

        res.writeHead(200, head);
        readStream.pipe(res)
    } else {
        const streamURL = await getStreamURLPromise(params.videoID);

        res.redirect(streamURL);
        await createReadStream(params.videoID, streamURL);
    }
};

app.get('/', (req, res) => res.send('/getVideoStream/:videoID'));

app.get('/getAudioStream/:videoID', getAudioStream);

app.listen(process.env.PORT || 3000, () => console.log('Server listening on port 3000!'));