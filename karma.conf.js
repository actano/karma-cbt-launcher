const path = require('path')

module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    plugins: [path.join(__dirname, 'lib', 'index.js'), 'karma-*'],
    files: ['test.js'],
    logLevel: config.LOG_DEBUG,
    customLaunchers: {
      win7_ie11: {
        base: 'CrossBrowserTesting',
        browserName: 'win7_ie11',
        browser_api_name: 'IE11',
        os_api_name: 'Win7x64',
        screen_resolution: '1366x768',
        record_video: 'true',
        record_network: 'true',
      },
      win10_ie11: {
        base: 'CrossBrowserTesting',
        browserName: 'win10_ie11',
        browser_api_name: 'IE11',
        os_api_name: 'Win10',
        screen_resolution: '1366x768',
        record_video: 'true',
        record_network: 'true',
      },
      win10_edge15: {
        base: 'CrossBrowserTesting',
        browserName: 'win10_edge15',
        browser_api_name: 'Edge15',
        os_api_name: 'Win10',
        screen_resolution: '1366x768',
        record_video: 'true',
        record_network: 'true',
      },
    },
  })
}
