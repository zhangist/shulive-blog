const router = require('koa-router')();
const getPost = require('./getPost');
const getWrite = require('./getWrite');
const getModify = require('./getModify');

router.prefix('/post');

router.get('/:pid([0-9]{20})', getPost);
router.get('/write', getWrite);
router.get('/modify/:pid', getModify);

module.exports = router;
