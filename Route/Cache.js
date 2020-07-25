const memcache = require('memory-cache');
//configure the cache middleware
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = req.originalUrl || req.url;
        let cachContent = memcache.get(key);
        if (cachContent) {
            res.send(cachContent);
            return
        }
        else {
            res.sendRespond = res.json;
            //redeclaration of res.send closure
            res.json = (body) => {
                memcache.put(key, body, duration * 1000);
                res.sendRespond(body);
            }
            next();
        }
    }

}

module.exports = cacheMiddleware;







