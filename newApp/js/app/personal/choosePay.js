/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            info:{
                item_name:'',
                order_num:'',
                myremark:'',
                priceNum:0,
            },
            userInfo:'',
            payType:0,//选择的类型
        },
        methods: {
            init: function () {
                var that = this;
                var id = common.getQueryString('id');
                var option = {
                    url:"Otodiagnosis/my_oto_diagnosis_detail",
                    'data': {'id': id},
                    'success': function (data) {
                        console.log(data);
                        var data = data.data;
                        data['priceNum'] =  parseFloat(data.service_price) + parseFloat(data.fee);
                        data['priceNum'] = data['priceNum'].toFixed(2);
                        that.info = data;
                    }
                }

                var get_userInfo = {
                    'url': 'Xcxlogin/get_userInfo',
                    'success': function (data) {
                        that.userInfo=data.data.nickname;
                    }
                }
                common.ajax({option:get_userInfo,isLoding:1});
                common.ajax({option:option,isLoding:1});
            },
            chooseType:function(n){
                this.payType=n;
            },
            payBtn:function(){
                var that=this;
                var payType=that.payType;
                var setType={0:'ios_app_wx',1:'ios_app_alipay'};
                var pay_platform=setType[payType];
                var ordeNnum=that.info.order_num;
                var option = {
                    url:"Otodiagnosis/prepay_oto_diagnosis",
                    data: { 'order_num': ordeNnum,'pay_platform':pay_platform },
                    type: 'post',
                    success: function (data) {
                        console.log(data);
                        var data=data.data;
                        // data['pay_platform']=pay_platform;
                        app.wxPay(data,function(){

                            console.log("支付回调");
                        },pay_platform);
                    },
                }
                common.ajax({option:option,isLoding:1});
            },
        },
        components: {}
    });
    app.autoOauth(vueApp.init);//获取登录信息
});
