
// This file is required by karma.conf.js and loads recursively all the .spec and framework files
require('zone.js/dist/zone-testing');
const getTestBed  = require('@angular/core/testing').getTestBed;
const BrowserDynamicTestingModule  = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
const platformBrowserDynamicTesting  = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

let contextApps;
let contextLibs;
// Then we find all the tests.
if (__karma__.config.codeCoverage) {
  //all files execpt main.ts
  //contextApps = require.context('./apps/app/src', true, /^((?!main\.ts).)*\.ts$/);
  contextApps = require.context('./apps/app/src/app', true, /\.ts$/);
  contextLibs = require.context('./libs', true, /\.ts$/);
} else {
  contextApps = require.context('./apps', true, /\.spec\.ts$/);
  contextLibs = require.context('./libs', true, /\.spec\.ts$/);
}

 contextApps.keys().map(contextApps);
 contextLibs.keys().map(contextLibs);

// Finally, start Karma to run the tests.
__karma__.start();
