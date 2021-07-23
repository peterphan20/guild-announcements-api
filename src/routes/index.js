const { createUser, deleteUser, updateUser } = require('../schemas/schemas')

const userRoutes = async fastify => {
  fastify.get('/users', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT * FROM USERS')
    client.release()
    return rows
  })

  fastify.get('/users/:id', async request => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT id, username FROM users WHERE id=$1', [
      request.params.id,
    ])
    client.release()
    return rows
  })

  fastify.post('/users', { schema: createUser }, async request => {
    const { username, password } = request.body
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;',
      [username, password]
    )
    client.release()
    return rows
  })

  fastify.delete('/users/:id', { schema: deleteUser }, async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('DELETE FROM users WHERE id=$1 RETURNING *;', [id])
    client.release()
    return rows
  })

  fastify.put('/users/:id', { schema: updateUser }, async request => {
    const { password } = request.body
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('UPDATE users SET password=$1 WHERE id=$2 RETURNING *;', [
      password,
      id,
    ])
    client.release()
    return rows
  })
}

module.exports = userRoutes
