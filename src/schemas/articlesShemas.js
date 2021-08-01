const createArticle = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      img_url: { type: 'string' },
      video_url: { type: 'string' },
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

const deleteArticle = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

const updateArticles = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      img_url: { type: 'string' },
      video_url: { type: 'string' },
    },
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  },
}

module.exports = { createArticle, deleteArticle, updateArticles }
