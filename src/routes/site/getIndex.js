const marked = require('marked');
const utils = require('./../../lib/utils');
const knex = require('./../../db/knexClient');

module.exports = async (ctx) => {
  const postData = await knex.select('*', 'post.id as post_id')
    .from('post')
    .leftJoin('shulive.user', 'user.id', 'post.user_id')
    .where({
      'post.is_deleted': 0,
    })
    .limit(10)
    .orderBy('post.id', 'DESC');
  const postList = postData.map((item) => {
    // 把 markdown 转换成 html 再过滤掉 html 标签
    const newItem = item;
    newItem.content = marked(newItem.content).replace(/<[^>]+>/g, '');
    newItem.create_time = utils.dateFormat(new Date(newItem.create_time), 'yyyy/MM/dd');
    return item;
  });
  await ctx.render('site/index', {
    title: ctx.state.__('index'),
    postList,
  });
};
