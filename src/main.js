let app = require('./index');

const httpServer = app.listen(process.env.PORT || 3001, (error) => {
    if (error) {
        console.error(error);
    } else {
        const address = httpServer.address();
        console.info(`==> 🌎 Listening on ${address.port}. Open up http://localhost:${address.port}/ in your browser.`);
    }
});