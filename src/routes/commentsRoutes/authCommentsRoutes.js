const bcrypt = require('bcrypt')

module.exports = async function authCommentRoutes(fastify) {
  // eslint-disable-next-line
  fastify.decorate('verifyJWT', (request, reply, done) => {
    const { jwt } = this

    if (!request.raw.headers.auth) {
      return done(new Error('Missing token header'))
    }
    // eslint-disable-next-line
    jwt.verify(request.raw.headers.auth, async (err, decoded) => {
      try {
        const { username, password } = decoded
        // refactor into helper function
        const client = await fastify.pg.connect()
        const { rows } = await client.query('SELECT password, id FROM users WHERE username=$1', [
          username,
        ])
        const passwordMatch = await bcrypt.compare(password, rows[0].password)
        //
        if (passwordMatch) {
          console.log('User has been validated and password matched')
          done()
        }
      } catch (error) {
        console.error(error)
      }
    })
  })

  fastify.register('fastify-auth')
  fastify.after(() => {
    fastify.route({
      method: 'POST',
      url: '/comments',
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { content, authorID, articleID } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'INSERT INTO comments (content, author_id, article_id) VALUES ($1, $2, $3) RETURNING *;',
          [content, authorID, articleID]
        )
        client.release()
        return { code: 201, message: 'Comment has been created.', rows }
      },
    })

    fastify.route({
      method: 'DELETE',
      url: '/comments/:id',
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { id } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'DELETE FROM comments WHERE comment_id=$1 RETURNING *;',
          [id]
        )
        client.release()
        return { code: 200, message: `Comment with id ${id} has been deleted.`, rows }
      },
    })

    fastify.route({
      method: 'PUT',
      url: '/comments/:id',
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { id } = request.params
        const { content } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'UPDATE comments SET content=$1 WHERE comment_id=$2 RETURNING *;',
          [content, id]
        )
        client.release()
        return { code: 200, message: `Comment with id ${id} has been updated.`, rows }
      },
    })
  })
}
