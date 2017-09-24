$("body").on("click", function(e){
  e = e || event;
  $(".dropdownList").hide();
  if($(e.target).parents(".dropdownBtn")){
    $(e.target).parents(".dropdownWrap").find(".dropdownList").show();
  }
});

//监听关闭按钮
$('.modalCloseBtn').click(function(){
  $(this).parents('.modal-wrap').hide();
});

function inputAdd(querySelector, callback) {
  $(querySelector).find('.input-add-btn').click(function(){
    $(this).parents(querySelector).css({'width': '100%', 'display': 'flex'});
    $(this).css('display', 'none');
    $(this).siblings('input').show();
    $(this).siblings('.input-finish-btn').css('display', 'inline-block');
  });
  $(querySelector).find('.input-finish-btn').click(function(){
    var value = $(this).siblings('input').val();
    if (!value) return alert('未填写任何数据！');
    if(callback(value) === false) return false;
    $(this).siblings('input').val('');
    $(this).parents(querySelector).css({'width': 'auto', 'display': 'inline-block'});
    $(this).css('display', 'none');
    $(this).siblings('input').hide();
    $(this).siblings('.input-add-btn').css('display', 'inline-block');
  });
}

function msg(options) {
  var text = options.text || '提示消息';
  var type = options.type || 'alert';
  var callback = options.callback || function(){};
  if(type=='alert'){
    alert(text);
  }
  if(type=='confirm'){
    if(confirm(text)){
      callback();
    }
  }
}
