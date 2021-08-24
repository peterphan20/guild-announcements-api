const bcrypt = require('bcrypt')
const { createArticle, deleteArticle, updateArticles } = require('../../schemas/articlesSchemas')

module.exports = async function authArticlesRoutes(fastify) {
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
      url: '/articles',
      schema: createArticle,
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
      schema: updateArticles,
      preHandler: fastify.auth([fastify.verifyJWT], {
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
      schema: deleteArticle,
      preHandler: fastify.auth([fastify.verifyJWT], {
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
