const { promisify } = require('util')
const mysql = require('mysql')

class connection {
  constructor(config = {}, _connection) {
    if (config.reconnect === true) {
      this.reconnect = true
      config.reconnect = undefined
    }
    this.config = config

    return (async () => {
      if (_connection && this.reconnect) {
        addReconnectHandler(_connection, mysql, this.config)
        this.connection = _connection
      } else if (!_connection) {
        this.connection = await connect(mysql, this.config, this.reconnect)
      }

      ;['query', 'beginTransaction', 'commit', 'rollback', 'end'].forEach(method => {
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

  end() {
    return this['_end'].apply(this, arguments)
  }

  destroy() {
    this.connection.destroy()
  }

  pause() {
    this.connection.pause()
  }

  resume() {
    this.connection.resume()
  }

  on(event, fn) {
    this.connection.on(event, fn)
  }
}

const connect = (mysql, config, reconnect) => {
  const connection = mysql.createConnection(config)

  return new Promise((resolve, reject) => {
    connection.connect(e => {
      if (e) {
        return reject(e)
      } else {
        if (reconnect) {
          addReconnectHandler(connection, mysql, config)
        }
        return resolve(connection)
      }
    })
  })
}

const addReconnectHandler = (connection, mysql, config) => {
  connection.once('error', err => {
    if (
      err.code === 'PROTOCOL_CONNECTION_LOST' ||
      err.code === 'ECONNRESET' ||
      err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
    ) {
      connect(mysql, config)
    }
  })
}


module.exports = connection
