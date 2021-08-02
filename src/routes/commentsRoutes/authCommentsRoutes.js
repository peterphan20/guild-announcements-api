const { deleteComment, updateComment } = require('../../schemas/commentsSchema')

module.exports = async function authCommentRoutes(fastify) {
  fastify.delete('/comments/:id', { schema: deleteComment }, async request => {
    const { id } = request.params
    const client = await fastify.pg.connect()
    const { rows } = await client.query('DELETE FROM comments WHERE comment_id=$1 RETURNING *;', [
      id,
    ])
    client.release()
    return { code: 200, message: `Comment with id ${id} has been deleted.`, rows }
  })

  fastify.put('/comments/:id', { schema: updateComment }, async request => {
    const { id } = request.params
    const { content } = request.body
    const client = await fastify.pg.connect()
    const { rows } = await client.query(
      'UPDATE comments SET content=$1 WHERE comment_id=$2 RETURNING *;',
      [content, id]
    )
    client.release()
    return { code: 200, message: `Comment with id ${id} has been updated.`, rows }
  })
}
