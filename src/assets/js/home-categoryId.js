$(function(){
  //监听删除分类按钮
  $('#deleteCategoryBtn').click(function(){
    msg({
      'type': 'confirm',
      'text': '确定删除此分类？',
      'callback': function(){
        msg({'text':'删除成功！'});
      }
    });
  });
});
