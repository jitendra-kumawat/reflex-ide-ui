var proxyMiddleware = require("./proxy_middleware");
var proxy = proxyMiddleware('http://localhost:4000/');
module.exports = proxy
