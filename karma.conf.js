require("babel-core/register")
require("babel-polyfill")

module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    plugins: [(__dirname + '/lib/index.js'), 'karma-*'],
    files: ['test.js'],
    logLevel: config.LOG_DEBUG,
    customLaunchers: {
      ie: {
        base: 'CrossBrowserTesting',
        browserName: 'internet explorer',
        browser_api_name: 'IE11',
        os_api_name: 'Win7x64-Base',
        screen_resolution: '1366x768',
        record_video: 'true',
        record_network: 'true',
      },
    },
  })
}
