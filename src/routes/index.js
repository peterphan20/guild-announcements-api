const userRoutes = require('./userRoutes')
const authRoutes = require('./authRoutes')
const adminRoutes = require('./adminRoutes')

module.exports = async function routes(fastify) {
  fastify.register(userRoutes)
  fastify.register(authRoutes)
  fastify.register(adminRoutes)
}
