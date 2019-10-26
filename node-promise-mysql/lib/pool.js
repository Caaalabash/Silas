const { promisify } = require('util')
const mysql = require('mysql')
const Connection = require('./connection.js')

class pool {
  constructor(config = {}) {
    this.config = config

    return (async () => {
      this.pool = mysql.createPool(config)

      ;['getConnection'].forEach(method => {
        this[`_${method}`] = promisify(this.pool.getConnection.bind(this.pool))
      })

      return this
    })()
  }

  getConnection() {
    return this['_getConnection']().then(connection => new Connection(this.config, connection))
  }
}

module.exports = pool
