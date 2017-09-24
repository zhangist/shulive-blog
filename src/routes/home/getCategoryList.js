const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const categoryData = await dbClient('category').select()
    .where({
      user_id: ctx.session.user.id,
    });

  await ctx.render('home/category', {
    title: ctx.state.__('category'),
    categoryList: categoryData,
  });
};
