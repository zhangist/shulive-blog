const isDev = process.env.NODE_ENV ? !(process.env.NODE_ENV === 'production') : true;

const client = require('knex')({
  client: 'mysql2',
  debug: isDev,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  pool: { min: 0, max: 7 },
});

module.exports = client;
