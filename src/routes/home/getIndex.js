const marked = require('marked');
const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  const page = {
    num: ctx.query.p || 1,
    size: ctx.query.s || 10,
  };
  const postData = await dbClient('post').select()
    .where({
      user_id: ctx.session.user.id,
      is_deleted: 0,
    }).limit(page.size)
    .offset((page.num - 1) * page.size)
    .orderBy('id', 'DESC');

  const postList = postData.map((item) => {
    // 把 markdown 转换成 html 再过滤掉 html 标签
    const newItem = item;
    newItem.content = marked(newItem.content).replace(/<[^>]+>/g, '');
    return newItem;
  });
  // 查询分页数据
  if (postList.length === page.size) {
    const postCount = await dbClient('post').count()
      .where({
        user_id: ctx.session.user.id,
      });

    page.count = Math.ceil(postCount / page.size);
  } else {
    page.count = page.num;
  }
  await ctx.render('home/index', {
    title: ctx.state.__('home'),
    postList,
    page,
  });
};
