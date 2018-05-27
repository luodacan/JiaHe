/*
 * Created by wj on 2017/8/10.
 */
var _vueApp;
define(['mui', 'vue', 'common', 'mui_picker', 'mui_view', 'validate', 'app'], function (mui, Vue, common, mui_picker, mui_view, validate, app_not) {
    var vueApp = new Vue({
        el: '#webapp',
        data: {
            info: {name: '', default_price_yuan: ''},
            id: '',
            choosedate: '',//选择的时间
            chooseCard: '',//是否诊疗卡
            recommend_hospital: '',//推荐医院
            choose_hospital_name: '',//选择的医院名字
            choose_department_name: '',//选择的科室名字
            required: {},//需验证的列表  好像h5没用到
            dataFrom: {//提交的内容
                'item_id': '',
                'visitor_name': '',
                'visitor_phone': '',
                'visitor_id_card': '',
            },
            info: {'default_price_yuan': ''},
            validateConfig: {'visitor_phone': ['isMobile'], 'visitor_id_card': ['isIdCard']},//验证规则
            vaname: {
                'visitor_name': '请输入姓名',
                'visitor_id_card': '请输入正确的就诊人身份证',
                'visitor_phone': '请输入正确的就诊人手机号',
                'reservation_time': '请选择日期',
                'order_hospital': '请选择医院',
                'order_department': '请选择科室',
                'order_doctor': '请填写医生',
                'is_recommend_hospital': '请选择是否推荐医院',
                'has_diagnosis_card': '请选择是否有医疗卡',
                'upload_img': '请上传预约单',
            },
            picUrl: common.uploadUrl,
            chooseUploadImg: '',//选择的图片
            upLoadImgShow: '',//预览的图片
            imgList: [],
            departmentList: [],//科室列表存储
            doctorList: [],//医生列表
            chooseDoctorText: '',//选择医生后的显示
            showOtherDoctor: false,//显示选填医生
        },
        watch: {
            choosedate: function (val, oldVal) {//监控选择时间
                this.dataFrom['reservation_time'] = val;
            }
        },
        methods: {

            fileChange: function (el) {//监控图片变化显示

                common.showFlie(this, el, 'imgList');
            },
            oninput: function (val, obj, name) {//监控文本输入双向绑定
                this[obj][name] = val;//因v-model无法绑定动态加载的变量  所以用这种方式
            },
            init: function () {//开始

                var that = this;
                var id = common.getQueryString('id');
                that.id = id;
                var option = {
                    url: "Otodiagnosis/get_oto_diagnosis_item_detail",
                    data: {
                        id: id
                    },
                    type: 'post',
                    success: function (data) {
                        that.info = data.data;
                        console.log(data.data);
                        return that.start();
                    },
                }
                common.ajax({option: option, isLoding: 1});

            },
            start: function () {//初始化验证
                var dataFrom = this.dataFrom;
                var _validateConfig = this.validateConfig;
                var required = JSON.parse(this.info.required);
                for (var i in required) {
                    if (required[i][0] == 1) {
                        dataFrom[i] = "";
                        if (required[i][1] == 1) {
                            _validateConfig[i] ? _validateConfig[i].push('isEmpty') : _validateConfig[i] = ['isEmpty'];
                        }
                    }

                }
                dataFrom['item_id'] = this.id;
                this.validateConfig = _validateConfig;

                this.required = required;//这个好像h5没用到
            },
            chooseHospital: function () {//选择医院
                var that = this;
                var id = common.getQueryString('id');
                app.pop({
                    'name': 'diagnosis/orderHospital.html?id=' + id,"id":"disgnosis_orderHospital", "VC_block": function (data) {
                    	console.log("back");
                    	 	console.log(JSON.stringify(data));
                        if (data.hospital_id != that.dataFrom['order_hospital']) {
                            that.dataFrom['order_hospital'] = data.hospital_id;
                            that.choose_hospital_name = data.hospital_name;
                            that.departmentList = [];
                            that.doctorList = [];
                            that.dataFrom['order_department'] = '';
                            that.dataFrom['order_doctor'] = '';
                            that.chooseDoctorText = ''
                            that.chooseDeparment();
                        }
                    }
                });
            },
            chooseDeparment: function () {//选择科室
                var that = this;
                var hospital_id = this.dataFrom['order_hospital'];
                console.log(hospital_id);
                if (hospital_id == undefined || hospital_id.length <= 0) {
                    common.showToast({'title': '请先选择医院', 'icon': 'error'});
                    return false;
                }
                var option = {
                    url: "Otodiagnosis/get_hospital_department_list",
                    data: {'hospital_id': hospital_id},
                    method: 'POST',
                    success: function (data) {
                        console.log(data);
                        if (data.data.length <= 0) {
                            that.hasList = true;
                        } else {
                            that.departmentList = that.hosList = data.data;
                        }
                        that.getDoctor();
                    }

                }
                common.ajax({option: option});
                // var that = this;
                // var choose_hospital_id = this.dataFrom['order_hospital'];
                // app.pop({
                //     'name': 'diagnosis/departments.html?hospital_id=' + choose_hospital_id,
                //     "VC_block": function (data) {
                //         that.dataFrom['order_department'] = data.department_id;
                //         that.choose_department_name = data.department_name;
                //     }
                // });
            },
            getDoctor: function () {
                var that = this;
                var departmentList = that.departmentList;//获取科室与医生列表组成新组合

                var newList = {};

                if (departmentList.length <= 0) {//没数据时默认显示其他
                    newList = [{
                        value: '其他',
                        text: '其他',
                        children: [{value: '其他', text: '其他'}]
                    }]
                } else {
                    for (var i = 0, n = departmentList.length; i < n; i++) {
                        var id = 'de' + departmentList[i].id;

                        newList[id] = {
                            value: departmentList[i].id,
                            text: departmentList[i].name,
                            children: [{value: '其他', text: '其他'}]
                        };
                    }
                    console.log(newList);
                    if (departmentList.length > 0) {
                        var option = {
                            url: "Otodiagnosis/get_hospital_department_doctor_list",
                            data: {
                                'hospital_id': that.dataFrom['order_hospital'],
                                'department_id': that.dataFrom['order_department'] || ''
                            },
                            method: 'POST',
                            success: function (data) {
                                console.log(data);
                                var list = data.data;
                                for (var j = 0, m = list.length; j < m; j++) {
                                    var dorid = 'de' + list[j].department_id;
                                    if (newList[dorid]) {
                                        newList[dorid].children.push({
                                            value: list[j].name,
                                            text: list[j].name + " <span class='fz12'>(" + list[j].professional_name + ")</span>"
                                        });
                                    }
                                }
                            }
                        }
                        common.ajax({option: option});
                    }
                }
                that.doctorList = newList;
            },
            chooseDoctor: function () {//选择医生
                var that = this;
                var hospital_id = this.dataFrom['order_hospital'];
                if (hospital_id == undefined || hospital_id.length <= 0) {
                    common.showToast({'title': '请先选择医院', 'icon': 'error'});
                    return false;
                }
                var myList = [];
                for (var i in that.doctorList) {
                    myList.push(that.doctorList[i]);
                }
                common.popPickernum(2, myList, function (SelectedItem) {
                    var department = SelectedItem[0];
                    var doctor = SelectedItem[1];
                    that.dataFrom['order_department'] = department.value;
                    that.dataFrom['order_doctor'] = doctor.value;
                    if (department.value == "其他" || doctor.value == "其他") {
                        that.showOtherDoctor = true;
                    }
                    that.chooseDoctorText = department.text + ' - ' + doctor.text
                });

            },
            chooseDate: function () {//选择日期
                var that = this;
                var option = {beginDate: new Date()};
                common.DatePicker(that, 'choosedate', option);
            },
            choosePicker: function (_value, _name) {//选择下拉
                var that = this;
                var value = [{value: '0', text: '否'}, {value: '1', text: '是'}];

                common.PopPicker(that, _value, _name, value, 'dataFrom');//写得不好   有空修改
            },
            chooseUpload: function () {//选择图片
                var upload_img = document.getElementById('upload_img');

                upload_img.click();
            },
            saveOrder: function () {
                var that = this;
                if (app.getStorage('appUid') == 0 || app.getStorage('appUid') == undefined) {//判断是否登录
                    app.autoOauth();//获取登录信息
                }
                var dataFrom = that.dataFrom;
                var va_config = that.validateConfig;

                var va_back = that.validateFn(dataFrom, va_config);//验证开始

                if (!va_back) {//验证不通过
                    return false;
                }

                var option = {
                    url: "Otodiagnosis/add_oto_diagnosis",
                    data: dataFrom,
                    success: function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            common.showToast({'title': '提交成功', 'icon': 'success'});
                            setTimeout(function () {
                                app.pop({"name": "diagnosis/saveSuccess.html"});
                            }, 1200);
                        } else {
                            var title = data.message || '提交失败';
                            common.showToast({'title': title, 'icon': 'error'});
                        }

                    },
                }
                if (this.chooseUploadImg) {
                    common.addLoading();
                    var formData = new FormData(document.getElementById('upload_img_form'));
                    var xhr = new XMLHttpRequest();//mui的ajax死活上传不成功 就用简单的原生
                    xhr.open("post", common.ajax_url + "Appfileupload/add_oto_diagnosis_upload", true);
                    xhr.onload = function (res) {
                        var back = JSON.parse(res.target.response);
                        if (back.code == 0 && typeof back['data'] == 'object') {
                            dataFrom['upload_img'] = back.data[0];
                            common.ajax({option: option, isLoding: 1});
                        } else {
                            var title = back.data || '上传失败';
                            common.showToast({'title': title, 'icon': 'error'});
                        }
                    };
                    xhr.send(formData);
                } else {
                    common.ajax({option: option, isLoding: 1});
                }

            },
            validateFn: function (value, config) {
                var that = this;
                var vaname = that.vaname;
                var back = true;
                errors:
                    for (var i in vaname) {
                        if (config[i] && value[i] != undefined) {
                            for (var a = 0, n = config[i].length; a < n; a++) {
                                var types = config[i][a];
                                if (!validate(types, value[i])) {
                                    common.showToast({'title': vaname[i], 'icon': 'error'});
                                    back = false;
                                    break errors;
                                }
                            }
                        }
                    }
                return back;
            },
            showUserInfo: function () {//选择就诊人
                var that = this;
                var isUserChoose = that.isUserChoose||'';
                app.pop({
                    'name': 'diagnosis/orderUserInfoList.html?isUserChoose='+isUserChoose, "VC_block": function (data) {
                    	console.log('te');
                    	console.log(data);
                        if (data.dataFrom) {
                            for (var i in data.dataFrom) {
                                that.dataFrom[i] = data.dataFrom[i];
                            }
                        }
                        that.isUserChoose=data.isUserChoose;
                    }
                });
            },
        },
        components: {}
    });
//    vueApp.init();
     app.autoOauth(vueApp.init);//获取登录信息s
     _vueApp=vueApp;
});

