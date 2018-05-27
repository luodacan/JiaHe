/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common', 'app'], function (mui, Vue, common, not_app) {

    var vueApp = new Vue({
        el: '#webapp',
        data: {
            id: '',
            list: [],
            hasList: false,//是否有数据
            getHospotalData: {"item_id": "", "page_size": 50, "page_index": 1, "search": ""},//获取医院data
        },
        watch: {
            pageSearch: function (val, oldVal) {//监控搜索
                this.getHospotal('', val);
            }
        },
        methods: {
            init: function () {
                var that = this;
                var id = common.getQueryString('id');
                that.getHospotalData.item_id=id;
                that.getHospotal(id);
            },
            getHospotal: function (id, search) {
                var that = this;
                var data = that.getHospotalData;
                data.item_id = id || data.item_id;
                data.search = search || "";
                var option = {
                    url:"Otodiagnosis/get_oto_diagnosis_item_hospital_list",
                    data: data,
                    type: 'post',
                    success: function (data) {
                        that.list = data.data;
                        if (data.data.length <= 0) {
                            that.hasList = true;
                        }else{
                            that.hasList = false;
                        }
                    },
                }
                common.ajax({option:option,isLoding: 1});
            },
            choose: function (id, name) {
                console.log(id+'   '+name);
                app.block_VC({"previous_id":"diagnosis_order","data":{"hospital_id": id, "hospital_name": name}});
                app.close_VC();
            }
        },
        components: {
            nodata: {
                template: common.noDataHtml,
                data: function () {
                    return {data_text: '该项目暂无配置医院'}
                }
            }
        }
    });
    vueApp.init();
});