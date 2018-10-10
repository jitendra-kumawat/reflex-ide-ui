var gvsseedProxy = require("./docker_proxy.js");
module.exports = {
  "port": 8888,
  "notify": false,
  "snippetOptions": {
    "ignorePaths": "/"
  },
  "ui": false,
  "open": false,
  "browser": ["google chrome", "chrome"],
  server: {
    middleware: {
        10: gvsseedProxy
    }
  }
}
