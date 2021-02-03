
layui.use(['element', 'jquery', 'laytpl', 'layer', 'layedit', 'flow', 'form', 'carousel'], function () {
	element = layui.element,
		$ = layui.$,
		laytpl = layui.laytpl,
		layer = layui.layer,
		layedit = layui.layedit,
		flow = layui.flow,
		carousel = layui.carousel
	form = layui.form;
	var whisperContent =layedit.build('whisperContent', {
		height: 50, //设置编辑器高度\
		tool: [, 'link' //超链接
			, 'face' //表情
		]
	});
	var deptObjs = document.getElementById("LAY_layedit_1").contentWindow.document.getElementsByTagName("body");
	deptObjs[0].style.fontSize = "12px";
	deptObjs[0].style.padding = "4px";
	deptObjs[0].style.background = "white";
	var connection = new signalR.HubConnectionBuilder().withUrl("http://111.229.211.248:5004/SingalrClient").build();
    connection.on('AllReviceMesage',function(reviceMessage){
        var data = {
            'list': reviceMessage.data
        };
        bindWhisper(data);
        $('.layui-flow-more').html('<a href="javascript:;" onclick="loadMore()"><cite>加载更多</cite></a>');
    } );
    connection.start();
	loadArticle();
	loadWhisper();
	loadFriendLink();
	$('.layui-btn').on('click', function () {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});
	var active = {
		addWhisper: function () {
			var text = layedit.getText(whisperContent);
			if (text == '') {
				layer.msg("内容为空", {
					icon: 5,
					offset: ['180px', '1120px']
				});
				return;
			}
			var loading = layer.load(2, { offset: ['160px', '1160px'] });
			$.ajax({
				url: api + '/whisper/add',
				type: 'post',
				datatype: 'json',
				data: {
					'content': layedit.getContent(whisperContent)
				},
				headers: {
					loginToken: localStorage.getItem('loginToken')
				},
				success: function (response) {
					if (response.code == '403') {
						layer.msg('你还未登录', {
							time: 1500,
							offset: ['160px', '1160px']
						}, function () {
							parent.location.href = "../login/login.html";
						});
					}
					layer.close(loading);
				}
			})
		}
	}
})
function loadArticle() {
	initLoading('article-list', 50, 382)
	$.ajax({
		url: api + '/article/group/readcount',
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == '200') {
				var data = {
					'list': response.data
				};
				var script = document.getElementById('article-list-script').innerHTML;
				var liHtml = document.getElementById('article-list');
				laytpl(script).render(data, function (html) {
					liHtml.innerHTML = html;
				})
			} else {
				layer.msg('响应服务器失败', {
					icon: 7
				});
			}

		},
	})
}
function loadWhisper() {
	initLoading('whisper-list', 10, 150)
	$.ajax({
		url: api + '/whisper/square',
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == '200') {
				var data = {
					'list': response.data
				};
				var script = document.getElementById('whisper-list-script').innerHTML;
				var liHtml = document.getElementById('whisper-list');
				laytpl(script).render(data, function (html) {
					liHtml.innerHTML = html;
				})
			} else {
				layer.msg('响应服务器失败', {
					icon: 7
				});
			}

		},
	})
}
function bindWhisper(data) {
    var script = document.getElementById('whisper-list-script').innerHTML;
    var listHtml = document.getElementById('whisper-list');
    laytpl(script).render(data, function (html) {
        listHtml.innerHTML = html;
    });
}
function loadFriendLink(){
	$.ajax({
		'url':api+'/leavemessage/friendlinks',
		'type':'get',
		'dataType':'json',
		success:function(resp){
			layer.close(loading);
			if (resp.code == "200") {
				for(var i=0;i<resp.data.length;i++){
					var friendLinkHtml="<dd>"+
					"<a href="+resp.data[i].link+">"+
			        "<img src="+resp.data[i].img+"><i>"+resp.data[i].webName+"</i>"+
					"</a>"+
					"</dd>"
					$('#friendlink').append(friendLinkHtml);
				}
			};
		}
	})
}
function applyFriendLinks(){
	layer.open({
		type: 2,
		title: '请填写表单',
		area: ['580px', '350px'],
		offset: '800px',
		content: '../leavemessage/friend-link.html',
		btn: ['确定'],
		btn1: function(index, layero){
			var loading = layer.load(2);
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
			var inputs=body.find('input');
			var email='';
			var siteName='';
			var siteUrl='';
			var siteImgUrl='';
			for(var i=0;i<inputs.length;i++){
				var input=inputs[i];
				if(input.id=='email'){
					email=input.value;
				}
				else if(input.id=='siteName')
				{
					siteName=input.value;
				}
				else if(input.id=='siteUrl'){
					siteUrl=input.value;
				}
				else if(input.id=='siteImgUrl'){
					siteImgUrl=input.value;
				}
			};
			$.ajax({
				'url':api+'/leavemessage/add/friendlink',
				'type':'post',
				'dataType':'json',
				'data':{
					'email':email,
					'siteName':siteName,
					'siteUrl':siteUrl,
					'siteImgUrl':siteImgUrl
				},
				success:function(resp){
					layer.close(loading);
					if (resp.code == "200") {
						layer.msg("申请成功", {
							icon: 6
						});
					};
					layer.close(index);
				}
			})
		  }
	  });  	
}


