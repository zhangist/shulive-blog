module.exports = async (ctx) => {
  ctx.session.user = '';
  ctx.redirect('/');
};
