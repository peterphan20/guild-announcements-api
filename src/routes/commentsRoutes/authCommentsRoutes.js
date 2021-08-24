const bcrypt = require('bcrypt')
const { createComment, deleteComment, updateComment } = require('../../schemas/commentsSchema')

module.exports = async function authCommentRoutes(fastify) {
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
      method: 'POST',
      url: '/comments',
      schema: createComment,
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
      method: 'PUT',
      url: '/comments/:commentID',
      schema: updateComment,
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { commentID } = request.params
        const { content } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'UPDATE comments SET content=$1 WHERE comment_id=$2 RETURNING *;',
          [content, commentID]
        )
        client.release()
        return { code: 200, message: `Comment with id ${commentID} has been updated.`, rows }
      },
    })

    fastify.route({
      method: 'DELETE',
      url: '/comments/:commentID',
      schema: deleteComment,
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { commentID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'DELETE FROM comments WHERE comment_id=$1 RETURNING *;',
          [commentID]
        )
        client.release()
        return { code: 200, message: `Comment with id ${commentID} has been deleted.`, rows }
      },
    })
  })
}
