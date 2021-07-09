/* eslint-disable camelcase */

exports.up = (pgm) => {
	pgm.sql(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(200) NOT NULL,
      join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      title VARCHAR(50),
      content VARCHAR(5000),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_edited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      img_url VARCHAR(200),
      video_url VARCHAR(200)
    );
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id),
      article_id INTEGER REFERENCES articles(article_id),
      content VARCHAR(2000),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
	pgm.sql(`
    DROP TABLE users;
    DROP TABLE articles;
    DROP TABLE comments; 
  `);
};
