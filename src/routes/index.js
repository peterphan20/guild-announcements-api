const usersRoutes = require('./userRoutes/usersRoutes')
const authenticationRoutes = require('./userRoutes/authenticationRoutes')
const adminUsersRoutes = require('./userRoutes/adminUsersRoutes')
const articlesRoutes = require('./articlesRoutes/articlesRoutes')
const authArticlesRoutes = require('./articlesRoutes/authArticlesRoutes')

module.exports = async function routes(fastify) {
  fastify.register(usersRoutes)
  fastify.register(authenticationRoutes)
  fastify.register(adminUsersRoutes)
  fastify.register(articlesRoutes)
  fastify.register(authArticlesRoutes)
}
