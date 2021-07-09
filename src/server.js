require('dotenv').config()
const fastify = require('fastify')

const app = fastify({ logger: true })
const PORT = process.env.PORT || 3000

app.register(require('fastify-postgres'), {
  connectionString: 'postgres://postgres@localhost/postgres',
})
app.register(require('fastify-cors'))

app.get('/', () => 'hello world')

const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
