layui.use(['element', 'laytpl', 'layer', 'flow', 'form', 'laypage'], function () {
	element = layui.element,
		$ = layui.$,
		laytpl = layui.laytpl,
		layer = layui.layer,
		laypage = layui.laypage,
		form = layui.form;
	articletype = 0;
	element.on('tab(tab-article)', function () {
		articletype = parseInt(this.getAttribute('lay-id'));
		loadarticle(1, 10, true);
	});
	loadarticle(1, 10, true);
	loadReadTop();
	$('#btnSearch').on('click', function (e) {
		loadarticle(1, 10, true);
	});
})
function loadarticle(pageIndex, pageSize, initPage) {
	initLoading('article-list', 10, 350);
	var conditionModel = {
		'currentPage': pageIndex,
		'pageSize': pageSize,
		'articleType': articletype,
		'fullText': $('#fullText').val()
	};
	$.ajax({
		url: api + '/article/page',
		type: 'post',
		datatype: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(conditionModel),
		async:true,
		success: function (response) {
			if (response.code == '200') {
				var data = {
					'list': response.data.list
				};
				var script = document.getElementById('article-list-script').innerHTML;
				var liHtml = document.getElementById('article-list');
				laytpl(script).render(data, function (html) {
					liHtml.innerHTML = html;
				});
				if (initPage) {
					laypage.render({
						elem: 'page'
						, limit: 10
						, count: response.data.total
						, first: '首页'
						, last: '尾页'
						, jump: function (obj, first) {
							if (!first) {
								var pageSize = obj.limit;
								var pageIndex = obj.curr;
								loadarticle(pageIndex, pageSize, false);
							}
						},
					});
				}
			}
			else {
				layer.msg('响应服务器失败', {
					icon: 7
				});
			}
			$('#toTop').focus();
		}
	})
}

function loadReadTop() {
	initLoading("hot-list", 50, 80);
	$.ajax({
		url: api + '/article/top/read',
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == '200') {
				var data = {
					'list': response.data
				};
				var hotScript = document.getElementById('hot-list-script').innerHTML;
				var liHtmlDom = document.getElementById('hot-list');
				laytpl(hotScript).render(data, function (html) {
					liHtmlDom.innerHTML = html;
				})
			}
			else {
				layer.msg('响应服务器失败', {
					icon: 7
				});
			}
		}
	})
}



