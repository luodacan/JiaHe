$(function() {
	//图片
	if(unescape(getCookie("sex")) == "男") {
		$('#sex').attr("src", "../../img/HP/boy.png");
	} else {
		$('#sex').attr("src", "../../img/HP/girl.png");
	}
	//健康值
	$('.HV').waterbubble({
		txt: '86.7',
		data: 0.75,
		textColor: 'rgba(255, 255, 255, 0.8)',
		waterColor: 'rgba(255, 102, 0, 1)'
	});
	//健康趋势
	$('.HT').waterbubble({
		txt: '+2.3',
		data: 0.75,
		animation: true,
		textColor: 'rgba(0, 0, 0, 0.8)',
		waterColor: 'rgba(168, 228, 168, 1)'
	});
	//任务项
	$('.TI').waterbubble({
		txt: '5件',
		data: 0.75,
		animation: true,
		textColor: 'rgba(255, 255, 255, 0.8)',
		waterColor: 'rgba(21, 155, 213, 1)'
	});
	//状态报告
	$('.SR').waterbubble({
		txt: '1个',
		data: 0.75,
		animation: true,
		textColor: 'rgba(255, 255, 255, 0.8)',
		waterColor: 'rgba(147, 101, 75, 1)'
	});
});
$(document).ready(function() {
	$("#sex").on("click", function() {
		var sex = [
		"../../img/HP/boy.png",
		"../../img/HP/boycry.png",
		"../../img/HP/girl.png", 
		"../../img/HP/girlcry.png"];
		var seximg = $(this).attr("src");
		if(seximg == sex[0].toString()) {
			$(this).attr("src", sex[1]);
		}
		if(seximg == sex[1].toString()) {
			$(this).attr("src", sex[0]);
		}
		if(seximg.toString() == sex[2]) {
			$(this).attr("src", sex[3]);
		}
		if(seximg == sex[3].toString()) {
			$(this).attr("src", sex[2]);
		}
	});
});
$(function(){
	$ys.Slide('/app/Health/HealthTask',{},$('#tasklist'),
	function(v){
		var _t=v.type;
		var g='/Html/VAAD/SE.html';
		var extras={};
		if(_t==0) g="/Html/HR/AM.html";
		else if(_t==1) 
		{
			g='/Html/VAAD/AD.html';			
		}
		 
		var tmp='<div class="col-xs-12 column pad-lr10 pad-tb10 bc-grayw">'+
		'<a href="javascript:void(0);" onclick="pop(this)" data-url="'+g+'" data-gid="'+v.gId+'" data-t="'+_t+'">'+
			'<div class="col-xs-12 column bc-white border-gray pad-none">'+
				'<div class="col-xs-1 column pad-none">'+
					'<div class="triangle-down"></div>'+
				'</div>'+
				'<div class="col-xs-6 column lih30 pad-r2">'+
					'<span class="text-muted">'+v.Suggest+'</span><br/>'+
					'<span class="text-muted">奖励</span>'+
					'<i class="fa fa-plus-square" style="color: rgb(244,234,42);"></i>'+
					'<strong style="color:rgb(22,155,213)">x2</strong>'+
				'</div>'+
				'<div class="col-xs-5 column text-right lih30 pad-l2">'+
					'<strong class="text-default">'+v.Class+'</strong><br/>'+
					'<span class="text-muted">任务完成度</span>'+
					'<strong style="color:rgb(22,155,213)">+'+v.prog+'%</strong>'+
				'</div>'+
			'</div>'+
		'</a>'+
	'</div>';
	return tmp;
	},function(data){
		//任务项
		var len=0;
		if(data.success){
			len=data.result.length;
		}
	$('.TI').waterbubble({
		txt: len+'件',
		data: 0.75,
		animation: true,
		textColor: 'rgba(255, 255, 255, 0.8)',
		waterColor: 'rgba(21, 155, 213, 1)'
	});
	},function(data){
		$.dialog.alert(data);
	});
});
function pop(sender)
{
	var obj=$(sender),extras;
	extras={
		Id:obj.gid,
	};
	if((+obj.t)==1){
		extras.read=1;
	}
	$ys.platform.open({url:obj.data('url'),extras:extras})
}
