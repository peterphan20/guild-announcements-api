require('dotenv').config()
const { Client } = require('pg')

const main = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  await client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

  console.log('About to query users table')
  await client.query(`
    INSERT INTO users
      (username, password)
    VALUES
      ('test1', 'test1'),
      ('test2', 'test2'),
      ('test3', 'test3'),
      ('test4', 'test4'),
      ('test5', 'test5')
  `)
  console.log('Finished querying users table')

  console.log('About to query articles table')
  await client.query(`
  INSERT INTO articles 
  (author_id, title, content, img_url)
  VALUES
  (1, 'test1', 'hello from the announcements page', 'https://rb.gy/atmcrm'),
  (2, 'test2', 'hello from peters page', 'https://rb.gy/sl8rez'),
  (3, 'test3', 'hello from buis page', 'https://rb.gy/ve25lf'),
  (4, 'test4', 'hello from erics page', 'https://rb.gy/0qcrbh'),
  (5, 'test5', 'hello from jonathans page', 'https://rb.gy/vonjxz')
  `)
  console.log('Finished querying articles table')

  console.log('About to query comments table')
  await client.query(`
  INSERT INTO comments 
    (author_id, article_id, content)
  VALUES
    (1, 1, 'wow what a great article, good job!'),
    (2, 2, 'wow what a great article, fantastic job!'),
    (3, 3, 'very cool, wow'),
    (4, 4, 'this article was very helpful! Thank you very much'),
    (5, 5, 'this article was not helpful, please delete')
`)
  console.log('Finished querying comments table')

  client.end(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('disconnected')
    }
  })
}
main()
