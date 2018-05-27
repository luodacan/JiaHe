/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            picUrl: common.uploadUrl,
            order_status: common.order_status,
            nodata: {
                'data_show': false,
                'data_text': "您还未预约陪诊服务"
            },
            list: [],//列表
            hasList:false,//是否有数据
        },
        methods: {
            init: function () {
                var that = this;
                var option = {
                    url:"Otodiagnosis/my_oto_diagnosis",
                    data: {},
                    type: 'post',
                    success: function (data) {
                        that.list = data.data;
                        if(data.data.length<=0){
                            that.hasList=true;
                        }
                    }
                }
                common.ajax({option:option,isLoding:1,isRefresh:{"fn":vueApp.init}});
            },
            
            chooseList: function (id) {
                app.pop({name:'personal/myDiagnosisDetail.html?id='+id});
            },
        },
        components: {
            nodata: {
                template: common.noDataHtml,
                data: function () {
                    return {data_text: '暂无预约记录'}
                }
            }
        }
    });
    app.autoOauth(vueApp.init);//获取登录信息
 
});