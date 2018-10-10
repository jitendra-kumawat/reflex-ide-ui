// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { makeSureNoAppIsSelected } = require('@nrwl/schematics/src/utils/cli-config-utils');
// Nx only supports running unit tests for all apps and libs.
makeSureNoAppIsSelected();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      codeCoverage: config.angularCli.codeCoverage
    },
    reporters: ['kjhtml'],
    coverageIstanbulReporter: {
      includeAllSources: true,
      dir: 'coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      },
      angularCli: {
        environment: 'dev'
      },
      reports: ['html', 'lcovonly', 'cobertura', 'text-summary'],
      'report-config': {
        html: { subdir: 'html' },
      },
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false,
    },
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
