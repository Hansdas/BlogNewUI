
layui.use(["form"], function () {
	var form = layui.form;
	var layer = layui.layer;
	form.on("submit(login)", function (data) {
		var loading = layer.load(2)
		var loginData = data.field;
		$.ajax({
			url: api + '/login',
			type: 'post',
			dataType: 'json',
			data: {
				"Account": loginData.Account,
				"Password": loginData.Password
			},
			success: function (response) {
				if (response.code == "200") {
					localStorage.setItem("loginToken", response.data);
					window.location.href = "../index.html";
			
				}
				else {
					layer.close(loading)
					layer.msg(response.msg, { icon: 5 });
				}
			},
		});
		return false;
	})
});
function loginOut() {
	$.ajax({
		url: api + '/login/out',
		type: 'get',
		dataType: 'json',
		headers: {
			loginToken: localStorage.getItem('loginToken')
		},
		success: function (response) {
			if (response.code == '200') {
				localStorage.removeItem('loginToken');
				window.location.href = "/login/login.html"
			}
		}
	});
};
function qqLogin() {
	var url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101895784&redirect_uri=http%3a%2f%2fwww.ttblog.site%2flogin%2fcallback.html&state=blog';
	top.location.href = url;
}