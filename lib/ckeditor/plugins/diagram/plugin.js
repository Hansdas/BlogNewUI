CKEDITOR.plugins.add('diagram',
    {
        icons: "diagram",
        onLoad: function () {
            //替代显示样式
            CKEDITOR.addCss(
                'img.cke_diagram' +
                '{' +
                'background-image: url(' + CKEDITOR.getUrl(this.path + 'images/placeholder.png') + ');' +
                'background-position: center center;' +
                'background-repeat: no-repeat;' +
                'border: 1px solid #A9A9A9;' +
                'width: 80px;' +
                'height: 80px;' +
                '}'
            );
        },
        init: function (editor) {
            editor.addCommand('diagramDialog', new CKEDITOR.dialogCommand('diagramDialog'));
            editor.ui.addButton('diagram',
                {
                    label: '插入图',
                    command: 'diagramDialog',
                    toolbar: 'insert',
                    icon: CKEDITOR.plugins.getPath('diagram') + 'icons/diagram.png'
                });

            CKEDITOR.dialog.add('diagramDialog', this.path + 'dialogs/diagram.js');
            //双击编辑图
            editor.on('doubleclick',
                function (evt) {
                    var element = evt.data.element;
                    //$.print(element);
                    if (element.is('img') && element.hasClass('cke_diagram')) {
                        evt.data.dialog = 'diagramDialog';
                        //$.print(evt.data);
                    }
                });
        },
        afterInit: function (editor) {
            //针对图，注册替代显示规则
            var dataProcessor = editor.dataProcessor;
            var dataFilter = dataProcessor && dataProcessor.dataFilter;
            if (dataFilter) {
                dataFilter.addRules(
                    {
                        elements:
                        {
                            'iframe': function (element) {
                                if (element.hasClass("diagram")) {
                                    //用createFakeElement报错：Object doesn't support property or method 'getAttribute'
                                    var fakeElement = editor.createFakeParserElement(element, 'cke_diagram', 'iframe');
                                    //$.print(element.attributes);
                                    fakeElement.attributes['diagramid'] = element.attributes["diagramid"];
                                    fakeElement.attributes['title'] = "Diagram";
                                    fakeElement.attributes['alt'] = "Diagram";
                                    return fakeElement;
                                } else
                                    return element;
                            }
                        }
                    }, 5);
            }
        }
    });
