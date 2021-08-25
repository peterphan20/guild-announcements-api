const bcrypt = require('bcrypt')

module.exports = async function adminUsersRoutes(fastify) {
  fastify.decorate('verifyJWT', (request, reply, done) => {
    const { jwt } = fastify

    if (!request.raw.headers.auth) {
      return done(new Error('Missing token header'))
    }

    jwt.verify(request.raw.headers.auth, async (err, decoded) => {
      try {
        const { username, password } = decoded
        // TODO refactor into helper function
        const client = await fastify.pg.connect()
        const { rows } = await client.query('SELECT password, id FROM users WHERE username=$1', [
          username,
        ])
        const passwordMatch = await bcrypt.compare(password, rows[0].password)
        if (passwordMatch) {
          console.log('User has been validated and password matched')
          return done()
        }
      } catch (error) {
        console.error(error)
        return done(new Error(error))
      }
    })
  })
  fastify.register(require('fastify-auth'))
  fastify.after(() => {
    fastify.route({
      method: 'DELETE',
      url: '/users/:userID',
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { userID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query('DELETE FROM users WHERE id=$1 RETURNING *;', [userID])
        client.release()
        return { code: 200, message: `User with id ${userID} has been deleted.`, rows }
      },
    })
  })
}
