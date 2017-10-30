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
    console.log('Push detected, starting hot-deploy');
    exec('git fetch && git checkout origin/master -- ./package.json', (err, stdout, stderr) => {
        console.log(stdout);
        exec('yarn', (err, stdout, stderr) => {
            console.log(stdout);
            exec('git pull', (err, stdout, stderr) => {
                console.log(stdout);
            });
        });
    });
});
