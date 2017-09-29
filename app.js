const path = require('path');
const Koa = require('koa');
// const convert = require('koa-convert');
const serve = require('koa-static');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const mount = require('koa-mount');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const session = require('koa-session');
const redisStore = require('koa-redis');
const locale = require('koa-locale');
const i18n = require('koa-i18n');

const site = require('./src/routes/site');
const home = require('./src/routes/home');
const post = require('./src/routes/post');
const user = require('./src/routes/user');

const isDev = process.env.NODE_ENV ? !(process.env.NODE_ENV === 'production') : true;
const env = isDev ? 'development' : 'production';
const staticPath = isDev ? '/src/assets' : '/dist/assets';
const viewsPath = isDev ? '/src/views' : '/dist/views';

console.log(`
NODE_ENV:   ${process.env.NODE_ENV}
   isDev:   ${isDev}
     ENV:   ${env}
    Host:   localhost:3001
`);

const app = new Koa();

app.keys = ['sssssssecret', 'secrettttttt'];
app.proxy = true;

// i18n
locale(app);
app.use(i18n(app, {
  directory: path.join(__dirname, '/src/i18n'),
  locales: ['zh-cn', 'en'], // `zh-CN` defualtLocale
  modes: [
    'cookie', // optional detect cookie - `Cookie: locale=zh-CN`
    'header', // optional detect header - `Accept-Language: zh-CN,zh;q=0.5`
  ],
}));

// error handler
if (isDev) {
  onerror(app);
}

// middlewares
// cache
app.use(conditional());
app.use(etag());

// body parsing
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));

// json
app.use(json());

// logger
app.use(logger());

// assets
app.use(mount('/static', serve(path.join(__dirname, staticPath))));

// views
app.use(views(path.join(__dirname, viewsPath), {
  extension: 'pug',
}));

// session
app.use(session({
  store: redisStore({
    host: '127.0.0.1',
    port: '6379',
  }),
  maxAge: 86400000, // 1 days
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
}, app));

// state
app.use(async (ctx, next) => {
  if (ctx.session && ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }
  ctx.state.staticHost = process.env.STATIC_HOST;
  // filter the last '/' in url to determine link's active
  ctx.state.urlPath = ctx.url.replace(/(.+)(\/)$/, '$1');
  ctx.i18n.setLocaleFromSessionVar(ctx);
  await next();
});

// logger
if (isDev) {
  app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
}

// routes
app.use(site.routes(), site.allowedMethods());
app.use(home.routes(), home.allowedMethods());
app.use(post.routes(), post.allowedMethods());
app.use(user.routes(), user.allowedMethods());

module.exports = app;
