var authorAccount; 
layui.config({
	base: '/style/js/'
}).use(['element', 'jquery', 'layer', 'laytpl', 'form', 'laypage'], function () {
	element = layui.element,
		$ = layui.$,
		laytpl = layui.laytpl,
		layer = layui.layer,
		laypage = layui.laypage;
	form = layui.form;
	var id = getSearchString('id');
	loadArticle(id);
	loadUpNext(id);
	var token=localStorage.getItem('loginToken'); 
    if (token==''||token==null) {
        $('#submitComment').attr('disabled',true);  
        $('#submitComment').text('未登录');
    }
});
/**
 * 加载文章内容
 * @param {} id 
 */
function loadArticle(id) {
	initLoading("detail", 10, 550);
	$.ajax({
		url: api + '/article/' + id,
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == '200') {
				var data = {
					'title': response.data.title,
					'createDate': response.data.createDate,
					'articleType': response.data.articleType,
					'content': response.data.content,
					'authorName': response.data.authorName,
					'authorAccount': response.data.authorAccount,
					"reviewCount": response.data.reviewCount,
					"readCount": response.data.readCount
				};
				authorAccount= response.data.authorAccount;
				revicer = response.data.authorAccount;
				$('title').html(data.title);
				//$('#authorName').html(response.data.author);
				var script = document.getElementById('detail-script').innerHTML;
				var articleHtml = document.getElementById('detail');
				laytpl(script).render(data, function (html) {
					articleHtml.innerHTML = html;
				});
				var commentScript = document.getElementById('comment-list-script').innerHTML;
				setCommentPageList(response.data.comments, commentScript);
			}
			else {
				layer.msg('响应服务器失败', { icon: 7 });
			}
		},

	});
}
function loadArticleList(){
	initLoading("detail", 10, 350);
	$.ajax({
		url: api + '/article/list/'+authorAccount,
		type: 'get',
		datatype: 'json',
		success:function(resp){

		}
	})
}
function loadComment(commentList, script) {
    var commentData = {
        'list': commentList
    }
   var commentsView = document.getElementById('comment-list');
    laytpl(script).render(commentData, function (html) {
        commentsView.innerHTML = html;
    });
};
function setCommentPageList(commentList, commentScript) {
    allCommentList = commentList;
    laypage.render({
        elem: 'page'
        , limit: 10
        , count: commentList.length
        ,first: false
        ,last: false
        , jump: function (obj) {
            var pageData = commentList.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
            loadComment(pageData, commentScript);
        }
    });
}
/**
 * 加载上一篇下一篇
 * @param {} id 
 */
function loadUpNext(id) {
	$.ajax({
		url: api + '/article/context/' + id,
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == '200') {
				$('#upNext').empty();
				if (response.data.beforeId > 0) {
					$('#upNext').append('<a href="detail.html?id=' + response.data.beforeId + '" target="_parent">上一篇：' + response.data.beforeTitle + '</a>')
					$('#upNext').append('</br>');
				}
				if (response.data.nextId > 0) {
					$('#upNext').append('<a href="detail.html?id=' + response.data.nextId + '" target="_parent">下一篇：' + response.data.nextTitle + '</a>')
				}
			}
			else {
				layer.msg('响应服务器失败', { icon: 7 });
			}
		},

	});
};
function openDv(index,toUser) {
	var token=localStorage.getItem('token'); 
    if (token==''||token==null) {
	   layer.msg('未登录', {
		   offset: ['280px', '540px'],
		   icon: 5
	   });
	   return;
   }
   $('#'+index+'_'+toUser).show();
}

function cancle(index,toUser) {
    $('#'+index+'_'+toUser).hide();
}
function reviewTo(toUser, commentId,index) {
    var content=$('#txt_'+index+'_'+toUser).val();
    if(content==''){
        layer.msg("内容为空", {
            icon: 5,
            offset: ['280px', '540px']
        });
        return false;
    }
	var id = getSearchString('id');
    var loading = layer.load(2,{ offset: ['280px', '600px']});
    $.ajax({
		url: api + '/article/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': content,
			'articleId': id,
			'revicer': toUser,
			'replyId': commentId,
			'commentType': 3
		},
		headers: {
			loginToken: localStorage.getItem('loginToken')
		},
		success: function (response) {
			layer.close(loading);
			if(response.code=="200"){
				layer.msg('留言审核中', {icon: 6});
			}
			else{
				layer.msg('提交失败', {icon: 7});
			}
		}
	})
}
function review() {
    var comment=$('#comment').val();
    if(comment==''){
        layer.msg("内容为空", {
            icon: 5,
        });
        return false;
    }
	var id = getSearchString('id');
    var loading = layer.load(2);
	$.ajax({
		url: api + '/article/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': $('#comment').val(),
			'articleId': id,
			'commentType': 1
		},
		headers: {
			loginToken: localStorage.getItem('loginToken')
		},
		success: function (response) {
			layer.close(loading);
			if(response.code=="200"){
				layer.msg('留言审核中', {icon: 6});
			}
			else{
				layer.msg('提交失败', {icon: 7});
			}
		}
	})
}