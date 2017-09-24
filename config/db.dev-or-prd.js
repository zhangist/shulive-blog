/**
 * !!!!!!!!!!!!!!!!!!!! Attention !!!!!!!!!!!!!!!!!!!!
 * Rename this file to "db.dev.js" or "db.prd.js" and set
 * the corresponding environment variables.
 * Directory structure:
 * +-bin
 * `-config
 *   |-db.dev-or-prd.js (template of db.dev.js or db.prd.js)
 *   |-db.dev.js (for development, git ignore)
 *   `-db.prd.js (for production, git ignore)
 * ...
 */
module.exports = {
  mysql: {
    host: '<host>',
    port: '<port>',
    user: '<user>',
    password: '<password>',
    database: '<database>',
  },
};
