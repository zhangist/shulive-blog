// const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  await ctx.render('home/settingAvatar', {
    title: ctx.state.__('setting-avatar'),
  });
};
