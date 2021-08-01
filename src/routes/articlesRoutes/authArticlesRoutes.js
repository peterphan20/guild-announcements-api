const { createArticle, deleteArticle, updateArticles } = require('../../schemas/articlesShemas')

module.exports = async function authArticlesRoutes(fastify) {
  fastify.requireAuthentication(fastify)

  fastify.get('/articles/:id', async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'SELECT title, content, imageURL, videoURL, FROM articles WHERE id=$1',
      [id]
    )
    client.release()
    return { code: 200, rows }
  })

  fastify.post('/articles', { schema: createArticle }, async request => {
    const { title, content, imageURL, videoURL } = request.body
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'INSERT INTO articles (title, content, imageURL, videoURL) VALUES ($1, $2, $3, $4)',
      [title, content, imageURL, videoURL]
    )
    client.release()
    return { code: 200, message: `Successfully created articles ${title}`, rows }
  })

  fastify.delete('/articles/:id', { schema: deleteArticle }, async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('DELETE FROM articles WHERE id=$1 RETURNING *;', [id])
    client.release()
    return { code: 200, message: `Successfully deleted articles with id ${id}.`, rows }
  })

  fastify.put('/articles/:id', { schema: updateArticles }, async request => {
    const { title, content, imageURL, videoURL } = request.body
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'UPDATE articles SET title=$1, content=$imageURLurl=$3, viURLurl=$4 WHERE id=$ RETURNING *;',
      [title, content, imageURL, videoURL, id]
    )
    client.release()
    return { code: 200, message: `Sucessfully updated articles with id ${id}`, rows }
  })
}
