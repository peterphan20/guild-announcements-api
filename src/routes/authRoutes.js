const bcrypt = require('bcrypt')
const { createUser, loginUser } = require('../schemas/schemas')

module.exports = async function authenticateUsers(fastify) {
  // Creates user and hash password for db
  fastify.post('/auth/create', { schema: createUser }, async request => {
    const { username, password } = request.body
    if (!request.body) {
      return { code: 400, message: 'No username or password provided' }
    }
    if (!username) {
      return { code: 400, message: 'No username provided' }
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return { code: 500, message: 'An error occured while hashing password.' }
      }

      const client = await fastify.pg.connect()
      const { rows } = await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;',
        [username, hash]
      )
      client.release()
      return { code: 200, rows }
    })
    return { code: 500, message: 'No idea what happened' }
  })

  // Deciphers hashed password from db
  // Authenticate user by comparing deciphered password and password sent from front end
  fastify.post('/auth/login', { schema: loginUser }, async request => {
    const { username, password } = request.body
    if (!request.body) {
      return { code: 400, message: 'No username or password provided!' }
    }

    const client = await fastify.pg.connect()
    const { rows } = await client.query('SELECT password FROM users WHERE username=$1', [username])
    console.log(rows)
    const passwordMatch = await bcrypt.compare(password, rows[0].password)
    if (rows.username && passwordMatch) {
      const wristband = await fastify.generateAuthToken({ user: username })
      return {
        code: 200,
        message: 'Successfully logged in!',
        wristband: wristband,
      }
    }
    return { code: 500, message: 'No idea what is happening' }
  })
}
