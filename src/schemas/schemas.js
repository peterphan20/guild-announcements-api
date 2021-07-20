const createUser = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        create: { type: 'boolean' },
      },
    },
  },
}

module.exorts = createUser
