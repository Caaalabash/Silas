## ？

阅读[promise-fun](https://github.com/sindresorhus/promise-fun)源码后的尝试

### retry

````javascript
const retry = require('./promise-retry')

function fetch() {
  return new Promise((resolve, reject) => {
    if (Math.random() < 0.1) resolve('SUCCESS')
    else reject(new Error('BAD LUCK'))
  })
}

function retryStrategy(failTimes) {
  console.log(`fail times: ${failTimes}`)
  return failTimes * 100
}

retry(fetch, 100, retryStrategy).then(console.log)
````