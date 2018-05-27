$ys.platform.init(function(){
	var id=$ys.platform.QueryString('Id');
	if(!$ys.IsInt(id)){
		$.dialog.alert('计划模板为空');
	}else{
		LoadPlan(id);
	}							
});
function LoadPlan(id)
{
	$ys.Slide('/app/Investigation/InvPlan',{Id:id},$('#listplan'),function(v){
		var tmp='<a href="javascript:void(0);" onclick="pop('+v.Id+')">'+
		'<div class="col-xs-12 column mar-tb10">'+
			'<div class="col-xs-12 column  bc-white pad5">'+
				'<div class="col-xs-2 column pad-none">'+
					'<img src="../../img/MedicalCare.jpg" width="50" height="50">'+
				'</div>'+
				'<div class="col-xs-7 column">'+
					'<span>'+v.PlanName+'</span>'+
					'<p class="text-muted">周期：'+v.Frequency+'天</p>'+
				'</div>'+
				'<div class="col-xs-3 column text-right">'+
					'<p class="text-muted color_blue  pad-t15">菜鸟</p>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</a>';
		return tmp;
	},function(data){					
		if(data.success&&data.result.length==0)
			$.dialog.errorTips('没有相关计划');
	});
}
function pop(Id){
	$ys.platform.open({url:'/Html/VAAD/FP.html',extras:{Id:Id}});
}