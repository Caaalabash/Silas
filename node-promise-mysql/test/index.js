const mysql = require('../index')

const config = {
  host: '10.10.5.146',
  user: 'root',
  password: '123456',
  database: 'test',
  debug: true,
  reconnect: true
}

;(async () => {
  // createPool is sync
  // createConnection is async
  const pool = mysql.createPool(config)
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    // update user12's name
    await connection.query(`UPDATE tb_user SET name='calabash' WHERE id=1`)
    // delete user12
    await connection.query(`DELETE FROM tb_user WHERE id=1`)
    // update user12's money (Unknown column 'money' in 'field list')
    await connection.query(`UPDATE tb_user SET money='99999999999' WHERE id=1`)
    // Let's do it
    await connection.commit()
  } catch (e) {
    // calabash still alive！
    await connection.rollback()
  } finally {
    connection.release()
  }

  const singleConnection = await mysql.createConnection(config)
  await singleConnection.query(`SELECT * FROM tb_user`)
})()