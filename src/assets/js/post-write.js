$(function(){
  var winWidth = document.body.clientWidth,
      winHeight = document.body.clientHeight,
      writeBoxWrap = document.getElementById('writeBoxWrap'),
      writeBoxLine = writeBoxWrap.firstChild.nextSibling,
      writeBoxCode = writeBoxWrap.firstChild,
      writeBoxPreview = writeBoxWrap.lastChild,
      viewMode = 0, //显示模式 0:中分;1:code;2:preview.
      mergeWidth = 520, //合并宽度
      leftPercent = 50, //左边编辑区的百分比宽度
      resizeTimer = null, //监听窗口改变的定时器
      mousePageX = 0, //鼠标x坐标
      lineOffsetX = 0, //line x坐标
      isMouseDown = false; //鼠标是否在line按下的状态

  //初始化 Mode/宽度
  if (winWidth < 520) {
    viewMode = 1;
  }
  updateWriteBoxSize(leftPercent);
  writeBoxPreview.lastChild.innerHTML = marked($('#articleContent').val());
  //tag
  inputAdd('.tag-add-wrap', function(value){
    $('.tag-list').append('<li class="tag-item"><span class="tag-text">'+value+'</span><a class="tag-delete-btn">X</a></li>');
  });
  //category
  inputAdd('.category-add-wrap', function(value){
    var isRepeat = false;
    $('.category-list').find('.category-item').each(function(){
      if($(this).html() == value){
        alert('该分类已存在！');
        isRepeat = true;
        return false;
      }
    });
    if(isRepeat) return false;
    $.ajax({
      url: '/api/category',
      type: 'post',
      data: { category: value },
      success: function(data){
        if(data.code == '200'){
          $('.category-list').find('.category-item').removeClass('selected');
          $('.category-list').append('<li class="category-item selected" data-id="'+data.id+'">'+value+'</li>');
        }
      }
    });

  });

  //监听发布按钮
  $('#publishBtn').click(function(){
    var content = $('#articleContent').val();
    if(!content) return alert("您还没有写任何内容！");
    $('#publishModal').show();
  });

  //监听预览按钮
  $('#previewBtn').click(function(){
    if (viewMode === 1) {
      viewMode = 2;
      $(this).css({'background':'#eee'});
    } else {
      viewMode = 1;
      $(this).css({'background':'none'});
    }
    updateWriteBoxSize(leftPercent);
  });

  //监听标签选择
  $('body').on('click', '.tag-delete-btn', function(){
    $(this).parents('.tag-item').remove();
  });
  //监听分类选择
  $('body').on('click', '.category-item', function(){
    if (!$(this).hasClass('selected')) {
      $(this).parents('.category-list').find('.category-item').removeClass('selected');
      $(this).addClass('selected');
    }
  });

  //监听确定按钮
  $('#submitPublish').click(function(){
    var id = $('input[name=id]').val();
    var title = $('input[name=title]').val();
    var content = $('#articleContent').val();
    var categoryId = $('#categorySet').find('.category-item.selected').data('id');
    var tag = '';
    $.each($('#tagSet').find('.tag-text'), function(){
      if (tag) {
        tag += '||'+$(this).html();
      } else {
        tag = $(this).html();
      }
    });
    if(!title) {
      $(this).parents('.modal-wrap').find('.modalMsg').html('请填写标题！');
      return false;
    }
    publish(id, title, content, tag, categoryId)
  });

  //监听关闭按钮
  $('.modalCloseBtn').click(function(){
    $(this).parents('.modal-wrap').hide();
  });

  //监听浏览器窗口大小改变
  window.onresize = function(){
    winWidth = document.body.clientWidth;
    winHeight = document.body.clientHeight;
    //if (resizeTimer) return;
    //resizeTimer = setTimeout(function(){updateWriteBoxSize(leftPercent)},0);
    if (winWidth < 520) {
      viewMode = (viewMode === 2) ? 2 : 1;
    } else {
      viewMode = 0;
    }
    updateWriteBoxSize(leftPercent);
  }

  //判断鼠标是否在line按下
  writeBoxLine.addEventListener('mousedown', function(e){
    mousePageX = e.pageX;
    lineOffsetX = writeBoxLine.offsetLeft;
    isMouseDown = true;
  });

  //移动line
  document.querySelector("body").addEventListener('mousemove', function(e){
    var mouseOffsetX = e.pageX - mousePageX;
    if(isMouseDown && mouseOffsetX){
      e = e || event;
      var _winWith = document.body.clientWidth,
          minPercent = 20,
          lineOffset = 32/2, // line的宽度/2
          percent = (1-(_winWith-mouseOffsetX-lineOffsetX-lineOffset)/_winWith)*100,
          percent = percent < minPercent ? minPercent : percent > 100-minPercent ? 100-minPercent : percent;
      leftPercent = percent;
      updateWriteBoxSize(leftPercent);
    }
  });

  //判断鼠标是否放开
  document.querySelector("body").addEventListener('mouseup', function(e){
    isMouseDown = false;
  });

  //监听textarea输入
  var inputTimer = null;
  document.getElementById('articleContent').oninput = function(e){
    e = e || event;
    if(inputTimer){
      clearTimeout(inputTimer);
    }
    inputTimer = setTimeout(function(){
      //marked 配置
      var renderer = new marked.Renderer();
      renderer.html = function(html){
        var escapedHtml = html.toLowerCase().replace(/<iframe>/g, '-');
        return escapedHtml;
      }
      writeBoxPreview.lastChild.innerHTML = marked(e.target.value, {renderer: renderer});
      clearTimeout(inputTimer);
    },1000);
  }

  $('.insertMarkdown').click(function(){
    var text = $(this).text()+'';
    var insertText = "";
    if (text.indexOf('粗体') > -1) insertText = '** 粗体 **';
    if (text.indexOf('列表') > -1) insertText = '- 列1\n- 列2\n- 列3';
    if (text.indexOf('链接') > -1) insertText = '这是一个[链接](http://example.com/)。';
    if (text.indexOf('图片') > -1) insertText = '![alt text](/static/img/logo.png "Title")';
    if (insertText) {
      insertMarkdown($('#articleContent')[0], insertText);
      writeBoxPreview.lastChild.innerHTML = marked($('#articleContent').val());
    }
  });

  //改变textarea大小
  function updateWriteBoxSize(percent) {
    //var _winWith = document.body.scrollWidth;
    var _winWith = document.body.clientWidth;
    var _winHeight = document.body.clientHeight;

    writeBoxWrap.style.height = (_winHeight-48)+'px';
    var writeBoxCodeTextarea = writeBoxCode.lastChild,
        writeBoxPreviewDiv = writeBoxPreview.lastChild;

    if (viewMode === 0) {
      writeBoxCode.style.display = '';
      writeBoxLine.style.display = '';
      writeBoxPreview.style.display = '';
      writeBoxCode.style.width = ((_winWith-32)*percent/100)+'px';
      writeBoxPreview.style.width = ((_winWith-32)*(100-percent)/100)+'px';
      writeBoxCodeTextarea.style.width = ((_winWith-32)*percent/100)+'px';
      writeBoxCodeTextarea.style.height = writeBoxWrap.offsetHeight+'px';
      writeBoxPreviewDiv.style.width = ((_winWith-32)*(100-percent)/100)+'px';
      writeBoxPreviewDiv.style.height = writeBoxWrap.offsetHeight+'px';
    }

    if(viewMode === 1) {
      writeBoxCode.style.display = '';
      writeBoxLine.style.display = 'none';
      writeBoxPreview.style.display = 'none';
      writeBoxCode.style.width = _winWith+'px';
      writeBoxCodeTextarea.style.width = _winWith+'px';
      writeBoxCodeTextarea.style.height = writeBoxWrap.offsetHeight+'px';
    }

    if(viewMode === 2) {
      writeBoxCode.style.display = 'none';
      writeBoxLine.style.display = 'none';
      writeBoxPreview.style.display = '';
      writeBoxPreview.style.width = _winWith+'px';
      writeBoxPreviewDiv.style.width = _winWith+'px';
      writeBoxPreviewDiv.style.height = writeBoxWrap.offsetHeight+'px';
    }

    //清除定时器
    if(resizeTimer){
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
  }
});

function publish(id, title, content, tag, categoryId) {
  $.ajax({
    url: '/api/article'+(parseInt(id) === 0 ? '' : '/'+id),
    type: 'post',
    data: { title: title, content: content, categoryId: categoryId, tag: tag },
    success: function(data){
      if(data.code == '200'){
        if (parseInt(id) != 0) {
          $('#publishModal').hide();
          alert('保存成功！');
        } else {
          alert('发布成功！');
          location.href = '/home/index';
        }
      }
    }
  });
}

//获取光标位置函数
function getCursortPosition (ctrl) {
  var CaretPos = 0;	// IE Support
  if (document.selection) {
    ctrl.focus ();
    var Sel = document.selection.createRange();
    Sel.moveStart ('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    CaretPos = ctrl.selectionStart;
  return (CaretPos);
}

//插入Markdown范例
function insertMarkdown(obj, text){
  pos = getCursortPosition(obj);
  s = obj.value;
  text = text ? text : "";
  var s1 = s.substring(0, pos);
  var s2 = s.substring(pos);
  s1 = s1 ? s1+'\n\n' : s1;
  s2 = s2 ? '\n\n'+s2 : s2;
  obj.value = s1+text+s2;
}
