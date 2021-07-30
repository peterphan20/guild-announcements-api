module.exports = async function routes(fastify) {
  fastify.get('/users', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT username, password FROM USERS')
    client.release()
    return { code: 200, rows }
  })
}
