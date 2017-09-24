const router = require('koa-router')();
const getIndex = require('./getIndex');
const getCategoryList = require('./getCategoryList');
const getTagList = require('./getTagList');
const getPostList = require('./getPostList');
const getSettingInfo = require('./getSettingInfo');
const getSettingAvatar = require('./getSettingAvatar');
const getSettingPassword = require('./getSettingPassword');

router.prefix('/home');
router.use(async (ctx, next) => {
  if (ctx.session.user) {
    await next();
  } else {
    ctx.session.redirectUrl = ctx.url;
    ctx.redirect('/login');
  }
});

router.get('/', getIndex);
router.get('/category', getCategoryList);
router.get('/tag', getTagList);
router.get('/category/:categoryText', getPostList);
router.get('/tag/:tagText', getPostList);
router.get('/setting', (ctx) => {
  ctx.redirect('/home/setting/info');
});
router.get('/setting/info', getSettingInfo);
router.get('/setting/avatar', getSettingAvatar);
router.get('/setting/password', getSettingPassword);

module.exports = router;
