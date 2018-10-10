var path = require('path');
var files = "./dist/apps/app/"

module.exports = {
  "port": 2018,
  "notify": false,
  "snippetOptions": {
    "ignorePaths": "/"
  },
  "ui": false,
  "open": false,
  "browser": ["google chrome", "chrome"],
  "files": [path.resolve(files, "**/*.{html,htm,css,js}")],
  "server": { "baseDir": files }
}
