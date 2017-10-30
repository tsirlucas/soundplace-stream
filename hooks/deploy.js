const http = require('http');
const createHandler = require('github-webhook-handler');
const { exec } = require('child_process');

const handler = createHandler({ path: '/webhook', secret: 'ycas' });

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location')
    })
}).listen(7777);

handler.on('error', function (err) {
    console.error('Error:', err.message)
});

handler.on('push', function (event) {
    exec('git fetch && git checkout origin/master -- ./package.json', (err, stdout, stderr) => {
        exec('yarn', (err, stdout, stderr) => {
            exec('git pull', (err, stdout, stderr) => {
                console.log('cb rullz im sleepy');
            });
        });
    });
});
