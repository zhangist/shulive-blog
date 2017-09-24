$(function(){
  //getCategoryList();
});

//获取分类列表
function getCategoryList(){
  $.ajax({
    url: '/api/category',
    type: 'get',
    success: function(data){
      if(data.code == '200'){
        var liHtml = '';
        for(var i=0;i<data.data.length;i++){
          liHtml += '<li><a href="/home/category/'+data.data[i].id+'">'+data.data[i].name+'</a>('+data.data[i].count+')</li>';
        }
        $('.category-list').html(liHtml);
      }
    }
  });
}
