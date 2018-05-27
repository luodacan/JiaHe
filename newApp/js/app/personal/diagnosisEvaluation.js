/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            picUrl: common.uploadUrl,
            chooseNum: -1,//选择星星
            evaComtent: '',//提交评语
            isComtent: true,//是否已评价
            info: {item_name: '', order_num: ''}
        },
        methods: {
            init: function () {
                var that = this;
                var id = common.getQueryString('id');
                that.id = id;
                var option = {
                    'data': {'id': id},
                    'success': function (data) {
                        var isComtent = false;
                        if (data.data.comment_id) {
                            isComtent = true;
                        }
                        var comment_content = data.data.comment_content || '';
                        var star_level = data.data.star_level || -1;
                        that.info = data.data;
                        that.evaComtent = comment_content;
                        that.chooseNum = star_level;
                        that.isComtent = isComtent;
                    }
                }
                common.ajax("Otodiagnosis/my_oto_diagnosis_detail", option, that, 1);
            },

            chooseN: function (num) {//选择星星
                console.log(num);
                if (this.isComtent) {
                    return false;
                }
                this.chooseNum = num;
            },
            evaBtn: function () {
                var that = this;

                var star_level = that.chooseNum;//评星
                var content = that.evaComtent;//评语
                if (star_level < 0) {
                    common.showToast({'title': '请选择评价', 'icon': 'error'});
                    return false;
                }
                if (content.length <= 0) {
                    common.showToast({'title': '请输入评语', 'icon': 'error'});
                    return false;
                }
                var ajaxData = {
                    id: that.id,
                    content: content,
                    star_level: star_level
                }
                // console.log(ajaxData);
                // return false;
                var option = {
                    url:"Otodiagnosis/my_oto_diagnosis_add_comment",
                    'data': ajaxData,
                    'success': function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            common.showToast({'title': '评价成功', 'icon': 'success'});
                            setTimeout(function () {
                              app.close_VC();
                            }, 1200);
                        } else {
                            common.showToast({'title': data.message, 'icon': 'error'});

                        }
                    }
                }
                common.ajax({option:option,isLoding:1});
            }
        },
        components: {}
    });
    vueApp.init();
});