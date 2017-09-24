const crypto = require('crypto');
const utils = require('./../../lib/utils');
const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const { email, password } = ctx.request.body;
  if (!(email && password)) {
    await ctx.render('site/login', {
      title: ctx.state.__('login'),
      email,
      msg: {
        type: 'error',
        text: ctx.state.__('email-password-required'),
      },
    });
  } else {
    let userData = await dbClient('user_local').select()
      .leftJoin('shulive.user', 'user_local.user_id', 'user.id')
      .where({ email });

    if (!userData[0]) {
      userData = await dbClient('shulive.user').select().where({ email });
      if (!userData[0]) {
        await ctx.render('site/login', {
          title: ctx.state.__('login'),
          email,
          msg: {
            type: 'error',
            text: ctx.state.__('email-does-not-exist'),
          },
        });
      } else {
        const user = userData[0];
        const userInsert = await dbClient('user_local').insert({
          user_id: user.id,
          last_login_time: utils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          last_login_ip: ctx.ip,
          register_time: utils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          register_ip: ctx.ip,
        });

        const md5password = crypto.createHash('md5').update(password + user.salt, 'utf-8').digest('hex');
        if (md5password !== user.password) {
          await ctx.render('site/login', {
            title: ctx.state.__('login'),
            email,
            msg: {
              type: 'error',
              text: ctx.state.__('password-incorrect'),
            },
          });
        } else {
          ctx.session.user = Object.assign({}, user, userInsert[0]);
          if (ctx.session.redirectUrl) {
            ctx.redirect(ctx.session.redirectUrl);
          } else {
            ctx.redirect('/home');
          }
        }
      }
    } else {
      const userDataAll = userData[0];
      const md5password = crypto.createHash('md5').update(password + userDataAll.salt, 'utf8').digest('hex');
      if (md5password !== userDataAll.password) {
        await ctx.render('site/login', {
          title: ctx.state.__('login'),
          email,
          msg: {
            type: 'error',
            text: ctx.state.__('password-incorrect'),
          },
        });
      } else {
        const changes = {
          last_login_time: utils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          last_login_ip: ctx.ip,
        };
        await dbClient('user_local').update(changes);
        ctx.session.user = Object.assign({}, userDataAll, changes);
        if (ctx.session.redirectUrl) {
          ctx.redirect(ctx.session.redirectUrl);
          ctx.session.redirectUrl = '';
        } else {
          ctx.redirect('/home');
        }
      }
    }
  }
};
