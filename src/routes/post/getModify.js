const knex = require('./../../db/knexClient');

module.exports = async (ctx) => {
  const categoryData = knex('category').select()
    .where({
      user_id: ctx.session.user.id,
    });
  const postData = knex('post').select()
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
