const requireAuthentication = require('../../plugins/requireAuthentication')
const { createComment, deleteComment, updateComment } = require('../../schemas/commentsSchema')

module.exports = async function authCommentRoutes(fastify) {
  fastify.register(requireAuthentication)
  fastify.decorate('verifyOwnership', (request, reply, done) => {
    const { jwt } = fastify

    if (!request.raw.headers.auth) {
      return done(new Error('Missing token header'))
    }

    jwt.verify(request.raw.headers.auth, async (err, decoded) => {
      try {
        const { username } = decoded
        const { commentID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          `
          SELECT
            u.id,
            u.username, 
            c.author_id,
            c.comment_id,
            CASE 
              WHEN c.author_id = u.id THEN true
              ELSE false 
            END AS "userOwnComment"
          FROM comments c
          LEFT JOIN users u ON u.username = $1
          WHERE c.comment_id = $2;
          `,
          [username, commentID]
        )
        client.release()
        if (rows[0].userOwnComment) {
          return done()
        }
        return done(new Error('User does not own this comment'))
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
          `
          INSERT INTO comments (content, author_id, article_id) VALUES ($1, $2, $3) 
          RETURNING 
            comment_id AS "commentID",
            author_id AS "commentAuthorID",
            content AS "commentContent",
            created_at AS "createdAt",
            (SELECT username FROM users WHERE id=author_id) AS "commentAuthor";
          `,
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
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyOwnership], {
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
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyOwnership], {
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
