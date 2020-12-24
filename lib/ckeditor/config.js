/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	config.toolbar = [
        ['Source'], ['Save', 'NewPage', 'Preview', 'Print'], ['Templates'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'], ['Undo', 'Redo'],
        ['Find', 'Replace'], ['SelectAll'], ['Scayt'],
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        //'/',
        ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'], ['CopyFormatting', 'RemoveFormat'],
        ['NumberedList', 'BulletedList'], ['Outdent', 'Indent'], ['Blockquote', 'CreateDiv'], ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'], ['BidiLtr', 'BidiRtl', 'Language'],
        ['Link', 'Unlink', 'Anchor'],
        ['Image'/*, 'Flash'*/, 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
        //'/',
        ['Styles', 'Format', 'Font', 'FontSize'], ['TextColor', 'BGColor'],
        ['Maximize', 'ShowBlocks'],
        ['About'],
        //添加插件按钮
        ['CodeSnippet', 'Markdown', 'uploadfile', 'diagram'/*, 'Diagramwidget'*/]
    ];
	config.removeButtons = 'Save,NewPage,Templates,Scayt,Language,Smiley,Styles,Format,About';
	config.extraPlugins = "codesnippet";
  

    //设置文件、图片、Flash上传处理地址
    //config.filebrowserBrowseUrl = "";     启用浏览服务器
    
    config.filebrowserImageBrowseUrl ="https://www.ttblog.site/api/upload/image"; 
    config.filebrowserImageUploadUrl ="https://www.ttblog.site/api/upload/image"; 
    config.language = 'zh-cn';

    /*去掉图片预览框的文字*/
	config.image_previewText = ' ';
	//移除图片上传页面的'高级','链接'页签
	config.removeDialogTabs = 'image:advanced;image:Link';
    //设置字体，需将config.js另存为utf-8编码格式，否则字体名乱码
    config.font_names = '宋体/宋体, 新宋体;仿宋/仿宋_GB2312, 仿宋;黑体;楷体/楷体_GB2312, 楷体;隶书;微软雅黑;幼圆';

    //设置回车格式
    config.enterMode = CKEDITOR.ENTER_BR;

    //禁用ACF
    config.allowedContent = true;

    //插入/编辑超链接时target默认设置为_blank
    CKEDITOR.on('dialogDefinition', function (ev) {
        var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;
        if (dialogName == 'link') {
            var targetTab = dialogDefinition.getContents('target');
            var targetField = targetTab.get('linkTargetType');
            targetField['default'] = '_blank';
        }
    });
};
