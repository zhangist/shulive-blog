const dbClient = require('./../../db/client');

module.exports = async (ctx) => {
  let postData;
  if (ctx.params.categoryText) {
    postData = await dbClient('post').select()
      .leftJoin('category', 'category.id', 'post.category_id')
      .where({
        'category.name': ctx.params.categoryText,
      });
    await ctx.render('home/categoryId', {
      title: ctx.state.__('category-post-list'),
      categoryText: ctx.params.categoryText,
      postList: postData,
    });
  } else if (ctx.params.tagText) {
    postData = await dbClient('post').select()
      .where('tag', 'like', ctx.params.tagText);
    await ctx.render('home/tagId', {
      title: ctx.state.__('category-post-list'),
      tagText: ctx.params.tagText,
      postList: postData,
    });
  }
};
