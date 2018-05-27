//初始化执行
$ys.platform.init(function() {
	Ball(0, 0); //初始化球				
	liMarqueeTime();
	initpage();			
}); 

function initpage()
{
	$ys.post('/app/home/index',{},function(data){
		if(data.success){
			var jd=0;
			if((+data.plannum)>0){
				jd=(((+data.score)/((+data.plannum)*100))*100).toFixed(0);
			}						
			Ball((+jd), (+jd)); 
			$('#jk_pj').text(jd+'%');
			$('#jk_zjd').text(((+data.day)/(+data.allday)*100).toFixed(0)+'%');
			$('#jk_rws').text(data.plannum);
			if(jd>50){
				$('#jk_tips').text('今天表现不错呢，明天要继续保持今天的状态哦！');
			}else{
				$('#jk_tips').text('今天状态一般，要加油哦！');
			}
			$('#jk_jz').text('健康记账 第'+data.day+'天');
			$('#planname').text(data.planname);
		}else{
			$('#jk_tips').text(data.msg);
			$('#planname').text('欢迎使用');
		}					
	});				
}
//文字滚动
function liMarqueeTime() {
	$('.dowebok').liMarquee({
		direction: 'up',
		scrollamount: 5
	});
}
var oHeight = $(document).height(); //浏览器当前的高度
$(window).resize(function() {
	if($(document).height() < oHeight) {
		$("footer").css("position", "fixed");
	} else {
		$("footer").css("position", "none");
	}
});	



var swiper1 = new Swiper('.swiper-container1', {
	spaceBetween: 30,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.button-next',
		prevEl: '.button-prev',
	},
	on: {
		slideChange: function() {
			if(this.isEnd) {
				this.navigation.$nextEl.css('display', 'none');
			} else {
				this.navigation.$nextEl.css('display', 'block');
				}
			},
		},
	});
	var swiper2 = new Swiper('.swiper-container2', {
	slidesPerView: 5,
	spaceBetween: 50,
	// init: false,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.next',
		},
		breakpoints: {
			1024: {
				slidesPerView: 8,
				spaceBetween: 0,
			},
			768: {
				slidesPerView: 6,
				spaceBetween: 0,
			},
			640: {
				slidesPerView: 5,
				spaceBetween: 0,
			},
			320: {
				slidesPerView: 4,
				spaceBetween: 0,
			}
		}
	});
	

$ys.platform.init(function(){	
	$ys.Page.init({action:"/app/Article/ArticleByCate",
		param:{IsRecommend:true},sender:$('#Articlelist'),	
		result:"result",
		Render:function(v,i){
		var item=[],itemstr='';
		v.list.forEach(function(q){
			itemstr='<div class="col-xs-4 column plr0" style="padding:0px 2px;">'+
				'<img src="'+$ys.url+q+'" class="WH" />'+
			'</div>';
			item.push(itemstr);
		});
		var tmp='<hr class="hr" />'+
'<a href="javascript:void(0);" onclick="$ys.platform.open({url:'+'\''+'/Html/VAAD/TN.html'+'\''+'})">'+
	'<div class="row">'+
		'<div class="col-xs-12 column ">'+
			'<h4 class="Selected"><span>'+v.Title+'</span></h4>'+
		'</div>'+
		'<div class="col-xs-12 column ">'+
		item.join('')+
		'</div>'+
		'<div class="col-xs-12 column ">'+
			'<p class="text-muted ptb2 ">'+$ys.timestampByService(v.t,'yyyy-MM-dd')+'</p>'+
		'</div>'+
	'</div>'+
'</a>';
		return tmp;
	},
});
	Getsearch();
	
});

function search()
{
	var val=$('#inp-search').val();
	var IsRecommend;
	if($.trim(val).length==0){
		IsRecommend=true;
	}else{
		IsRecommend=null;
	}
	$ys.Page.reload({param:{title:val,IsRecommend:IsRecommend}});
}
function setsearch(sender)
{
	$('#inp-search').val($(sender).text());
}
function Getsearch()
{
	$ys.post('/app/Home/GetSearch',{},function(data){
		if(data.success)
		{
			if($.trim(data.SearchWord).length>0)
			{
				$('#inp-search').val(data.SearchWord);
			}
			var html='';
			if($.trim(data.SearchKey).length>0)
			{
				html+='<span class="label label-pink" onclick="setsearch(this)">'+data.SearchKey+'</span>';
			}
			if($.trim(data.SearchKey1).length>0)
			{
				html+='<span class="label label-pink" onclick="setsearch(this)">'+data.SearchKey1+'</span>';
			}
			if($.trim(data.SearchKey2).length>0)
			{
				html+='<span class="label label-pink" onclick="setsearch(this)">'+data.SearchKey2+'</span>';
			}
			if($.trim(data.SearchKey3).length>0)
			{
				html+='<span class="label label-pink" onclick="setsearch(this)">'+data.SearchKey3+'</span>';
			}
			$('#tabsearch').html(html);
		}
	});
}	