/**
 * Created by wj on 2017/8/10.
 */

define(['vue','common','app'], function (Vue,common,app_not){

    var simpleCounter = {
        template:common.successHtml,
        data:function(){
            return {data_text: '支付成功！',data_btn:'返回预约列表',data_url:'personal/myDiagnosis.html'}
        },
        methods: {
            successBtn: function () {
              app.pop({name:'personal/myDiagnosis.html'})
            }
        },
    }

    var vueApp = new Vue({
        el: '#webapp',
        data: {

        },
        methods: {
            tests:function(){
                alert("s");
            }
        },
        components: {
            'simple-counter':simpleCounter
        }
    });

});