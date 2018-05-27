/**
 * Created by wj on 2017/8/10.
 */
define(['mui', 'vue', 'common', 'app'], function(mui, Vue, common, app_not) {
	var vueApp = new Vue({
		el: '#webapp',
		data: {
			sex:1
		},
		methods: {
			init: function() {

			},
			chooseSex:function(n){
				this.sex=n;
			},
			choosePart: function(id,name) {
				console.log(id);
				app.pop({
					"name": 'healthEvaluation/questions.html?review_id=' + id,
					"id": "healthEvaluation_question",
					"titleNView":{
						"titleText":name
					}
				});
			},

		},
		components: {}
	});
	app.autoOauth(vueApp.init); //获取登录信息
	mui.init();
});
var list = document.getElementsByClassName('parts-item');
for(var i = 0, n = list.length; i < n; i++) {
	var t_left = list[i].getAttribute('data-left');
	var t_top = list[i].getAttribute('data-top');
	list[i].style.left = pr(t_left);
	list[i].style.top = pr(t_top);
	list[i].style.display = "block";
}
function pr(n) {
	return(n / 2.9) / 16 + 'rem';
}