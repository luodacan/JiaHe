var mealname='',flag=true,mealtype='';
$ys.platform.init(function(){
	var id=$ys.platform.QueryString('Id');		
	mealtype=id;
	if(id=='0')
		mealname='早餐';
	else if(id=='1')
		mealname='午餐';
	else if(id=='2')
		mealname='晚餐';
	else if(id=='3')
		mealname='加餐'
	else
	{
		flag=false;						
		}
	$('#h-meal').text('记录'+mealname);
	Loadfood();				
});
function choose(sender)
{
	if(!flag) return;
	var obj=$(sender);
	var img = obj.find('img').attr("src");
	var title = obj.find('h4').text(),
		Id=obj.data('id'),
		Unit=obj.data('unit'),
		unitcar=obj.data('unitcar'),
		mea=obj.data('mea');				
	var url='../1Test/10.html?img=' + encodeURI(img) + "&title=" + encodeURI(title) + "&Id="+Id+"&unit="+encodeURI(Unit)+"&unitcar="+encodeURI(unitcar)+"&mea="+encodeURI(mea)+"&mealtype="+mealtype;

	var html = '<iframe style="height: -webkit-fill-available;width: 100%; border: 0;" src="' + url + '"></iframe>';					
	openhtml(html);
}
//打开一个页面
function openhtml(html) {
	layer.open({
		type: 1,
		content: html,
		anim: 'up',
		shade: 'background-color: rgba(0,0,0,.6)', //自定义遮罩的透明度
		style: 'position:fixed; bottom:0; left:0; width: 100%; height: 70%; padding:0px 0; border:none;',
		end: function(index) {						
			layer.close(index);
		}
	});
}	
function Loadfood()
{
	$ys.Page.init({
		action:"/app/Food/CommonFood",
		sender:$('#foodlist'),
		result:"result",
		Render:function(v,i){
		var tmp='<div style="margin-bottom:8px" class="row pad-t10 text-default" onclick="choose(this)" data-id="'+v.Id+'" data-unit="'+v.AccumulationUnit+'" data-unitcar="'+v.AccumulationUnitCalorie+'" data-mea="'+v.Measure+'">'+
	'<div class="col-xs-3">'+
		'<img alt="140x140" src="'+$ys.url+v.Icon+'" height="60px" width="60px" class="img-rounded" />'+
	'</div>'+
	'<div class="col-xs-5 text-left lih35 ">'+
		'<h4>'+v.Name+'</h4>'+				
	'</div>'+
	'<div class="col-xs-4 text-right lih40">'+
		'<div class="text-muted"><span></span>'+v.Measure+'</div>'+
	'</div>'+
'</div>'+
'<div class="border-b"></div>';
	return tmp;
	},
	
	});
}
function search(){							
	$ys.Page.reload({param:{Name:$('#inp-food').val()}});
}	