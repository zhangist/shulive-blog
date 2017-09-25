// const knex = require('./../../db/knexClient');

module.exports = async (ctx) => {
  await ctx.render('home/settingPassword', {
    title: ctx.state.__('setting-password'),
  });
};
