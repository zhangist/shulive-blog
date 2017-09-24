$(function(){
  //监听新增分类按钮
  $('#newCategoryBtn').click(function(){
    $('#newCategoryModal').show();
  });

  //监听确定按钮
  $('#submitCategory').click(function(){
    var categoryText = $('input[name=category]').val();
    if(!categoryText) return $(this).parents('.modal-wrap').find('.modalMsg').html('请填写分类名！');
    newCategory(categoryText);
  });
});

function newCategory(category){
  $.ajax({
    url: '/api/category',
    type: 'post',
    data: { category: category },
    success: function(data){
      if(data.code == '200'){
        msg({ text: '新增分类成功！' });
        document.location.reload();
      }else{
        msg({ text: data.msg });
      }
    }
  });
}
