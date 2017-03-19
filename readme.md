# Karma-Launcher for CrossBrowserTesting

## Configuration

### Credentials

You have to set Environment Variables:

    CBT_USERNAME=<Your username>
    CBT_AUTHKEY=<Your authkey>

Jenkins Plugin for CrossBrowserTesting does this automatically

### Browser Selection

Use `base: CrossBrowserTesting`, then any configuration you like, e.g.:

    browserName: 'internet explorer'
    browser_api_name: 'IE11'
    os_api_name: 'Win7x64-Base'
    screen_resolution: '1366x768'
    record_video: 'true'
    record_network: 'true'

To give your tests beautiful names in CBT UI:

    name: <Wonderful DisplayName>
    build: <version>

## What it does

* Creates a unnamed tunnel to CBT
* Starts browser on CBT and connects them to karma through tunnel
