const noop = () => {}

/**
 * Measure the time a promise takes to resolve
 * @param {Function} func - Promise-returning or async function.
 */
async function measure(func) {
  const start = Date.now()
  await func().catch(noop)
  return Date.now() - start
}

module.exports = measure