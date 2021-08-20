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

  fastify.get('/articles/:id', async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      `
      SELECT 
        a.title, 
        a.content, 
        a.img_url, 
        a.video_url,
        json_agg(json_build_object(
          'commentContent', c.content,
          'createdAt', c.created_at,
          'username', u.username
        )) AS comments
      FROM articles a
      LEFT JOIN comments c 
        ON c.article_id = a.article_id
      LEFT JOIN users u
        ON u.id = c.author_id
      WHERE a.article_id=$1
      GROUP BY 
        a.title,
        a.content,
        a.img_url,
        a.video_url;
      `,
      [id]
    )
    client.release()
    return { code: 200, rows }
  })
}
