/**
 * Created by wj on 2017/8/10.
 */
var thisApp = {};
define(['mui', 'vue', 'common', 'app', 'mui_picker','validate'], function(mui, Vue, common, app_not, mui_picker,validate) {
	var vueApp = new Vue({
		el: '#webapp',
		data: {
			saveType: null,
			info: {},
			infoShow: {
				"sex": "",
				"reduce_weight": "",
				"marriage": "",
				"medical_insurance": "",
				"degree_education": "",
				"birthday_time": "",
				"height":"",
				"weight":""
			},
			sexSelect: [],
			reduce_weightSelect: [],
			marriageSelect: [],
			medical_insuranceSelect: [],
			degree_educationSelect: [],
			choosedate: "",
		},

		methods: {
			init: function() {
				var that = this;
                var option = {
                    url: "dict/lists",
                    data: {"identifications":"'reduce_weight','marriage','sex','degree_education','medical_insurance'"},
                    type: 'post',
                    success: function (data) {
						if(data.code==0){
                            var seData=data.data;
                            var parent_id="";
                            var parent_name="";
                            var optionList={};
                            for(var i=0,n=seData.length;i<n;i++){
                            	if(seData[i].parentid!=0){
                            		var id=seData[i]['parentid'];
                                    optionList[id]?"":optionList[id]=[];
                                    optionList[id].push({"value":seData[i].identification,"text":seData[i].name});
								}
							}
                            for(var i=0,n=seData.length;i<n;i++){
                                if(seData[i].parentid==0){
                                    parentid=seData[i].id;
                                    parent_name=seData[i].identification+"Select";
                                    that[parent_name]=optionList[parentid];
                                }
                            }
						}
                        common.ajax({
                            option: optionDetail,
                            isLoding: 1,
                            isNew: 1
                        });
                    }
                }
                common.ajax({
                    option: option,
                    isLoding: 1,
                    isNew: 1
                });
				var optionDetail = {
					url: "review_guest/detail",
					data: {},
					type: 'post',
					success: function(data) {
						that.saveType = false;
						var _data = data.data;
						if(_data.id) {
                           that.info = _data;
							that.saveType = true;
                            for(var i in that.infoShow) {
                                var sele = i + "Select";
                                if(that[sele]) {
                                    that.infoShow[i] = that.allSelectShow(sele, _data[i]);
                                }else{
                                    that.infoShow[i]=_data[i];
								}
                            }
                            if(_data.birthday_time){
                               that.infoShow.birthday_time = common.changeTime(_data.birthday_time, ['y', 'M', 'd']);
                            }
						}
					},
				}

			},
			chooseDate: function() { //选择日期
				var that = this;
				var option = {
					beginDate: new Date(1960),
					type: "date"
				};
				common.newDatePicker({
					"value": that.info,
					"text": that.infoShow,
					"name": "birthday_time",
					"option": option,
					"callBack":function(selectItems){
                        that.info['birthday_time'] = common.timeChange(selectItems.value);
                        that.infoShow['birthday_time']=selectItems.value;
					}
				});
			},
			choosePicker: function(name, option) { //选择下拉
				var that = this;
				common.newPopPicker({
					"name": name,
					"value": that.info,
					"text": that.infoShow,
					"arr": that[option]
				});
			},
			allSelectShow: function(name, value) {
				var arr = this[name],
					back = "";
				for(var i in arr) {
					arr[i].value == value ? back = arr[i].text : "";
				}
				return back;
			},
            chooseNum:function(name){
				var min=0,max=0,that=this;
                if(name=="height"){
                	min=130;max=210;
                    var choose=[40,0];
				}
                if(name=="weight"){
                    min=30;max=100;
                    var choose=[20,0];
                }
				var myList=that.getHeightSelect(min,max);

                if(that.info[name]){//当前值
                    var val=that.info[name].split(".");
                    var o=val[0];
                    var t=val[1];
                    choose[0]=parseInt(o)-min;
                    choose[1]=parseInt(t);
				}

                common.popPickernum(2, myList, function (SelectedItem) {//choose:默认值
					console.log(SelectedItem);
					that.infoShow[name]=that.info[name]=SelectedItem[0].value+"."+SelectedItem[1].value;
				},choose);
                var _list=document.getElementsByClassName("mui-poppicker mui-active");
                var list=_list[0].getElementsByClassName("mui-picker");
                list[0].style.width="70%";
                list[1].style.width="30%";
                list[0].style['border-right']="dotted 1px #ebebeb";
			},
            getHeightSelect:function(min,max){
                min=min?min:130;
                max=max?max:210;
                var arr=[{"value":"0","text":"0"}];
                for(var i=1;i<10;i++){
                    arr.push({"value":i,"text":i});
                }
                var backArr=[];
                for(var m=min;m<max;m++){
                    var thisArr={"value":m,"text":m,"children":arr};
                    backArr.push(thisArr);
                }
                return backArr;
            },
			saveBtn: function() {

				var that = this;
				var _type = null;
				that.saveType ? _type = "update" : _type = "add";
				var dataform=that.info;
				if(dataform.idcard && !validate("isIdCard", dataform.idcard)){
                    common.showToast({
                        'title': '请输入正确的身份证号码',
                        'icon': 'error'
                    });
                    return false;
                }

				var option = {
					url: "review_guest/" + _type,
					data: dataform,
					type: 'post',
					success: function(data) {
						console.log(data);
						if(data.code == 0) {
							common.showToast({
								'title': '提交成功',
								'icon': 'success'
							});
						} else {
							var title = data.message || '提交失败';
							common.showToast({
								'title': title,
								'icon': 'error'
							});
						}
					},
				}
				common.ajax({
					option: option,
					isLoding: 1,
					isNew: 1
				});
			}
		},
		components: {},

	});
	app.autoOauth(vueApp.init); //获取登录信息
	thisApp = vueApp;
	
	mui.init();
});

var saveBtn = function() {
	return thisApp.saveBtn();
}


