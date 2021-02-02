
/**
 * 获取url参数
 * @param  key 
 */
function getSearchString(key) {
	var urlParamater = window.location.search;
	urlParamater = urlParamater.substring(1, urlParamater.length); // 获取URL中?之后的字符（去掉第一位的问号）
	// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	var arr = urlParamater.split("&");
	var obj = new Object();

	// 将每一个数组元素以=分隔并赋给obj对象 
	for (var i = 0; i < arr.length; i++) {
		var tmp_arr = arr[i].split("=");
		obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	}
	return obj[key];
}
/**
 * 获取resultful格式参数
 * @param  key 
 */
function getSearchStringResultFul(key) {
	var url = window.location.href;
	var index = url.lastIndexOf('/')
	return url.substring(index + 1);
}
/**
* iframe自适应高度
*/
function setIframeHeight(iframeId) {
	$('#' + iframeId).each(function (index) {
		var that = $(this);
		(function () {
			setInterval(function () {
				//setIframeHeight(that[0]);
				if (that[0]) {
					var iframeWin = that[0].contentWindow || that[0].contentDocument.parentWindow;
					if (iframeWin.document.body) {
						that[0].height = iframeWin.document.body.scrollHeight;
					}
				}
			}, 300);
		})(that);
	});
};
/**
 * 加载loading
 */
function initLoading(htmlId, top, left) {
	var loading = '<div class="loader" style="margin-top:' + top + 'px;margin-left: ' + left + 'px;"></div>';
	$('#' + htmlId).append(loading)
}
/**
 * 关闭loading
 */
function closeLoading(htmlId) {
	$('#' + htmlId + ' .loader').hide()
}
/**
 * 字符串转日期
 */
function stringToDate(str){
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("/");
    var year = parseInt(dateStrs[0]);
    var month = parseInt(dateStrs[1])-1;
    var day = parseInt(dateStrs[2]);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs [0]);
    var minute = parseInt(timeStrs[1]);
    var second = parseInt(timeStrs[2]);
    var date = new Date(year, month, day, hour, minute, second);
    return date;
}
/**
* 全局ajax处理
*/
layui.use('layer', function () {
	var layer = layui.layer;
	$.ajaxSetup({
		cache: false,
		beforeSend: function (xhr) {
			var token = localStorage.getItem('token');//token
			var tokenExpireTime = localStorage.getItem('tokenExpireTime');//过期时间
			var tokenSaveTime = localStorage.getItem('tokenSaveTime');//token保存时间
			var requestToken = false;//是否需要获取token
			if (token == undefined || tokenExpireTime == undefined || tokenSaveTime == null) {
				requestToken = true;
			}
			if (!requestToken) {//不需要时判断token是否过期
				if (tokenExpireTime == undefined) {
					requestToken = true;
				}
				else {
					var now = new Date();
					tokenSaveTime = stringToDate(tokenSaveTime);
					var i=tokenSaveTime.getMinutes();
					var minutes=tokenSaveTime.getMinutes()+parseInt(tokenExpireTime);
					tokenSaveTime.setMinutes(minutes);
					if(tokenSaveTime<now)
					{
						requestToken = true;
					}
					// var s=now.getTime()-tokenSaveTime.getTime();
					// //计算出相差天数
					// var days=Math.floor(s/(24*3600*1000))
					// //计算出小时数
					// var leave1=s%(24*3600*1000)    //计算天数后剩余的毫秒数
					// var hours=Math.floor(leave1/(3600*1000))
					// //计算相差分钟数
					// var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
					// var minutes=Math.floor(leave2/(60*1000))
					// //计算相差秒数
					// //var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
					// //var seconds=Math.round(leave3/1000)
					// if(days>0)
					// {
					// 	requestToken = true
					// }
					// else if(hours>0){
					// 	requestToken = true
					// }
					// else if(minutes>tokenExpireTime){
					// 	requestToken = true
					// }
				}
			}
			if (requestToken) {
				$.ajax({
					url: 'http://localhost/auth/credentials/token',
					type: 'get',
					datatype: 'json',
					async:false,
					beforeSend: function () {
						var i=1;//防止调用token时会通过ajaxStup再次执行beforeSend
					},
					success: function (res) {
						if (res.code == 200) {
							token=res.data.token;
							localStorage.setItem('token', res.data.token);
							localStorage.setItem('tokenExpireTime', res.data.expireMinutes);
							localStorage.setItem('tokenSaveTime', res.data.createTime);
						}
					},
					complete: function () {
						var i=1;
					}
				})
			}
			xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
		},
		error: function (request) {
			layer.msg('响应服务器失败', {
				icon: 7
			});
		},
	});
})