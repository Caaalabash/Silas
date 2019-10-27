const { promisify } = require('util')
const mysql = require('mysql')
const Connection = require('./connection.js')

class pool {
  constructor(config = {}) {
    this.config = config
    this.pool = mysql.createPool(config)

    ;['getConnection', 'query'].forEach(method => {
      this[`_${method}`] = promisify(this.pool[method].bind(this.pool))
    })
    return this
  }

  getConnection() {
    return this['_getConnection']().then(connection => new Connection(this.config, connection))
  }

  query() {
    return this['_query'].apply(this, arguments)
  }
}

module.exports = pool
