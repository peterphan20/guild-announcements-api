module.exports = async function (fastify) {
  fastify.get('/users', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT * FROM USERS')
    console.log(rows)
    client.release()
    return rows
  })
}
