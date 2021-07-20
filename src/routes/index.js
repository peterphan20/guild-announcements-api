const { createUser } = require('../schemas/schemas')

const userRoutes = async fastify => {
  fastify.get('/users', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT * FROM USERS')
    client.release()
    return rows
  })

  fastify.post('/', { schema: createUser }, async request => {
    const newUser = request.body
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      `INSERT INTO users (username, password) VALUES (${newUser.username}, ${newUser.password})`
    )
    client.release()
    return rows
  })
}

module.exports = userRoutes
