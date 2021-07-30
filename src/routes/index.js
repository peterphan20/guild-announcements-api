module.exports = async function (fastify) {
  fastify.get('/users', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT * FROM USERS')
    client.release()
    return { code: 200, rows }
  })
}
