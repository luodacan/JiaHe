function RadioSpan(sender)
{
	var obj=$(sender);
	if(obj.hasClass('Selected'))
	{
		obj.removeClass('Selected').addClass('NoSelected');
	}else{
		
		obj.removeClass('NoSelected').addClass('Selected').parent().siblings('div').children().removeClass('Selected').addClass('NoSelected');
	}
}
function Multiselect(sender)
{
	var obj=$(sender);
	if(obj.hasClass("Selected"))
		{
			obj.removeClass("Selected").addClass("NoSelected");
		}else{
			obj.removeClass("NoSelected").addClass("Selected");
		}	
}
var initflag;
$ys.platform.init(function(){
	var inId=$ys.platform.QueryString('Id');
	if($.trim(inId).length==0){
		initflag=false;
	}else{
		initflag=true;
		$ys.Slide('/App/Investigation/InvestigationId',{Id:inId},$('#optlist'),function(v,i){
			var item=[];
			var itemstr;
			
			v.list.forEach(function(q){
				var item1=[];
				var itemstr1;
				q.list.forEach(function(w){
					itemstr1='<div class="col-xs-6 column text-center pad-tb10">'+
					'<span class="span-white pad-tb5 pad-lr10 circle5 NoSelected " onclick="'+(q.IsMultiselect?"Multiselect(this)":"RadioSpan(this)")+'" data-score='+w.Score+'>'+w.Option+'</span>'+
				'</div>';
					item1.push(itemstr1);
				});							
				
				itemstr='<div class="type">'+
			'<strong>'+q.Content+'</strong>'+
			'<br/><br/>'+
			'<div class="col-xs-12 column pad-tb10 container-query">'+item1.join('')+				
			'</div>'+
			'<div class="col-xs-12 column">'+
				'<hr/>'+
			'</div>'+
		'</div>';
				item.push(itemstr);					
			});					
			var tmp='<div class="col-xs-12 column bc-white mar-tb10 pad-b20 border">'+
		'<strong class="lih40">'+(i+1)+'、'+v.Question+'</strong>'+
		'<hr class="mar-none mar-b10" />'+item.join('')+					
	'</div>';						
		return tmp;	
		},function(v){
			if(v.success)
			{
				$('#span-title').text(v.info.Title);
				$('#hi-Investigation').val(v.info.Id);
			}
			
		});
	}			
});
function sub()
{
	if(!initflag) return;
	var flag=true;
	var sum=0;
	$('.container-query').each(function(i,e){
		var obj=$(e);
		var list=obj.find('.Selected');
		if(list.length==0) flag=false;
		list.each(function(j,q){
			sum+=(+$(q).data('score'));	
		});
	});
	if(!flag){
		$.dialog.errorTips('请回答完所有问题');
		return;
	}
	var Investigation=$('#hi-Investigation').val();
	if(!$ys.IsInt(Investigation)||!$ys.IsInt(sum)){
		$.dialog.errorTips('数据异常');
		return;
	}
	var loading=showLoading();
	$ys.post('/app/Investigation/SaveMemberInvestigation',{Score:sum,Investigation:Investigation},function(data){
		loading.close();
		if(data.success){
			$ys.platform.close(function(){
				$ys.platform.open({url:'/Html/VAAD/A.html',extras:{Id:data.Id}});
			});
						
		}else{
			$.dialog.errorTips(data.msg);
		}
	});				
}	