CKEDITOR.dialog.add("diagramDialog",
    function (a) {
        return {
            title: '编辑图',
            minWidth: 900,
            minHeight: 600,
            contents: [
                {
                    id: "tab1",
                    label: "",
                    title: "",
                    expand: !0,
                    padding: 0,
                    elements: [
                        {
                            type: "html",
                            html: "<iframe name='diagramIframe' id='diagramIframe' style='width:100%; height:580px;' frameborder='0' scrolling='yes'></iframe>"
                        }
                    ]
                }
            ],
            //onLoad只在第一次打开时执行，再打开dialog时不执行
            //onLoad: function () {
            //},
            onShow: function () {
                //获取编辑的图id
                var editor = this._.editor;
                var startElement = editor.getSelection().getStartElement();
                //var startElementHtml = startElement.getOuterHtml();
                //$.print(startElement);
                var diagramid = startElement.getAttribute("diagramid");
                //alert(diagramid);

                //var iframe = document.getElementById(this._.frameId);
                var iframe = document.getElementById('diagramIframe');
                //var iframeWindow = iframe.contentDocument || iframe.contentWindow.document;
                var src = editor.config.diagramEditUrl
                if (diagramid != null)
                    src += "&id=" + diagramid;
                //iframe.setAttribute("src", "about:blank");
                iframe.setAttribute("src", src);

                //每次打开时刷新页面，否则会显示上次绘图元素
                //iframe.document.location.href = src;
                //iframeWindow.location.href = src;
                //iframe.contentWindow.location.reload();
            },
            onOk: function () {
                //判断图名称不能为空
                var name = diagramIframe.window.document.getElementById("tbName").value;
                if (name == '') {
                    alert("请输入图名称。");
                    return false;
                }
                //调用图编辑页面的save按钮事件
                diagramIframe.window.document.getElementById("save").click();

                var diagramid = diagramIframe.window.document.getElementById("hfId").value;
                //this._.editor.insertHtml("<iframe class='diagram' diagramid='" + diagramid + "' style='width:100%;height:705px;' frameborder='0' scrolling='yes' src='/pages/epoch-web-diagram/diagram-detail.aspx?id=" + diagramid + "'></iframe>");

                //图实际高度
                var height = diagramIframe.window.getHeight() + 52;
                if (height < 302)
                    height = 302;
                console.log(height);

                var dialog = this;
                var editor = this._.editor;
                var data = {};
                this.commitContent(data);

                var iframe = editor.document.createElement('iframe');
                iframe.setAttribute('class', 'diagram');
                iframe.setAttribute('diagramid', diagramid);
                //iframe.setAttribute('style', 'width: 100%; height: 705px;');
                iframe.setAttribute('style', 'width: 100%; height: ' + height + 'px;');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('scrolling', 'yes');
                iframe.setAttribute('src', '/pages/epoch-web-diagram/diagram-detail.aspx?id=' + diagramid);

                //var widget = editor.document.createElement('widget');
                //widget.setAttribute('id', diagramid);

                //插入替代显示代码
                var diagramFakeImage = editor.createFakeElement(iframe, 'cke_diagram', 'iframe', true);
                diagramFakeImage.setAttribute('diagramid', diagramid);
                diagramFakeImage.setAttribute("title", "Diagram");
                diagramFakeImage.setAttribute("alt", "Diagram");
                //$(diagramFakeImage).attr('diagramid', diagramid);

                editor.insertElement(diagramFakeImage);
            }
        };
    });