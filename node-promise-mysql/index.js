const mysql = require('mysql')
const Connection = require('./lib/connection.js')
const Pool = require('./lib/pool.js')

exports.createConnection = config => new Connection(config)
exports.createPool = config => new Pool(config)
exports.Types = mysql.Types
exports.escape = mysql.escape
exports.escapeId = mysql.escapeId
exports.format = mysql.format
