// const knex = require('./../../db/knexClient');

module.exports = async (ctx) => {
  await ctx.render('home/settingInfo', {
    title: ctx.state.__('setting-info'),
  });
};
