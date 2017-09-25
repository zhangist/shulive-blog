const marked = require('marked');
const knex = require('./../../db/knexClient');
const utils = require('./../../lib/utils');

module.exports = async (ctx) => {
  const postData = await knex('post').select()
    .where({
      id: ctx.params.pid,
    });
  const post = postData[0];
  post.content = marked(post.content);
  post.create_time = utils.dateFormat(new Date(post.create_time), 'yyyy/MM/dd');

  await ctx.render('post/view', {
    title: postData[0].title,
    post: postData[0],
  });
};
