var categoryData = [];

$(function(){
  //右边栏 category ajax获取数据
  showCategoryRightBanner();

  $('.articleDeleteBtn').click(function(){
    var _this = $(this);
    var articleId = _this.data('id');
    if (confirm('确定删除？')) {
      deleteArticle(articleId, function(){
        _this.parents('.post-item').remove();
      });
    }
  });

  //监听分类选择
  $('body').on('click', '.category-item', function(){
    if (!$(this).hasClass('selected')) {
      $(this).parents('.category-list').find('.category-item').removeClass('selected');
      $(this).addClass('selected');
    }
  });
});

function getCategory(userId, callback) {
  if (categoryData.length == 0) {
    $.ajax({
      url: '/api/category/userid/'+userId,
      type: 'get',
      success: function (data) {
        if (data.code == '200') {
          categoryData = data.data;
          callback();
        }
      }
    });
  } else {
    callback();
  }
}

function showCategoryRightBanner() {
  if (categoryData.length == 0) {
    getCategory($('#categoryListRightBanner').data('user_id'), function(){
      showCategoryRightBannerHtml();
    });
  } else {
    showCategoryRightBannerHtml();
  }
}

function showCategoryRightBannerHtml() {
  var liHtml = '';
  for (var i = 0; i < categoryData.length; i++) {
    liHtml += '<li><a href="/home/category/'+categoryData[i].name+'">'+categoryData[i].name+'('+categoryData[i].count+')</a></li>';
  }
  $('#categoryListRightBanner').html(liHtml);
}

function deleteArticle(articleId, callback) {
  $.ajax({
    url: '/api/article/'+articleId,
    type: 'post',
    data: { isDeleted: 1 },
    success: function (data) {
      if (data.code == '200') {
        alert('删除成功！');
        callback();
      } else {
        alert(data.msg);
      }
    }
  });
}
