require('dotenv').config()
const fastify = require('fastify')({ logger: true })

const PORT = process.env.PORT || 3000

fastify.register(require('fastify-cors'))
fastify.register(require('fastify-postgres'), {
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : null,
})
fastify.register(require('fastify-jwt'), {
  secret: process.env.SECRET_KEY,
})
fastify.register(require('./routes'))

async function start() {
  try {
    await fastify.listen(PORT, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
