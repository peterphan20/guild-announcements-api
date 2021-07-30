const fastify = require('fastify')
const { deleteUser, updateUser } = require('../schemas/schemas')

const privateRoutes = async () => {
  fastify.requireAuthentication(fastify)

  fastify.get('/users/:id', async request => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT id, username FROM users WHERE id=$1', [
      request.params.id,
    ])
    client.release()
    return { code: 200, rows }
  })

  fastify.delete('/users/:id', { schema: deleteUser }, async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('DELETE FROM users WHERE id=$1 RETURNING *;', [id])
    client.release()
    return { code: 200, message: `User with id ${id} has been deleted.`, rows }
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
    return { code: 200, message: `User with id ${id} has been updated.`, rows }
  })
}

fastify.register(privateRoutes)

module.exports = privateRoutes
