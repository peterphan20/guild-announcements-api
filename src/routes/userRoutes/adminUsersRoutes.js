const requireAuthentication = require('../../plugins/requireAuthentication')

module.exports = async function adminUsersRoutes(fastify) {
  fastify.register(requireAuthentication)
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
