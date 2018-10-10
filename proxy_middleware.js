var proxyMiddleware = require('http-proxy-middleware');
function proxyMiddlewareOptions(url) {
  var options = {
    target: url, // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    pathRewrite: {
        '^/reflex-ide$': '/reflex-ide/',
        '^/reflex-ide/(.*)' : '/$1'           // remove base path
    }
  };

    return options;
}

function proxy(url) {
  return proxyMiddleware('/reflex-ide', proxyMiddlewareOptions(url));
}
module.exports = proxy;
