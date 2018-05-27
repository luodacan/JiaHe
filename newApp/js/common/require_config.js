/**
 * Created by Wenwu on 7/19/2016.
 *
 * ps:因安卓ios需要使用app.js   app用的是全局  define定义的只是为了引入app.js
 */
require.config({
    baseUrl: '../js/app/',
    paths: {
        'vue': '../../lib/vue/dist/vue.min',
        'mui': '../../lib/mui/dist/mui.min',
        'mui_view': '../../lib/mui/dist/mui.view',
        'mui_picker': '../../lib/mui/dist/mui.picker.min',
        'previewimage': '../../lib/mui/dist/mui.previewimage',
        'muiZoom': '../../lib/mui/dist/mui.zoom',

        'css': '../../js/common/css.min',//requirejs 引入css插件
        'text': '../../js/common/text',//requirejs 引入文件插件

        'config': '../../js/common/config',
        'app': '../../js/common/plusNative',
        'common': '../../js/common/common',
        'validate': '../../js/common/validate',

    },
    shim: {
        mui_picker:{"deps":["mui","css!../../lib/mui/mui.picker.min.css"]},
        previewimage:{"deps":["mui","muiZoom","css!../../lib/mui/mui.previewimage.css"]},//图片预览
        mui_view:{"deps":["mui"]},
        app:{}
    }
});