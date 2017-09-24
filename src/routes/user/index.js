const router = require('koa-router')();
const getIndex = require('./getIndex');

router.get('/:uid([0-9]{20})', getIndex);
router.get('/@:urlName', getIndex);

module.exports = router;
