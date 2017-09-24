const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const categoryData = dbClient('category').select()
    .where({
      user_id: ctx.session.user.id,
    });
  const postData = dbClient('post').select()
    .where({
      id: ctx.params.pid,
    });

  if (postData[0]) {
    await ctx.render('post/write', {
      title: ctx.state.__('modify-post'),
      post: postData[0],
      categoryList: categoryData,
    });
  } else {
    await ctx.render('post/write', {
      title: ctx.state.__('write'),
      categoryList: categoryData,
    });
  }
};
