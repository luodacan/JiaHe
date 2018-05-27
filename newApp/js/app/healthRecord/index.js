/**
 * Created by wj on 2017/8/10.
 */
define(['mui', 'vue', 'common', 'app'], function(mui, Vue, common, app_not) {
	var vueApp = new Vue({
		el: '#webapp',
		data: {
			information: {
					"buttons": [{
						"color": "#FFFFFF",
						"float": "right",
						"text": "保存",
						"fontSize": "16px",
						"onclick": "javascript:plus.webview.getWebviewById('healthRecord_information').evalJS('saveBtn();')",
					}],
				},
				examination:{
					"buttons": [{
						"color": "#FFFFFF",
						"float": "right",
						"text": "编辑",
						"fontSize": "16px",
						"onclick": "javascript:plus.webview.getWebviewById('examination_index').evalJS('edit();')",
					}],
				}
		},
		methods: {
			init: function() {

			},
			clickUrl: function(url, id, nav) {
				app.pop({
					"name": url,
					"id": id,
					"titleNView":this[nav]||""
				});
			},
		},
		components: {}
	});
	app.autoOauth(vueApp.init); //获取登录信息

	mui.init();
});