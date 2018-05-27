/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            list: [],
            picUrl: common.uploadUrl,
            slide: {}
        },
        methods: {
            init: function () {
                var that = this;
                console.log(that.list);
                var option = {
                    url: "Otodiagnosis/get_pz_slide_pic",
                    data: {},
                    type: 'post',
                    success: function (data) {
                        console.log(data);
                        that.slide = data.data;
                    },
                }
                common.ajax({option: option, isLoding: 1});

                var option2 = {
                    url: "Otodiagnosis/get_oto_diagnosis_item_list",
                    data: {},
                    type: 'post',
                    success: function (data) {
                        console.log(data);
                        that.list = data.data;
                    },
                }
                common.ajax({option: option2, isLoding: 1});

            },
            clickUrl: function (id) {
                app.pop({"name": "diagnosis/introduction.html?id=" + id, "id": "disgnosis_introduction"});
            },

        },
        components: {}
    });

    app.autoOauth(vueApp.init);//获取登录信息
    app.setNView({
		"titleNView": { //原生头部导航栏
			"backgroundcolor": "#c8a915",
			"titlecolor": "#FFFFFF",
			"autoBackButton": true
		}
	});
    mui.init();
});

