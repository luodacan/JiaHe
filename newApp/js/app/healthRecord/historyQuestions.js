/**
 * Created by wj on 2017/8/10.
 * multi_sels单多选
 */
define(['mui', 'vue', 'common', 'app'], function(mui, Vue, common, app_not) {
	var vueApp = new Vue({
		el: '#webapp',
		data: {
			question_o: [], //一级问题列表
			question_t: {}, //二级问题列表 暂不用
			option_p: {}, //答案列表
			saveList: {}, //保存数据
            review_id:'',
		},
		methods: {
			init: function() {
				var review_id =this.review_id= common.getQueryString("review_id");
				var that = this;
				var option = {
					url: "review_basic_problem_option/list", //获取选项
					data: {
						'review_id': review_id
					},
					type: 'post',
					success: function(data) {
						console.log(data);
						that.manageOption(data.data);
					},
				}
				var optionQuestion = {
					url: "review_basic_problem/list", //获取题目
					data: {
						'review_id': review_id
					},
					type: 'post',
					success: function(data) {
						common.ajax({
							option: option,
							isLoding: 1,
							isNew: 1
						});
						that.manageQuestion(data.data);
					},
				}
				common.ajax({
					option: optionQuestion,
					isLoding: 1,
					isNew: 1
				});
			},
			manageQuestion: function(data) { //处理问题
				var that = this;
				if(data) {
					for(var i = 0, n = data.length; i < n; i++) {
						var now = data[i];
						var id = now.id;
						that.question_o.push(now);
						that.option_p[id] = [];
					}
				}
			},
			manageOption: function(data) { //处理选项
				var that = this;
				if(data) {
					var ob = {};
					for(var i = 0, n = data.length; i < n; i++) {
						var now = data[i];
						now.isSelected=false;
						var id = now.review_basic_problem_id;
						ob[id] ? "" : ob[id] = [];
						ob[id].push(now);
					}
					that.option_p = ob;
				}
			},
			chooseItem: function(is_question, is_option) {
				var saveList = this.saveList;
				var Question_Id = is_question.id;
				var nowOption = {
					"Option_Cause": is_option.cause,
					"Option_Suggest": is_option.suggest,
					"Option_Harm": is_option.harm,
					"Option_score": is_option.option_num,
					"Option_id": is_option.id
				}
				if(saveList[Question_Id]) {
					switch(is_question.multi_sels) { //判断单多选
						case 0:
							saveList[Question_Id].selected_options = nowOption;
							break;
						case 1:
							var select_option = saveList[Question_Id].selected_options;
							for(var i = 0, n = select_option.length; i < n; i++) {
								select_option[i].Option_id == nowOption.Option_id ? select_option[i] = nowOption : select_option[i].push(nowOption);
							};
							break;
						default:
							break;
					}

				} else {
					saveList[Question_Id] = {
						"Question_score": is_question.problem_num,
						"Question_Id": Question_Id,
						"Question_Title": is_question.title,
						"selected_options": [nowOption]
					};
				}
				this.saveList = saveList;
				this.chooseActive(is_question, is_option);
			},
			chooseActive: function(is_question, is_option) { //处理选中状态
				var id = is_question.id,
					se_type = is_question.multi_sels;
				for(var i = 0, n = this.option_p[id].length; i < n; i++) {
					switch(se_type) {
						case 0:this.option_p[id][i].isSelected=false;is_option.isSelected=true;
							break;
						case 1:is_option.isSelected?is_option.isSelected=false:is_option.isSelected=true;
							break;
						default:;

					}
				}
			},
            saveBtn:function(){//保存
				var saveList=[];
				for(var i in this.saveList){
                    saveList.push(this.saveList[i]);
				}
				if(saveList.length<=0){
                    common.showToast({'title': "您未作出修改", 'icon': 'error'});
                    return false;
				}

				var dataFrom={"review_id":this.review_id,"result":saveList};
                // console.log(dataFrom);return false;
                var option = {
                    url: "day_health/add",
                    data: dataFrom,
                    success: function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            common.showToast({'title': '提交成功', 'icon': 'success'});

                        } else {
                            var title = data.message || '提交失败';
                            common.showToast({'title': title, 'icon': 'error'});
                        }

                    },
                }
                common.ajax({option: option, isLoding: 1,isNew:1});
			},
			clickUrl: function(url) {
				app.pop({
					"name": url,
					"id": "healthRecord_information"
				});
			},

		},
		components: {}
	});
	app.autoOauth(vueApp.init); //获取登录信息
	mui.init();
});