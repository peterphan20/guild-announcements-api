/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE comments 
    DROP CONSTRAINT IF EXISTS comments_article_id_fkey;
    ALTER TABLE comments
    DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
    ALTER TABLE comments
    ADD CONSTRAINT author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id) 
    ON DELETE SET NULL;
    ALTER TABLE comments
    ADD CONSTRAINT article_id_fkey
    FOREIGN KEY (article_id) REFERENCES articles(article_id) 
    ON DELETE SET NULL;
  `)
}

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE comments 
  DROP CONSTRAINT IF EXISTS comments_article_id_fkey;
  ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
  ALTER TABLE comments
  ADD CONSTRAINT author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES users(id); 
  ALTER TABLE comments
  ADD CONSTRAINT article_id_fkey
  FOREIGN KEY (article_id) REFERENCES articles(article_id);
`)
}
