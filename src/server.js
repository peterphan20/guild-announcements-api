require('dotenv').config()
const fastify = require('fastify')({ logger: true })

const PORT = process.env.PORT || 3000

fastify.register(require('fastify-postgres'), {
  connectionString: 'postgres://postgres@localhost/postgres',
})
fastify.register(require('fastify-cors'))

fastify.get('/', () => 'hello world')

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
