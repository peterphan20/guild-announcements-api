const fastify = require("fastify");
const app = fastify();

app.get("/", (request, reply) => {
	return "hello world";
});

app.listen(5000, () => {
	console.log("Server is now listening on port 5000");
});
