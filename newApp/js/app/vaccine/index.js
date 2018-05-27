/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {

        },
        methods: {
            init: function () {


            },


        },
        components: {}
    });
    app.autoOauth(vueApp.init);//获取登录信息
    mui.init();
});

