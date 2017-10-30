const { glob } = require('glob');
const fs = require('fs');

let app = require('./index');

const httpServer = app.listen(3000, (error) => {
    if (error) {
        console.error(error);
    } else {
        const address = httpServer.address();
        console.info(`==> 🌎 Listening on ${address.port}. Open up http://localhost:${address.port}/ in your browser.`);
    }
});

// Hot Module Replacement API
if (module.hot) {
    // Hot reload of `app` and related modules.
    let currentApp = app;
    module.hot.accept('./index', () => {
        httpServer.removeListener('request', currentApp);
        import('./index').then(m => {
            httpServer.on('request', m);
            currentApp = m;
            console.log('Server reloaded!');
            glob("./build/*.hot-update.*", (err, trash) => {
                trash.map((file) => fs.unlinkSync(file))
                console.log('[HMR] Trash cleaned.');
            });
        })
            .catch(err => console.error(err));
    });

    // Hot reload of entry module (self). It will be restart http-server.
    module.hot.accept();
    module.hot.dispose(() => {
        console.log('Disposing entry module...');
        httpServer.close();
    });
}