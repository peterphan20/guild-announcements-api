const fastify = require("fastify");
const app = fastify({ logger: true });

app.register(require("fastify-postgres"), {
	connectionString: "postgres://postgres@localhost/postgres",
});
app.register(require("fastify-cors"));

app.get("/", (request, reply) => {
  fastify.pg.connet(onConnect)
});

const onConnect = (err, client, release) => {
  if (err) return reply.send(err);

  client.query(
    
  )
}

app.listen(5000, () => {
	console.log("Server is now listening on port 5000");
});
