var loading, laytpl, form;
layui.use(['flow', 'form', 'laytpl','laydate'], function () {
	var  flow = layui.flow,laydate = layui.laydate;;
	form = layui.form;
    var ins1=laydate.render({
		elem: '#calendar'
		,position: 'static'
		  ,btns: ['now']
		  ,calendar: true
	  });
	var id = getSearchString('id');
	var read = getSearchString('read');
	if(read==1){
		$.ajax({
			url: url + 'whisper/page',
			type: 'post',
			datatype: 'json',
			contentType:'application/json; charset=utf-8',
			data:condition,
		});		
	}
	flow.load({
		elem: '#time-axis' //流加载容器。
		,end:'没有更多了' 
		,isAuto:false
		, done: function (page, next) { //执行下一页的回调
			var lis = [];
			var condition;
			if(id==undefined){
				condition= JSON.stringify({
					'currentPage': page,
					'pageSize': 3,
				});
			} 
			else
			{
				condition= JSON.stringify({
					'currentPage': page,
					'pageSize': 3,
					'id':parseInt(id)
				});	
			} 
			$.ajax({
				url: api + '/whisper/page',
				type: 'post',
				datatype: 'json',
				contentType:'application/json; charset=utf-8',
				data:condition,
				success: function (res) {
					layui.each(res.data.list, function(index, item){				
						lis.push('<li class="layui-timeline-item">');
						lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
						lis.push('<div class="layui-timeline-content layui-text">');
						lis.push('<h3 class="layui-timeline-title">'+item.createDate);
						lis.push("<a href='javascript:;' onclick=\"review('"+item.id+"','"+item.account+"')\" style='margin-left:10px;color: #9b9b9b !important'>留言("+item.commentCount+")</a>");
						lis.push('</h3>')
						lis.push('<div class="section">');
						lis.push('<p>');
						lis.push(item.content);
						lis.push('</p>');
						lis.push('<div class="author">');
						lis.push('<a target="_blank" href="../user/user-home.html?account='+item.account+'"><i class="layui-icon layui-icon-username"></i>'+item.accountName+'</a>');
						lis.push('</div>');
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
function loadWhisper(pageIndex, pageSize, whisper) {
	$.ajax({
		url: url + 'whisper/page',
		type: 'post',
		datatype: 'json',
		contentType:'application/json; charset=utf-8',
		data: JSON.stringify({
			'pageIndex': page,
			'pageSize': 3,
		}),
		success: function (response) {
			if (response.code == "200") {
				var data = { "list": response.data };
				whisperview = document.getElementById("whisper-list-id");
				laytpl(whisper).render(data, function (html) {
					whisperview.innerHTML = html;
				});
			}
			else {
				layer.msg("响应服务器失败", { icon: 7 });
			}
		},
	});
}
function review(id,account){
    layer.open({
        title: '留言',
        type: 2,
        area: ['1000px', '500px'],
        content: '../whisper/review.html?id='+id+'&revicer='+account,
    });
}