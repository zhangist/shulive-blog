const router = require('koa-router')();
const getIndex = require('./getIndex');
const getLogin = require('./getLogin');
const getLogout = require('./getLogout');
const postLogin = require('./postLogin');

router.get('/', getIndex);
router.get('/login', getLogin);
router.get('/logout', getLogout);
router.post('/login', postLogin);

module.exports = router;
