/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app', 'previewimage'], function (mui, Vue, common, app_not, previewimage) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            picUrl: common.uploadUrl,
            order_status: common.order_status,
            has_diagnosis_card_name: {
                0: '没有',
                1: '有'
            },
            is_recommend_hospital_name: {
                0: '否',
                1: '是'
            },
            info: {service_price: '', fee: ''},
            consoleg: 'test',
            order_id: '',
        },
        methods: {
            init: function () {
                var that = this;
                var id = common.getQueryString('id');
                that.order_id = id;
                var option = {
                    url:"Otodiagnosis/my_oto_diagnosis_detail",
                    'data': {'id': id},
                    'success': function (data) {
                        console.log(data);
                        var data = data.data;
                        data.service_price = parseFloat(data.service_price);
                        data.fee = parseFloat(data.fee);
                        data.service_price_show = data.service_price.toFixed(2);
                        data.fee_show = data.fee.toFixed(2);
                        data['priceNum'] = data.service_price + data.fee;
                        data['priceNum'] = data['priceNum'].toFixed(2);

                        if (data['reservation_time']) {
                            data['reservation_time'] = common.changeTime(data['reservation_time']);
                        }
                        if (data['actually_visit_time']) {
                            data['reservation_time'] = common.changeTime(data['actually_visit_time']);
                        }
                        // data.reservation_status = 1;
                        that.info = data;
                    }
                }
                common.ajax({option:option,isLoding:1});
            },
            saveOrder: function () {//支付
                var that = this;
                if (that.info.reservation_status == 1) {
                    app.pop({
                        name: 'personal/choosePay.html?id=' + that.order_id, "VC_block": function () {
                            that.init();
                            setTimeout(function () {

                                app.pop({name: 'personal/payDiagnosisSuccess.html'}, 100);

                            });

                        }
                    });
                    //     var num = that.info.order_num;
                    //     var option = {
                    //         data: { 'order_num': num },
                    //         type: 'post',
                    //         success: function (data) {
                    //             console.log(data);
                    //             app.wxPay(data.data,function(){
                    //                 app.pop({name:'personal/payDiagnosisSuccess.html'});
                    //                 console.log("支付回调");
                    //             });
                    //         },
                    //     }
                    //     common.ajax("Otodiagnosis/prepay_oto_diagnosis",option,that,1);
                    //
                    //
                }

            },
            commentBtn: function () {//评价
                var id = this.info.id;
                app.pop({'name': 'personal/diagnosisEvaluation.html?id=' + id});
                // wx.navigateTo({
                //     url: 'evaluation?id=' + this.data.info.id,
                // })
            }

        },
        components: {}
    });
    vueApp.init();
    mui.previewImage();
});
