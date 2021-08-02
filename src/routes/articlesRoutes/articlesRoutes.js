module.exports = async function articleRoutes(fastify) {
  fastify.get('/articles', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      `
        SELECT title, content, img_url, video_url, last_edited, username 
        FROM articles 
        INNER JOIN users ON author_id = id;
      `
    )
    client.release()
    return { code: 200, rows }
  })
}
