const { promisify } = require('util')
const mysql = require('mysql')

class connection {
  constructor(config = {}, _connection) {
    this.config = config

    return (async () => {
      this.connection = _connection || mysql.createConnection(config)
      !_connection && await promisify(this.connection.connect.bind(this.connection))()

      ;['query', 'beginTransaction', 'commit', 'rollback'].forEach(method => {
        this[`_${method}`] = promisify(this.connection[method].bind(this.connection))
      })

      return this
    })()
  }

  query() {
    return this['_query'].apply(this, arguments)
  }

  beginTransaction() {
    return this['_beginTransaction'].apply(this, arguments)
  }

  commit() {
    return this['_commit'].apply(this, arguments)
  }

  rollback() {
    return this['_rollback'].apply(this, arguments)
  }

  release() {
    this.connection.release()
  }
}


module.exports = connection
