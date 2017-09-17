/* eslint-disable no-console */

export default name => ({
  debug(msg, ...args) {
    console.log(`[${name}] DEBUG: ${msg}`, ...args)
  },
  info(msg, ...args) {
    console.log(`[${name}] INFO: ${msg}`, ...args)
  },
  error(msg, ...args) {
    console.error(`[${name}] ERROR: ${msg}`, ...args)
  },
})
