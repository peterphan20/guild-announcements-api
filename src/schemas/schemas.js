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

const updateUser = {
  body: {
    type: 'object',
    properties: {
      password: { type: 'string' },
    },
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

module.exports = { createUser, deleteUser, updateUser }
