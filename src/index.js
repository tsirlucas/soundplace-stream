const express = require('express');
const httpProxy = require('http-proxy');
const { getStreamURLPromise } = require('./stream');
const { preCache } = require('./cache');
const searchVideoReq = require('./youtube-api');
const ytdl = require('ytdl-core');
const app = express();

var proxy = httpProxy.createProxyServer({
});

proxy.on('proxyRes', (proxyRes, req, res) => { 
	console.log('status: ' + proxyRes.statusCode); 
});

const searchVideo = async ({ params }, res) => {
	const videoId = await searchVideoReq(params.videoSearch);

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ videoId }));

	preCache(videoId);
};

const getAudioStream = async (req, res) => {
	const { params } = req;
	ytdl.getInfo(`http://www.youtube.com/watch?v=${params.videoId}`, {}, (err, inf) => {
		res.redirect(inf.formats[inf.formats.length - 1].url);	
	});
};

const searchAudioStream = async ({ params, headers }, res) => {
	const videoId = await searchVideoReq(params.videoSearch);

	await getAudioStream({ params: { videoId }, headers }, res);
};

app.get('/', (req, res) => res.send('See https://github.com/tsirlucas/youtube-cacheable-audio-stream'));

app.get('/searchAudioStream/:videoSearch', searchAudioStream);

app.get('/searchVideo/:videoSearch', searchVideo);

app.get('/getAudioStream/:videoId', getAudioStream);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, save, data");
	next();
  });

module.exports = app;