const createComment = {
  body: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        created: { type: 'boolean' },
      },
    },
  },
}

const deleteComment = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

const updateComment = {
  body: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string' },
    },
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

module.exports = { createComment, deleteComment, updateComment }
