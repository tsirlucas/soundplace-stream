// Reason to be a singleton:
// When the hot-update occurs, it wont reload and the cache wont not be lost
// -----------------------------------

const NodeCache = require('node-cache');

// create a unique, global symbol name
// -----------------------------------

const CACHE_KEY = Symbol.for('app.cache');
const HAS_EXPIRE_WATCHER = Symbol.for('cache.expire.watcher');

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasCache = (globalSymbols.indexOf(CACHE_KEY) > -1);

if (!hasCache) {
    global[CACHE_KEY] = new NodeCache();
}

// define the singleton API
// ------------------------

const singleton = {};

Object.defineProperty(singleton, "instance", {
    get: function () {
        return {
            get: global[CACHE_KEY].get,
            set: global[CACHE_KEY].set,
            on: function (event, cb) {
                const gSymbols = Object.getOwnPropertySymbols(global);
                const hasWatcher = (gSymbols.indexOf(HAS_EXPIRE_WATCHER) > -1);
                if (!hasWatcher) {
                    global[HAS_EXPIRE_WATCHER] = global[CACHE_KEY].on(event, (key) => cb(key));
                }
            }
        };
    },
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton.instance;