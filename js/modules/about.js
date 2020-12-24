layui.use(['element', 'form', 'layer', 'flow'], function () {
    element = layui.element,
        flow = layui.flow,
        layer = layui.layer;
    var op = getSearchString('op');
    if (op == 'leavemessage') {
        $("#leaveMessage").addClass('layui-show');
    }
    flow.load({
        elem: '#time-axis' //流加载容器。
        , end: '没有更多了'
        , isAuto: false
        , done: function (page, next) { //执行下一页的回调
            var lis = [];
            $.ajax({
                url: api + '/leavemessage/page/' + page,
                type: 'get',
                datatype: 'json',
                contentType: 'application/json;',
                success: function (res) {
                    layui.each(res.data.list, function (index, item) {
                        lis.push('<li class="layui-timeline-item">');
                        lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
                        lis.push('<div class="layui-timeline-content layui-text">');
                        lis.push('<h3 class="layui-timeline-title">' + item.createTime);
                        lis.push('</h3>')
                        lis.push('<div class="section">');
                        lis.push('<p>');
                        lis.push(item.content);
                        lis.push('</p>');
                        lis.push('</div>');
                        lis.push('</div>');
                        lis.push('</li>');
                    });
                    next(lis.join(''), (page * 3) < res.data.total);
                }

            });
        }
    });
    $('#leaveMessage').click(function () {
        var email = $('#email').val();
        if (email != '') {
            var reg = new RegExp(
                "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
            ); //邮箱正则表达式
            if (!reg.test(email)) {
                $('.error-span').html('邮箱不合规!')
                return;
            }
        }
        var content = $('#content').val();
        if (content == "") {
            $('.error-span').html('留言内容为空!')
            return;
        }
        var model = {
            Content: content,
            ContractEmail: email
        };
        $.ajax({
            url: api + '/leavemessage/add',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(model),
            success: function (res) {
                if (res.code == "200") {
                    layer.msg("留言成功", {
                        icon: 6
                    });
                } else {
                    layer.msg(res.message, {
                        icon: 6
                    });
                }
            }
        });
    })
});