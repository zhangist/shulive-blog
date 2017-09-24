const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const categoryData = await dbClient('category').select()
    .where({
      user_id: ctx.session.user.id,
    });

  await ctx.render('post/write', {
    title: ctx.state.__('write'),
    categoryList: categoryData,
  });
};
