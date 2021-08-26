/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE articles 
    DROP CONSTRAINT articles_author_id_fkey;
    ALTER TABLE articles
    ADD CONSTRAINT author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id) 
    ON DELETE SET NULL;
`)
}

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE articles 
    DROP CONSTRAINT author_id_fkey;
    ALTER TABLE articles
    ADD CONSTRAINT author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id);
  `)
}
