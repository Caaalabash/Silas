## ？

阅读[node-promise-mysql](https://github.com/CodeFoodPixels/node-promise-mysql)源码后的重写

## Example

````javascript
const mysql = require('./index')

;(async () => {
  const pool = await mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'test',
    debug: true
  })
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    // update user12's name
    await connection.query(`UPDATE tb_user SET name='calabash' WHERE id=12`)
    // delete user12
    await connection.query(`DELETE FROM tb_user WHERE id=12`)
    // update user12's money (Unknown column 'money' in 'field list')
    await connection.query(`UPDATE tb_user SET money='99999999999' WHERE id=12`)
    // Let's do it
    await connection.commit()
  } catch (e) {
    // calabash still alive！
    await connection.rollback()
  } finally {
    connection.release()
  }
})()
````