const knex = require('./../../db/knexClient');

module.exports = async (ctx) => {
  const categoryData = await knex('category').select()
    .where({
      user_id: ctx.session.user.id,
    });

  await ctx.render('home/category', {
    title: ctx.state.__('category'),
    categoryList: categoryData,
  });
};
