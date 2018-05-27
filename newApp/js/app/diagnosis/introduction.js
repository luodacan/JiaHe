/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            //list:[false,false,false,false,false],
            list: {0: false, 1: false, 2: false, 3: false, 4: false,},
            itemnow: true,
            picUrl: common.uploadUrl,
            info: {name:'',default_price_yuan:''},
            now_item: -1,
            id: ''
        },
        methods: {
            init: function () {
                var that = this;
                var id = common.getQueryString('id');
                that.id = id;
                var option = {
                    url:"Otodiagnosis/get_oto_diagnosis_item_detail",
                    data: {
                        id: id
                    },
                    type: 'post',
                    success: function (data) {
                        that.info = data.data;
                        console.log(that.info);
                    },
                }
                common.ajax({option:option,isloding:1});
            },
            showDetail: function (num) {
                this.list[num] = !this.list[num];
            },
            payBtn: function () {
                if (this.id) {
                    app.pop({"name":"diagnosis/order.html?id="+this.id,"id":"diagnosis_order"});
                }
            },

        },
        components: {}
    });
    vueApp.init();
});
