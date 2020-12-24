
$(function () {
    var tab = getSearchString('tab');
    setTab(tab);
});
var form, loading
function setTab(cursor) {
    for (var i = 1; i < 5; i++) {
        var nav = document.getElementById("nav_" + i);
        var con = document.getElementById("tab_" + i);
        if (i == cursor) {
            con.style.display = "block";
            nav.className = 'layui-nav-item layui-this'
        }
        else {
            con.style.display = "none";
            nav.className = 'layui-nav-item'
        }
    }
    if (cursor == 1) {
        layui.use(['form', 'element', 'laydate', 'upload','layer'], function () {
            var laydate = layui.laydate, upload = layui.upload, table = layui.table,layer=layui.layer;
            loading = layer.load(2);
            form = layui.form,
                laydate.render({
                    elem: '#birthdate'
                });
            $.ajax({
                url: api + '/user/token',
                type: 'get',
                datatype: 'json',
                headers: {
                    loginToken: localStorage.getItem('loginToken')
                },
                success: function (response) {
                    if (response.code == "200") {
                        layer.close(loading);
                        form.val("userinfo", {
                            "account": response.data.account,
                            "username": response.data.username,
                            "sex": response.data.sex,
                            "birthdate": response.data.birthDate,
                            "phone": response.data.phone,
                            "email": response.data.email,
                            "sign": response.data.sign
                        });
                        $("#touxiang").attr("src", response.data.headPhoto);
                    }
                }
            });
            form.verify({
                phone: function (value) {
                    if (value.length > 0) {
                        if (!(/^1\d{10}$/.test(value))) {
                            return "请输入正确的手机号";
                        }
                    }
                },
                email: function (value) {
                    if (value.length > 0) {
                        if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
                            return "请输入正确的邮箱";
                        }
                    }
                },
                confirmpassword: function (value) {
                    if (value != $("#newpassword").val()) {
                        return "两次输入的密码不一致";
                    }
                }
            });
            form.on('submit(editUser)', function (data) {
                loading = layer.load(2);
                var userData = data.field;
                var userModel={
                    'account': userData.account,
                    'username': userData.username,
                    'sex': userData.sex,
                    'birthdate': userData.birthdate,
                    'phone': userData.phone,
                    'email': userData.email,
                    'sign': userData.sign
                }
                $.ajax({
                    url:api+'user',
                    type:'post',
                    contentType:'application/json; charset=utf-8',
                    datatype:'json',
                    data: JSON.stringify(userModel),
                    success:function(response)
                    {
                        if (response.code=='200') {
                            localStorage.setItem("token",response.data );
                            layer.close(loading);
                            layer.msg("修改成功", { icon: 6 }); 
                        }
                        else
                        {
                            layer.close(loading);
                            layer.msg(response.message, { icon: 5 });
                        }
                    }

                });
                return false;
            });
            form.on('submit(editPassword)', function (data) {
                loading = layer.load(2)
                var response = requestajax({
                    route: 'user/update/password',
                    type: 'post',
                    data: {
                        'password': $("#newpassword").val(),
                        'oldpassword': $("#oldpassword").val()
                    },
                    datatype: 'json',
                    async: true,
                    func: completeResponse
                });
                return false;
            });
            upload.render({
                elem: '#upload'
                , headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                , data: {
                    width: 168,
                    height: 168,
                    isAbs: true
                }
                , url: api + 'user/update/photo' //上传接口
                , before: function () {
                    loading = layer.load(2);
                }
                , done: function (res) {
                    localStorage.setItem("token", res.data.token);
                    $("#touxiang").attr("src", res.data.path);
                    $("#photo").attr('src', res.data.path);
                    location.reload();
                }
            });
        })
    }
    else if(cursor==2){
        loadUser();
    }
    else if (cursor == 3) {
        layui.use(['table','element'], function () {
            table = layui.table,element = layui.element;
            loadArticle();
            element.on('tab(tab_3)', function(data){
                if(data.index==0){
                    loadArticle();
                }
                else{
                    loadWhisper();
                }
              });

        });
    }
    else if (cursor == 4) {
        layui.use(['laypage', 'element', 'jquery', 'laytpl', 'layer'], function () {
            var laypage = layui.laypage, laytpl = layui.laytpl, layer = layui.layer, element = layui.element;;
            loading = layer.load(2);
            var scriptHtml = document.getElementById('buildScript').innerHTML;
            laypage.render({
                elem: 'page'
                , limit: 5
                , jump: function (obj) {
                    var loading = layer.load(2);
                    var pageSize = obj.limit;
                    var pageIndex = obj.curr;
                    $.ajax({
                        url: api + 'user/tidings',
                        type: 'get',
                        datatype: 'json',
                        data: {
                            'pageIndex': pageIndex,
                            'pageSize': pageSize,
                        },
                        success: function (response) {
                            if (response.code == '200') {
                                var data = {
                                    'list': response.data
                                };
                                var itemHtml = document.getElementById('tidings-item');
                                laytpl(scriptHtml).render(data, function (html) {
                                    itemHtml.innerHTML = html;
                                })
                            }
                            else {
                                layer.msg('响应服务器失败', {
                                    icon: 7
                                });
                            }
                            layer.close(loading);

                        },
                    })
                },
            });
        });
    }
}
function selectArticle() {
    $.ajax({
        url: url + 'user/getTidings',
        type: 'post',
        datatype: 'json',
        data: {
            'titleContain': $('#title-search').val(),
            'isDraft': $('#isdraft-search').val(),
        },
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var itemHtml = document.getElementById('tidings-item');
                laytpl(scriptHtml).render(data, function (html) {
                    itemHtml.innerHTML = html;
                })
            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            layer.close(loading);

        },
    })
}
function loadUser(){
    layui.use(['flow','laytpl'],function(){
        var  flow = layui.flow,laytpl = layui.laytpl;
        initLoading("user-info",0,310);
        initLoading("article-file", 0,310);
        $.ajax({
            url:api+'/user/token',
            type:'get',
            datatype:'json',
            headers: {
                loginToken: localStorage.getItem('loginToken')
            },
            success:function(res){
                $("#user-headphoto").attr('src', res.data.headPhoto);
                var script = document.getElementById('user-info-script').innerHTML;
                var userInfoHtml = document.getElementById('user-info');
                laytpl(script).render(res.data, function (html) {
                    userInfoHtml.innerHTML = html;
                });
            }
        });
        $.ajax({
            url:api+'/article/user/archive',
            type:'get',
            datatype:'json',
            headers: {
                loginToken: localStorage.getItem('loginToken')
            },
            success:function(res){
                var data = {
                    'list': res.data
                };
                var script = document.getElementById('article-file-script').innerHTML;
                var fileHtml = document.getElementById('article-file');
                laytpl(script).render(data, function (html) {
                    fileHtml.innerHTML = html;
                });
            }
        });
        flow.load({
            elem: '#time-axis' 
            ,end:'没有更多了' 
            ,isAuto:false
            , done: function (page, next) { 
                var lis = [];
                $.ajax({
                    url: api + '/whisper/page',
                    type: 'post',
                    datatype: 'json',
                    contentType:'application/json; charset=utf-8',
                    data: JSON.stringify({
                        'currentPage': page,
                        'pageSize': 3,
                        'LoginUser':true
                    }),
                    headers: {
                        loginToken: localStorage.getItem('loginToken')
                    },
                    success: function (res) {
                        layui.each(res.data.list, function(index, item){
                            lis.push('<li class="layui-timeline-item">');
                            lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
                            lis.push('<div class="layui-timeline-content layui-text">');
                            lis.push('<h3 class="layui-timeline-title">'+item.createDate+'</h3>');
                            lis.push('<div class="section">');
                            lis.push('<p>');
                            lis.push(item.content);
                            lis.push('</p>');
                            lis.push('</div>');
                            lis.push('</div>');
                            lis.push('</li>');
                          });
                        next(lis.join(''), (page*3) < res.data.total);
                    }
    
                });
            }
        });
    })
}
function loadArticle(){
    table.render({
        id: 'aTable'
        , method:'post'
        , elem: '#articleTable'
        , url: api + "/article/page"
        , where:{
                'loginUser':true
            }
        ,contentType: 'application/json; charset=utf-8'
        , toolbar: false
        , width: 870
        , title: ''
        , loading: true
        , headers: {  loginToken: localStorage.getItem('loginToken') }
        , limit: 10
        , cols: [[
            { type: 'checkbox' }
            , { field: 'id', title: 'ID', hide: true, unresize: true }
            , { field: 'title', title: '标题' }
            , { field: 'articleType', title: '专栏', align: 'center', width: 100 }
            , { field: 'authorName', title: '作者' }
            , { field: 'createDate', title: '提交日期', sort: true }
            , { align: 'center', toolbar: '#bar1', title: '操作' }
        ]]
        , page: true
        , parseData: function (res) {
            return {
                "code": res.code,
                "msg": res.message,
                "total": res.data.total,
                "data": res.data.list
            };
        }
        ,response: {
            statusName: 'code' //规定数据状态的字段名称，默认：code
            ,statusCode: 200 //规定成功的状态码，默认：0
            ,msgName: 'msg' //规定状态信息的字段名称，默认：msg
            ,countName: 'total' //规定数据总数的字段名称，默认：count
            ,dataName: 'data' //规定数据列表的字段名称，默认：data
          } 
    });

    //监听行工具事件
    table.on('tool(article)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                loading = layer.load(2);
                layer.close(index);
                $.ajax({
                    url: url + 'article/' + data.id,
                    type: 'delete',
                    datatype: 'json',
                    success: function () {
                        table.reload('aTable', {
                            page: {
                                curr: 1
                            }
                        });
                        layer.close(loading);
                    },
                })
            });
        } else if (obj.event === 'edit') {
            window.open('../article/add.html?id=' + data.id,"_blank")
        }
        else {
            window.open('../article/detail.html?id=' + data.id)
        }
    });
    var $ = layui.$, active = {
        reload: function () {
            table.reload('aTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,method:'post'
                ,contentType: 'application/json; charset=utf-8'
                , where: {
                    titleContain: $('#title').val(),
                    isDraft:$('#isdraft').val()
                }
            });
        }
    };
    $('#table-search .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
}
function loadWhisper(){
    table.render({
        id: 'aWhisper'
        , method:'post'
        , elem: '#whisperTable'
        , url: url + "whisper/page"
        , where:{
                'loginUser':true
            }
        ,contentType: 'application/json; charset=utf-8'
        , toolbar: false
        , width: 870
        , title: '我的微语'
        , loading: true
        , headers: { 'Authorization': localStorage.getItem('token') }
        , limit: 10
        , cols: [[
            { type: 'checkbox' }
            , { field: 'id', title: 'ID', hide: true, unresize: true }
            , { field: 'content', title: '标题' }
            , { field: 'accountName', title: '作者' }
            , { field: 'createDate', title: '提交日期', sort: true }
            , { align: 'center', toolbar: '#bar2', title: '操作' }
        ]]
        , page: true
        , parseData: function (res) {
            return {
                "code": res.code,
                "msg": res.message,
                "count": res.total,
                "data": res.data
            };
        }
    });

    //监听行工具事件
    table.on('tool(whisper)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                loading = layer.load(2);
                layer.close(index);
                $.ajax({
                    url: url + 'whisper/' + data.id,
                    type: 'delete',
                    datatype: 'json',
                    success:function(){
                        table.reload('aWhisper', {
                            page: {
                                curr: 1
                            }
                            ,method:'post'
                            ,contentType: 'application/json; charset=utf-8'    
                        });
                        layer.close(loading);
                    }
                })
            });
        }
    });
}
function doneTidings(id){
    $.ajax({
        url: url + 'tidings/'+id,
        type: 'post',
        datatype: 'json',
    });  
}