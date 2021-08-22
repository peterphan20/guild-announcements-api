const bcrypt = require('bcrypt')
const { createArticle, deleteArticle, updateArticles } = require('../../schemas/articlesSchemas')

module.exports = async function authArticlesRoutes(fastify) {
  // eslint-disabled-next-line
  fastify.decorate('verifyJWT', (request, reply, done) => {
    const { jwt } = this

    if (!request.raw.headers.auth) {
      return done(new Error('Missing token header'))
    }

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
          return done()
        }
      } catch (error) {
        console.error(error)
      }
      return done(new Error('Something has gone wrong!'))
    })
    return done(new Error('Something has gone wrong!'))
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
        const { title, content, imgURL, videoURL } = request.body
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'INSERT INTO articles (title, content, img_url, video_url) VALUES ($1, $2, $3, $4)',
          [title, content, imgURL, videoURL]
        )
        client.release()
        return { code: 201, message: `Successfully created articles ${title}.`, rows }
      },
    })

    fastify.route({
      method: 'DELETE',
      url: '/articles/:id',
      schema: deleteArticle,
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { id } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'DELETE FROM articles WHERE article_id=$1 RETURNING *;',
          [id]
        )
        client.release()
        return { code: 200, message: `Successfully deleted articles with id ${id}.`, rows }
      },
    })

    fastify.route({
      method: 'PUT',
      url: '/articles/:id',
      schema: updateArticles,
      preHandler: fastify.auth([fastify.verifyJWT], {
        relation: 'and',
      }),
      handler: async request => {
        const { title, content, imgURL, videoURL } = request.body
        const { id } = request.params
        const client = await fastify.pg.connect()
        const { rows } = await client.query(
          'UPDATE articles SET title=$1, content=$2, img_url=$3, video_url=$4 WHERE article_id=$5 RETURNING *;',
          [title, content, imgURL, videoURL, id]
        )
        client.release()
        return { code: 200, message: `Sucessfully updated articles with id ${id}.`, rows }
      },
    })
  })
}
