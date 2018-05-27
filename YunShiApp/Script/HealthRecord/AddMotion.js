$(function(){
	$ys.Page.init({
		action:"/app/Motion/MotionList",
		sender:$('#listMotion'),
		result:"result",
		Render:function(v,i){
		var tmp='<a class="text-default" data-id="'+v.Id+'" data-calorie="'+v.Calorie+'">'+
	'<div class="row pad-tb10">'+
		'<div class="col-xs-3">'+
			'<img alt="140x140" src="'+$ys.url+v.Icon+'" height="100%" width="100%" class="img-rounded" />'+
		'</div>'+
		'<div class="col-xs-9 text-left lih35">'+
			'<h4 class="lih50 ">'+v.Name+'</h4>'+
		'</div>'+
	'</div>'+
'</a>'+
'<div class="border-b"></div>';
		return tmp;
	},
	});
});		
function search()
{
	$ys.Page.reload({param:{Name:$('#inp-motion').val()}});				
}
$(document).ready(function(event) {
	var body = $("body");
	body.on("click", ".text-default", function(e) {
		$('.text-main').removeClass('text-main').addClass('text-default');
		$(this).addClass("text-main").removeClass("text-default");
		 e.stopPropagation(); 
		$("#amount").trigger('click');
	});
});
var mval=[];
for(var i=1;i<=1440;i++)
{
	mval.push(i);
}
$("#amount").picker({
	title: "分钟",
	cols: [{
		textAlign: 'center',
		values: mval
	}],
	onChange: function(p, v, dv) {
	
	},
	onClose: function(p, v, d) {
		var val=$("#amount").val();//运动分钟数
		var Motion=$('.text-main');
		var MotionName=Motion.find('h4').text(),//运动名称
			MotionCalorie=Motion.data('calorie'),//运动单位能量
 			MotionId=Motion.data('id');//运动Id
		var record=$('#inp-record');
		record.val(MotionName+val+'分钟');
		record.data('motionid',MotionId);
		record.data('motioncalorie',(+MotionCalorie)*(+val));
		record.data('motiontime',val);
	}
});
function sub()
{
	$.dialog.confirm('提交确认？',function(){
		var record=$('#inp-record');
		var Id=record.data('motionid'),
			Calorie=record.data('motioncalorie'),
			time=record.data('motiontime');
			if(!AppCustom.IsInt(Id)||!AppCustom.IsFloat(Calorie)||!AppCustom.IsInt(time)){
				$.dialog.errorTips('请选择运动');
				return;
			}
		var loading=showLoading();
		$ys.post('/app/Motion/AddMmeberMotion',{
			id:Id,
			calorie:Calorie,
			time:time,
		},function(data){
			loading.close();
			if(data.success)
			{
				var record=$('#inp-record');
				record.val('');
				record.data('motionid','');
				record.data('motioncalorie','');
				record.data('motiontime','');
				$.dialog.succeedTips('提交成功');
			}else{
				$.dialog.errorTips(data.msg);
			}
		});
	});
}