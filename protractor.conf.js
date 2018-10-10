// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const { getAppDirectoryUsingCliConfig } = require('@nrwl/schematics/src/utils/cli-config-utils');
const appDir = getAppDirectoryUsingCliConfig();

const HtmlScreenshotReporterOption = {
  captureOnlyFailedSpecs: false,
  dest: 'e2e-results/screenshots',
  filename: 'index.html'
}
const htmlScreenshotReporter = new HtmlScreenshotReporter(HtmlScreenshotReporterOption);

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    appDir + '/e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:1986/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  beforeLaunch: function () {
    return new Promise(function (resolve) {
      htmlScreenshotReporter.beforeLaunch(resolve);
    });
  },
  onPrepare() {
    require('ts-node').register({
      project: appDir + '/e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(htmlScreenshotReporter)
  },
  // Close the report after all tests finish
  afterLaunch: function (exitCode) {
    return new Promise(function (resolve) {
      htmlScreenshotReporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};
