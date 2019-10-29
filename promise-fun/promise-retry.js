/**
 * Retry the given function until it success or run out of retryLimit.
 * @param {Function} func - Promise-returning or async function.
 * @param {Number} retryLimit - Retry limit, negative number means keep trying!
 * @param {Function} retryStrategy - Retry strategy, receive retryTimes as parameter, should return milliseconds.
 * @param {Number} retryTimes - Retry Times.
 */
async function retry(func, retryLimit = 3, retryStrategy = () => 1000, retryTimes = 1) {
  try {
    return await func()
  } catch (e) {
    if (retryLimit) {
      await new Promise(r => setTimeout(r, retryStrategy(retryTimes)))
      return retry(func, retryLimit - 1, retryStrategy, ++retryTimes)
    } else {
      throw new Error(`Max retires reached for function ${func.name} with ${e}`)
    }
  }
}

module.exports = retry