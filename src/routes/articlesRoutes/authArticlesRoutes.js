const requireAuthentication = require('../../plugins/requireAuthentication')

module.exports = async function authArticlesRoutes(fastify) {
  fastify.register(requireAuthentication)
  fastify.decorate('verifyOwnership', (request, reply, done) => {
    const { jwt } = fastify

    if (!request.raw.headers.auth) {
      return done(new Error('Missing token header'))
    }

    jwt.verify(request.raw.headers.auth, async (err, decoded) => {
      try {
        const { username } = decoded
        const { articleID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          `
          SELECT
            u.id,
            u.username, 
            a.author_id,
            a.article_id,
            CASE 
              WHEN a.author_id = u.id THEN true
              ELSE false 
            END AS "userOwnArticle"
          FROM articles a
          LEFT JOIN users u ON u.username = $1
          WHERE a.article_id = $2;
          `,
          [username, articleID]
        )
        client.release()
        if (rows[0].userOwnArticle) {
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
      url: '/articles',
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { title, content, imageURL, videoURL, authorID } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'INSERT INTO articles (title, content, img_url, video_url, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
          [title, content, imageURL, videoURL, authorID]
        )
        client.release()
        return { code: 201, message: `Successfully created articles ${title}.`, rows }
      },
    })

    fastify.route({
      method: 'PUT',
      url: '/articles/:articleID',
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyOwnership], {
        relation: 'and',
      }),
      handler: async request => {
        const { title, content, imageURL, videoURL } = request.body
        const { articleID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'UPDATE articles SET title=$1, content=$2, img_url=$3, video_url=$4 WHERE article_id=$5 RETURNING *;',
          [title, content, imageURL, videoURL, articleID]
        )
        client.release()
        return { code: 200, message: `Sucessfully updated articles with id ${articleID}.`, rows }
      },
    })

    fastify.route({
      method: 'DELETE',
      url: '/articles/:articleID',
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyOwnership], {
        relation: 'and',
      }),
      handler: async request => {
        const { articleID } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'DELETE FROM articles WHERE article_id=$1 RETURNING *;',
          [articleID]
        )
        client.release()
        return { code: 200, message: `Successfully deleted articles with id ${articleID}.`, rows }
      },
    })
  })
}
