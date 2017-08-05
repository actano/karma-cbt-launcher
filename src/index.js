// code mainly based on karma-webdriver-launcher

import { parse as urlparse, format as urlformat } from 'url'
import { Builder } from 'selenium-webdriver'
import cbt from 'cbt_tunnels'
import promisify from 'es6-promisify'

const cbtStart = promisify(cbt.start)
const remoteHub = 'http://hub.crossbrowsertesting.com:80/wd/hub'
const username = process.env.CBT_USERNAME
const authkey = process.env.CBT_AUTHKEY
const tunnelName = process.env.CBT_TUNNEL_NAME

// Handle x-ua-compatible option same as karma-ie-launcher(copy&paste):
//
// Usage :
//   customLaunchers: {
//     IE9: {
//       base: 'WebDriver',
//       config: webdriverConfig,
//       browserName: 'internet explorer',
//       'x-ua-compatible': 'IE=EmulateIE9'
//     }
//   }
//
// This is done by passing the option on the url, in response the Karma server will
// set the following meta in the page.
//   <meta http-equiv="X-UA-Compatible" content="[VALUE]"/>
function handleXUaCompatible(args, urlObj) {
  if (args['x-ua-compatible']) {
    const q = urlObj.query
    q['x-ua-compatible'] = args['x-ua-compatible']
  }
}

class CBTInstance {
  constructor(baseBrowserDecorator, args, logger) {
    this.log = logger.create('CrossBrowserTesting')

    baseBrowserDecorator(this)
    this._start = CBTInstance.prototype._start

    const spec = Object.assign({
      name: 'Karma test',
      build: '',
    }, args)

    if (!spec.browserName) {
      throw new Error('browserName is required!')
    }
    this.name = `${spec.browserName} via CrossBrowserTesting`
    delete spec.base
    delete spec.config

    for (const key of ['pseudoActivityInterval']) {
      this[key] = spec[key]
      delete spec[key]
    }
    this.log.info('WebDriver config: %s', JSON.stringify(spec))
    spec.username = username
    spec.password = authkey
    spec.tunnel_name = tunnelName || `karma-tunnel-${Math.random().toString(36).slice(2)}`
    this.spec = spec
  }

  async _start(url) {
    const urlObj = urlparse(url, true)
    handleXUaCompatible(this.spec, urlObj)

    // use special hostname for tunnel
    delete urlObj.host
    urlObj.hostname = 'local'

    delete urlObj.search // url.format does not want search attribute

    this.log.debug(`Browser capabilities: ${JSON.stringify(this.spec)}`)

    await cbtStart({ username, authkey, tunnelname: this.spec.tunnel_name })
    const driver = new Builder()
      .usingServer(remoteHub)
      .withCapabilities(this.spec)
      .build()

    const session = await driver.getSession()
    this.sessionId = session.id_ // need for API calls
    const interval = this.pseudoActivityInterval && setInterval(() => {
      this.log.debug('Imitate activity')
      driver.getTitle()
    }, this.pseudoActivityInterval)

    driver.get(urlformat(urlObj))
    let quitCalled = false
    const kill = async () => {
      if (!quitCalled) {
        quitCalled = true
        if (interval) {
          clearInterval(interval)
        }
        if (driver.getSession()) {
          await driver.quit()
          this.log.info(`Killed ${this.name}.`)
        }
        cbt.stop()
      }
    }
    this._process = { kill }
    // We can't really force browser to quit so just avoid warning about SIGKILL
    this._onKillTimeout = () => null
  }
}

process.on('beforeExit', () => {
  cbt.stop() // cbt.stop() makes async calls, so we have to use beforeExit()
})

const factory = (...args) => new CBTInstance(...args)

factory.$inject = ['baseBrowserDecorator', 'args', 'logger']

export default {
  'launcher:CrossBrowserTesting': ['factory', factory],
}
