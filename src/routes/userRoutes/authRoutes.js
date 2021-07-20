const { default: fastify } = require('fastify')

fastify.register(require('fastify-basic-auth'))

fastify.after(() => {
  fastify.route({
    method: 'POST',
    url: '/',
    onRequest: fastify.basicAuth,
    handler: async () => ({ hello: 'world' }),
  })
})
