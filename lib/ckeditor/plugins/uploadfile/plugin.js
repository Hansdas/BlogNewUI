CKEDITOR.plugins.add('uploadfile',
    {
        icons: "uploadfile",
        init: function (editor) {
            editor.addCommand('uploadfileDialog', new CKEDITOR.dialogCommand('uploadfileDialog'));
            editor.ui.addButton('uploadfile',
                {
                    label: '上传文件',
                    command: 'uploadfileDialog',
                    toolbar: 'insert',
                    icon: CKEDITOR.plugins.getPath('uploadfile') + 'icons/uploadfile.png'
                });

            CKEDITOR.dialog.add('uploadfileDialog', this.path + 'dialogs/uploadfile.js');
        }
    });
