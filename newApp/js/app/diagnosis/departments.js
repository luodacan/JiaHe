/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common','app'], function (mui, Vue, common,not_app) {

    var vueApp = new Vue({
        el: '#webapp',
        data: {
            id: '',
            list: [],
            hasList:false,//是否有数据
        },
        methods: {
            init: function () {
                var that = this;
                var hospital_id=common.getQueryString('hospital_id');
                console.log(hospital_id);
                if(hospital_id){
                    var option = {
                        url:"Otodiagnosis/get_hospital_department_list",
                        data: {'hospital_id':hospital_id},
                        method: 'POST',
                        success: function (data) {
                            console.log(data);
                            if (data.data.length <= 0) {
                                that.hasList=true;
                            }else{
                                that.list=data.data;
                            }
                        }

                    }
                    common.ajax({option:option,isLoding:1});
                }

            },
            choose: function (id,name) {
                app.block_VC({"department_id":id,"department_name":name});
                app.close_VC();
            }
        },
        components: {
            nodata: {
                template: common.noDataHtml,
                data: function () {
                    return {data_text: '该医院暂无配置科室'}
                }
            }
        }
    });
    vueApp.init();
});