var proxyMiddleware = require("./proxy_middleware");
var proxy = proxyMiddleware('http://localhost:2018/');
module.exports = proxy
