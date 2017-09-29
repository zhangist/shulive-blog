/**
 * !!!!!!!!!!!!!!!!!!!! Attention !!!!!!!!!!!!!!!!!!!!
 * copy this file to "app.dev.js" or "app.prd.js" and set
 * the corresponding differents environment variables.
 * Directory structure:
 * +-bin
 * `-config
 *   |-app.js (template of app.dev.js or app.prd.js)
 *   |-app.dev.js (for development, git ignore)
 *   `-app.prd.js (for production, git ignore)
 * ...
 */

// app name
process.env.APP_NAME = process.env.APP_NAME || 'shulive-blog';

// db host,port,user,password,database
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '3306';
process.env.DB_USER = process.env.DB_USER || 'shulive';
process.env.DB_PWD = process.env.DB_PWD || 'shulive';
process.env.DB_NAME = process.env.DB_NAME || 'shulive_blog';

// port
process.env.PORT = process.env.PORT || '3001';

// static file host
process.env.STATIC_HOST = process.env.STATIC_HOST || 'https://static.shulive.com';

// in app.dev.js or app.prd.js add this line
// require('./app');
