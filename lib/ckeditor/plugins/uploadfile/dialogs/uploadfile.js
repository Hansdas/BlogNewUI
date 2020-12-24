CKEDITOR.dialog.add("uploadfileDialog",
    function (a) {
        //var v = editor.lang.uploadfile;
        return {
            title: '上传文件',
            minWidth: 390,
            minHeight: 150,
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
                            html: "<form action='" + a.config.uploadfileUploadUrl + "' method='post' enctype='multipart/form-data' target='myiframe'><div id='filecontainer'><input type='file' name='uploadfile' id='uploadfile' style='width: 100%' /></div><input type='submit' name='submit' id='submit' value='上传' style='padding: 3px 12px; margin-top: 3px; border: 1px solid #b6b6b6; border-bottom-color: #999; -moz-border-radius: 3px; -webkit-border-radius: 3px; border-radius: 3px; -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, .5), 0 0 2px rgba(255, 255, 255, .15) inset, 0 1px 0 rgba(255, 255, 255, .15) inset; -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, .5), 0 0 2px rgba(255, 255, 255, .15) inset, 0 1px 0 rgba(255, 255, 255, .15) inset; box-shadow: 0px 1px 0px rgba(255,255,255,0.5), inset 0px 0px 2px rgba(255,255,255,0.15), inset 0px 1px 0px rgba(255,255,255,0.15); background: #e4e4e4; background-image: -webkit-gradient(linear,left top,left bottom,from(#fff),to(#e4e4e4)); background-image: -moz-linear-gradient(top,#fff,#e4e4e4); background-image: -webkit-linear-gradient(top,#fff,#e4e4e4); background-image: -o-linear-gradient(top,#fff,#e4e4e4); background-image: -ms-linear-gradient(top,#fff,#e4e4e4); background-image: linear-gradient(top,#fff,#e4e4e4); filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='#ffffff',endColorstr='#e4e4e4');' /></form><iframe name='myiframe' id='myiframe' width='100' height='100' frameborder='0' scrolling='yes' marginheight='0' marginwidth='0'></iframe>"
                        }
                    ]
                }
            ],
            buttons: [CKEDITOR.dialog.cancelButton]
        };
    });