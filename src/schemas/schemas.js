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

const deleteUser = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

module.exorts = { createUser, deleteUser }
