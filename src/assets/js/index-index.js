$(function(){
  getHotArticleList();
});

//获取热门文章列表
function getHotArticleList(){
  $.ajax({
    url: '/api/hotArticle',
    type: 'get',
    success: function(data){
      if(data.code == '200'){
        var liHtml = '';
        for(var i=0;i<data.data.length;i++){
          liHtml += '<li><a href="/article/'+data.data[i].id+'">'+data.data[i].title+'</a><span>'+data.data[i].count+'浏览</span></li>';
        }
        $('#hotArticleList').html(liHtml);
      }
    }
  });
}
