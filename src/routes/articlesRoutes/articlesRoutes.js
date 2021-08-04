module.exports = async function articleRoutes(fastify) {
  fastify.get('/articles', async () => {
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      `
        SELECT 
          a.article_id,
          a.title, 
          a.content, 
          a.img_url, 
          a.video_url, 
          a.created_at,
          a.last_edited, 
          u.username 
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id;
      `
    )
    client.release()
    return { code: 200, rows }
  })
}
