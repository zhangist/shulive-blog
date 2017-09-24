module.exports = async (ctx) => {
  await ctx.render('site/login', {
    title: ctx.state.__('login'),
  });
};
