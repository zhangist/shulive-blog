const marked = require('marked');
const utils = require('./../../lib/utils');
const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  let where;
  if (ctx.params.urlName) {
    where = { 'user.url_name': ctx.params.urlName };
  }
  if (ctx.params.uid) {
    where = { 'user_local.user_id': ctx.params.uid };
  }

  const userData = await dbClient.select()
    .from('user_local')
    .leftJoin('shulive.user', 'user_local.user_id', 'user.id')
    .where(where);

  if (!userData[0]) {
    await ctx.render('404', {
      title: ctx.state.__('not-found'),
    });
  } else {
    const user = userData[0];
    const page = {
      num: ctx.query.p ? ctx.query.p : 1,
      size: 10,
    };

    const postData = await dbClient.select().from('post')
      .where({
        user_id: user.id,
      })
      .limit(10)
      .offset((page.num - 1) * page.size)
      .orderBy('id', 'DESC');
    const postList = postData.map((item) => {
      // 把 markdown 转换成 html 再过滤掉 html 标签
      const newItem = item;
      newItem.content = marked(newItem.content).replace(/<[^>]+>/g, '');
      newItem.create_time = utils.dateFormat(new Date(newItem.create_time), 'yyyy/MM/dd');
      return item;
    });

    // 查询分页数据
    if (postList.length === page.size) {
      const postCount = await dbClient.count()
        .from('post')
        .where({
          user_id: userData.id,
        });
      page.count = Math.ceil(postCount / page.size);
    } else {
      page.count = page.num;
    }

    await ctx.render('site/index', {
      title: ctx.state.__('index'),
      userData: user,
      postList,
      page,
    });
  }
};
