const createHandler = require('github-webhook-handler');

const http = require('http');
const { exec } = require('child_process');

const handler = createHandler({ path: '/webhook', secret: 'ycas' });

const server = http.createServer((req, res) =>
    handler(req, res, () => {
        res.statusCode = 404;
        res.end('no such location')
    }));

handler.on('error', (err) => console.error('Error:', err.message));

const updatePackageJSON = () =>
    new Promise((resolve, reject) =>
        exec('git fetch && git checkout origin/master -- ./package.json', (err, stdout, stderr) =>
            err ? reject(err) : resolve(stdout)));

const updateDependencies = () =>
    new Promise((resolve, reject) =>
        exec('yarn', (err, stdout, stderr) => err ? reject(err) : resolve(stdout)));

const updateProject = () =>
    new Promise((resolve, reject) =>
        exec('git pull', (err, stdout, stderr) => err ? reject(err) : resolve(stdout)));

handler.on('push', async () => {
    console.log('Push detected, starting hot-deploy');
    console.log(await updatePackageJSON());
    console.log(await updateDependencies());
    console.log(await updateProject());
});

server.listen(7777);