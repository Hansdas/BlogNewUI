layui.use(['element', 'laytpl', 'layer', 'flow', 'form', 'laypage'], function () {
    element = layui.element,
        $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form,
        dragMove = layui.dragMove;
    laypage.render({
        elem: 'page'
        , count: 50 //数据总数
    });
    loadarticle(1, 10, true);
    openImg();


});
function loadarticle(pageIndex, pageSize, initPage) {
    var conditionModel = {
        'currentPage': pageIndex,
        'pageSize': pageSize,
    };
    $.ajax({
        url: api + '/gallery/list/page',
        type: 'post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(conditionModel),
        async: true,
        success: function (response) {
            if (response.code == "200") {
				for(var i=0;i<response.data.length;i++){
					var galleryHtml='<dd>'+
                    '<div class="imgdiv" style="height: 196px;">'+
                    '<img src="'+response.data[i].url+'">'+
                    '</div>'+
                    '</dd>'
					$('.amplifyImg').append(galleryHtml);
				}
			};
        }
    })
}
function openImg() {
    var imgsObj = $('.amplifyImg img');//需要放大的图像
    if (imgsObj) {
        $.each(imgsObj, function () {
            $(this).click(function () {
                var currImg = $(this);
                coverLayer(1);
                var tempContainer = $('<div class=tempContainer></div>');//图片容器
                with (tempContainer) {//width方法等同于$(this)
                    appendTo("body");
                    var windowWidth = $(window).width();
                    var windowHeight = $(window).height();
                    //获取图片原始宽度、高度
                    var orignImg = new Image();
                    orignImg.src = currImg.attr("src");
                    var currImgWidth = orignImg.width;
                    var currImgHeight = orignImg.height;
                    if (currImgWidth < windowWidth) {//为了让图片不失真，当图片宽度较小的时候，保留原图
                        if (currImgHeight < windowHeight) {
                            var topHeight = (windowHeight - currImgHeight) / 2;
                            if (topHeight > 35) {/*此处为了使图片高度上居中显示在整个手机屏幕中：因为在android,ios的微信中会有一个title导航，35为title导航的高度*/
                                topHeight = topHeight - 35;
                                css('top', 20);
                            } else {
                                css('top', 0);
                            }
                            html('<img border=0 src=' + currImg.attr('src') + ' style="height:300px;width:300px">');
                        } else {
                            css('top', 0);
                            html('<img border=0 src=' + currImg.attr('src') + ' height=' + windowHeight + '>');
                        }
                    } else {
                        var currImgChangeHeight = (currImgHeight * windowWidth) / currImgWidth;
                        if (currImgChangeHeight < windowHeight) {
                            var topHeight = (windowHeight - currImgChangeHeight) / 2;
                            if (topHeight > 35) {
                                topHeight = topHeight - 35;
                                css('top', topHeight);
                            } else {
                                css('top', 0);
                            }
                            html('<img border=0 src=' + currImg.attr('src') + ' width=' + windowWidth + ';>');
                        } else {
                            css('top', 0);
                            html('<img border=0 src=' + currImg.attr('src') + ' width=' + windowWidth + '; height=' + windowHeight + '>');
                        }
                    }
                }
                tempContainer.click(function () {
                    $(this).remove();
                    coverLayer(0);
                });
            });
        });
    }
    else {
        return false;
    }
    //使用禁用蒙层效果
    function coverLayer(tag) {
        with ($('.over')) {
            if (tag == 1) {
                css('height', $(document).height());
                css('display', 'block');
                css('opacity', 1);
                css("background-color", "#FFFFFF");
                css("background-color", "rgba(0,0,0,0.7)");  //蒙层透明度
            }
            else {
                css('display', 'none');
            }
        }
    }
}