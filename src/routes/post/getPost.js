const marked = require('marked');
const dbClient = require('./../../db/client');
const utils = require('./../../lib/utils');

module.exports = async (ctx) => {
  const postData = await dbClient('post').select()
    .where({
      user_id: ctx.session.user.id,
    });
  const post = postData[0];
  post.content = marked(post.content);
  post.create_time = utils.dateFormat(new Date(post.create_time), 'yyyy/MM/dd');

  await ctx.render('post/view', {
    title: postData[0].title,
    post: postData[0],
  });
};