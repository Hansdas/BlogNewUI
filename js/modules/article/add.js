var loading, form,layedit,textcontent;
layui.use(['form', 'layer'], function () {
    var  $ = layui.jquery, layer = layui.layer;
    var filePaths = [];
    editor= CKEDITOR.replace('ckEditor', { height: '400px'});
    form = layui.form;
    var id = getSearchString('id');
    bindselect();
    if (id == undefined) {
        id=0;
        checklogin();
    }
    else {
        bindArticle(id);
    }

    form.verify({
        articletype: function (value) {
            if (value == '...') {
                return '请选择专栏';
            }
        },
        content:function () {
            var content=editor.document.getBody().getText();
            if (content=="") {
                return '请填写正文内容';
            }
        }
    });
    var active = {
        content: function () {
            layer.open({
                type: 0,
                title: false, //不显示标题栏                   
                offset: 'auto',
                closeBtn: false,
                area: ['1200px', '700px'],
                shade: 0.8,
                id: 'LAY_layuipro', //设定一个id，防止重复弹出
                btn: ['确定'],
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: editor.document.getBody().getHtml()
            });
        },
        save: function () {
            form.on('submit(save)', function (data) {
                var articleData = data.field;
                var content = editor.document.getBody().getHtml();
                var textsection = editor.document.getBody().getText();
                if (textsection.length > 170)
                    textsection = textsection.substring(-1, 170);
                loading = layer.load(2);
                var model={
                    'Id':parseInt(id),
                    'ArticleType': articleData.type,
                    'Title': articleData.title,
                    'Content': content,
                    'TextSection': textsection+'...',
                    'IsDraft': 'true',
                    'FilePaths':filePaths
                };
                $.ajax({
                    url:url+ 'article/add',
                    contentType:'application/json; charset=utf-8',
                    type:'post',
                    datatype:'json',
                    data: JSON.stringify(model),
                    success:function(response)
                    {
                        if (response.code == 200) {
                            layer.close(loading);
                            layer.msg("保存成功", { icon: 6 });
                    
                        }
                        else if(response.code==403) {
                            layer.close(loading);
                            layer.msg("未登录", {
                                icon: 5
                            });
                        }
                         else {
                            layer.close(loading);
                            layer.msg("保存失败", {
                                icon: 5
                            });
                        }
                    }                  
                });
                return false;
            })
        },
        publish: function () {
            form.on('submit(publish)', function (data) {
                var articleData = data.field;
                var content = editor.document.getBody().getHtml();
                var textsection = editor.document.getBody().getText();
                if (textsection.length > 170)
                    textsection = textsection.substring(-1, 170);
                loading = layer.load(2);
                var model={
                    'Id':parseInt(id),
                    'ArticleType': articleData.type,
                    'Title': articleData.title,
                    'Content': content,
                    'TextSection': textsection+'...',
                    'IsDraft': 'false',
                    'FilePaths':filePaths
                };
                $.ajax({
                    url:url+ 'article/add',
                    contentType:'application/json; charset=utf-8',
                    type:'post',
                    datatype:'json',
                    data: JSON.stringify(model),
                    success:function(response)
                    {
                        if (response.code ==200) {
                            layer.close(loading);
                            layer.msg("保存成功", { icon: 6 });
                    
                        } 
                         else if(response.code==403) {
                            layer.close(loading);
                            layer.msg("未登录", {
                                icon: 5
                            });
                        }
                         else {
                            layer.close(loading);
                            layer.msg("保存失败", {
                                icon: 5
                            });
                        }
                    }                    
                });
                return false;
            })
        }
    };

    $('.layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
});
function checklogin() {
    var token=localStorage.getItem('token'); 
    if (token ==null) {
            layer.msg('你还未登录', {
                time: 1500,
            }, function () {
                window.location.href = '../login/login.html'
            });
    }
};
function bindArticle(id){
    loading = layer.load(2,{offset: 'auto'});
    $.ajax({
        url:url+ 'article/' + id,
        type:'get',
        datatype:'json',
        success:function(response)
        {
            if (response.code ==200) {
                form.val("articleInfo", {
                    "type": response.data.articleType,
                    "title": response.data.title,
                    "content": response.data.content
                });
                editor.setData(response.data.content);
                //layedit.setContent(textcontent, response.data.content);
                layer.close(loading);
            }
        },                   
    }); 
}
function bindselect() {
    $.ajax({
        url:url+ 'article/types',
        type:'get',
        datatype:'json',
        success:function(response)
        {
            if (response.code == 200) {
                $('#selecttype').empty();
                $('#selecttype').append('<option>...</option>');
                for(var i=0;i<response.data.length;i++){
                    $('#selecttype').append('<option value=' + response.data[i].key + '>' + response.data[i].value+ '</option>');
                }
                layui.form.render("select");
            }
        },                   
    });
};