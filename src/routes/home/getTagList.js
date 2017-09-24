const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const tagData = await dbClient('tag').select()
    .where({
      user_id: ctx.session.user.id,
    });

  await ctx.render('home/tag', {
    title: ctx.state.__('category'),
    tagList: tagData[0],
  });
};
