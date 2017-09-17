import { username, authkey, tunnelname, startTunnel, stopTunnel, setLogger as setTunnelLogger } from './tunnel'
import consoleLogger from './console-logger'

const activeSessions = []

const remoteHub = 'http://hub.crossbrowsertesting.com:80/wd/hub'

let log = consoleLogger('cbt-session')

export const setLogger = (logger) => {
  log = logger.create('cbt-session')
  setTunnelLogger(logger)
}

export default async (id) => {
  log.debug('Starting session %s', id)
  if (activeSessions.includes(id)) throw new Error(`Session ${id} already active`)
  activeSessions.push(id)
  if (activeSessions.length === 1) {
    log.info('First session, starting tunnel')
  }
  await startTunnel()
  return {
    async stop() {
      const index = activeSessions.indexOf(id)
      if (index < 0) throw new Error(`Session ${id} not active`)
      log.debug('Closing session %s', id)
      activeSessions.splice(index, 1)
      if (activeSessions.length === 0) {
        log.info('Last session, stopping tunnel')
        await stopTunnel()
      }
    },
    configureBuilder(builder) {
      log.debug('Configuring selenium builder for %s', JSON.stringify(builder.getCapabilities()))
      const caps = builder.usingServer(remoteHub).getCapabilities()
      caps.set('username', username)
      caps.set('password', authkey)
      caps.set('tunnel_name', tunnelname)
      return builder
    },
  }
}
