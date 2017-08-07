import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs'
import { fork } from 'child_process'
import promisify from 'es6-promisify'

const cmd = require.resolve('cbt_tunnels/cmd_start')
const mkdtemp = promisify(fs.mkdtemp)

const ILLEGAL = /[^a-zA-Z0-9-_]/g
export const username = process.env.CBT_USERNAME
export const authkey = process.env.CBT_AUTHKEY
export const tunnelname = (process.env.CBT_TUNNEL_NAME || `karma-${new Date().toISOString()}-${Math.random().toString(36).slice(2)}`).replace(ILLEGAL, '-')

// resolves falsy if stopped, resolves to a stopFunction if started

let state = Promise.resolve()
let log = null

export const setLogger = (logger) => {
  log = logger.create('cbt-tunnel')
}

async function forkProcess() {
  const cwd = await mkdtemp(join(tmpdir(), 'cbt-'))

  const ready = join(cwd, 'ready')
  const killFile = join(cwd, 'kill')

  const killFunction = () => {
    fs.writeFileSync(killFile, '')
  }

  process.on('exit', killFunction)
  const child = fork(cmd, ['--username', username, '--authkey', authkey, '--tunnelname', tunnelname, '--ready', 'ready', '--kill', 'kill', '--quiet'], {
    cwd,
    detached: true,
    stdio: 'ignore',
  })
  child.disconnect()
  child.unref()

  let processAlive = true

  const stopFunction = () => {
    child.kill('SIGINT')
  }

  const processPromise = new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      processAlive = false
      process.removeListener('exit', killFunction)
      state = processPromise
      if (code === 0) {
        log.info('Tunnel stopped')
        resolve()
      } else {
        reject(new Error(`Child exited unexpectedly with code ${child.exitCode}`))
      }
    })
  })
  processPromise.catch(() => {}) // handle rejections from process promise

  return new Promise((resolve, reject) => {
    let counter = 0
    const check = () => {
      if (!processAlive) {
        resolve(processPromise)
        return
      }

      counter += 1
      if (counter > 120) {
        child.kill('SIGTERM')
        reject(new Error(`Timeout waiting for ${ready}`))
      }

      fs.access(ready, (err) => {
        if (!processAlive) {
          resolve(processPromise)
          return
        }

        if (!err) {
          log.debug('Tunnel started')
          resolve(stopFunction)
          return
        }

        log.debug('Waiting for %s (%s)', ready, counter)
        setTimeout(check, 1000)
      })
    }
    check()
  })
}

export async function startTunnel() {
  const current = await state
  if (current) {
    return
  }
  log.info('Starting tunnel')
  state = forkProcess()
  await state
}

export async function stopTunnel() {
  const current = await state
  if (current) {
    current()
  }
}
