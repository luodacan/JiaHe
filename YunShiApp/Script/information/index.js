$(function(){
	$ys.Slide('/app/Article/ArticleCate',{},$('#catelist'),function(v){
		var tmp='<div class="swiper-slide sw-tab" data-id="'+v.Id+'" onclick="loadcateArticle(this)">'+v.Name+'</div>';				
		return tmp;
	},function(){				
	var swiper2 = new Swiper('.swiper-container2', {
	slidesPerView: 5,
	spaceBetween: 50,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.next',
	},
	breakpoints: {
		1024: {
			slidesPerView: 12,
			spaceBetween: 0,
		},
		768: {
			slidesPerView: 8,
			spaceBetween: 0,
		},
		640: {
			slidesPerView: 6,
			spaceBetween: 0,
		},
		320: {
			slidesPerView: 4,
			spaceBetween: 0,
		}
	}
});
$('#catelist').show();
	});	
	$ys.Page.init({
		action:"/app/Article/ArticleByCate",
		param:{IsRecommend:true},
		sender:$('#artlist'),
		result:"result",
		Render:function(v,i){
		var item=[],itemstr='';
		v.list.forEach(function(q){
			itemstr='<div class="col-xs-4 column plr0" style="padding:0px 2px;">'+
				'<img src="'+$ys.url+q+'" class="WH" />'+
			'</div>';
			item.push(itemstr);
		});
		
		var tmp='<a href="javascript:void(0);"  onclick="pop('+v.Id+')">'+
	'<div class="row">'+
		'<div class="col-xs-12 column ">'+
			'<h4 class="Selected"><span>'+v.Title+'</span></h4>'+
		'</div>'+
		'<div class="col-xs-12 column ">'+						
			item.join('')+
		'</div>'+
		'<div class="col-xs-12 column ">'+
			'<p class="text-muted ptb2 "><span>'+$ys.timestampByService(v.t,'yyyy/MM/dd')+'</span></p>'+
		'</div>'+
	'</div>'+
'</a>'+
'<hr class="hr" />';
		return tmp;
	}
		
	});							
});
function pop(Id)
{
	var extras={Id:Id};
	$ys.platform.open({url:'/Html/VAAD/AD.html',extras:extras});
}
function LoadRecommend(sender)
{
	$('#lefttitle').text($(sender).text());
	$(sender).addClass('swcur').siblings().removeClass('swcur');
	$ys.Page.reload({
		param:{
			IsRecommend:true,
			Cate:null,
			title:$('#inp-search').val(),
		}
	});
}
function loadcateArticle(sender)
{
	$('#lefttitle').text($(sender).text());
	$(sender).addClass('swcur').siblings().removeClass('swcur');
	$ys.Page.reload({
		param:{
			IsRecommend:null,
			Cate:$(sender).data('id'),
			title:$('#inp-search').val(),
		}
	});
}
function search()
{
	$ys.Page.reload({
		param:{
			title:$('#inp-search').val(),
		}
	});
}