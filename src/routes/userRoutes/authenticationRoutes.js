const bcrypt = require('bcrypt')
const { createUser, loginUser } = require('../../schemas/usersSchemas')

module.exports = async function authenticateUsers(fastify) {
  // Creates user and hash password for db
  fastify.post('/auth/create', { schema: createUser }, async request => {
    const { username, password } = request.body

    if (!username || !password) {
      return { code: 400, message: 'Invalid username or password provided.' }
    }

    const hash = await bcrypt.hash(password, 10)
    const client = await fastify.pg.connect()
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;', [
      username,
      hash,
    ])
    client.release()
    return { code: 200, message: 'User successfully created' }
  })

  // Deciphers hashed password from db
  // Authenticate user by comparing deciphered password and password sent from front end
  fastify.post('/auth/login', { schema: loginUser }, async request => {
    const { username, password } = request.body

    if (!username) {
      return { code: 400, message: 'Invalid username or password provided.' }
    }

    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT password, id FROM users WHERE username=$1', [
      username,
    ])
    const passwordMatch = await bcrypt.compare(password, rows[0].password)
    if (passwordMatch) {
      const wristband = await fastify.generateAuthToken({ user: username })
      return {
        code: 200,
        message: 'Successfully logged in!',
        userId: rows[0].id,
        wristband: wristband,
      }
    }
    return { code: 400, message: 'Invalid username or password provided.' }
  })
}
