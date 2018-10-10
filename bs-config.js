var gvsseedProxy = require("./prod_proxy.js");
module.exports = {
  "port": 8843,
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
