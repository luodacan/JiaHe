/**
 * Created by wj on 2017/8/10.
 */
define(['mui', 'vue', 'common', 'app'], function(mui, Vue, common, app_not) {
	var vueApp = new Vue({
		el: '#webapp',
		data: {
			list: [],
			nodata: {
				'data_show': false,
				'data_text': '暂无记录'
			},
			upload_url: common.uploadUrl.upload_url
		},
		methods: {
			init: function() {
				var that = this;
				var option = {
					url: "health/list",
					data: {
						'review_type': 'health_assessment'
					},
					type: 'post',
					success: function(data) {

						that.list = data.data;
						if(data.data.length <= 0) {
							that.nodata.data_show = true;
						}
					},
				}
				common.ajax({
					option: option,
					isLoding: 1,
					isNew: 1,
					isRefresh:{"fn":vueApp.init}
				});
			},
			chooseItem: function(id,name) {
				app.pop({
					"name": 'healthEvaluation/questions.html?review_id=' + id,
					"id": "healthEvaluation_question",
					"titleNView":{
						"titleText":name
					}
				});
			},

		},
		components: {
			nodata: {
				template: common.noDataHtml,
			}
		}
	});
	app.autoOauth(vueApp.init); //获取登录信息

	mui.init();
});
var toParts = function() {
	app.pop({
		"name": 'healthEvaluation/parts.html',
		"id": "healthEvaluation_parts"
	});
}