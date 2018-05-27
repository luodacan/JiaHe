//身高
var high = [];
for(var i = 145; i < 190; i++) {
	high.push(i + "cm");
}
$("#high").picker({
	container: '#picker-container',
	cols: [{
		textAlign: 'center',
		values: high
	}],
	onChange: function(p, v, dv) {
	},
	onClose: function(p, v, d) {
	}
});
//体重
var weight = [];
for(var i = 40; i < 100; i++) {
	weight.push(i);
}
var j = [];
for(var i = 0; i < 10; i++) {
	j.push(i);
}
$("#weight").picker({
	container: '#weight-container',
	cols: [{
		textAlign: 'center',
		values: weight
	}, {
		textAlign: 'center',
		values: j
	}],
	onChange: function(p, v, dv) {
		var text = v.join(".") + "Kg";
		$(".weight").text(text);
	}
});
//日期
$("#time").datetimePicker({
	container: '#time-container',
	max: new Date(),
	yearSplit: '年',
	monthSplit: '月',
	dateSplit: '日',
	//datetimeSplit:'-',
	parse: function(str) {
		var t = str.split('-');
		return t;
	},
	times: function() {},
});


//初始化swiper
var swiper = new Swiper('.swiper-container', {
	direction: 'vertical',
	slidesPerView: 1,
	spaceBetween: 0,
	swipeHandler: '.swipe-handler',			
});
//下一页
//开始吧
$('.start').click(function() {
	swiper.slideNext();
});
//性别
$('.sex').click(function() {
	$('#inp-info').data('sex',$(this).text());
	$("#sex").html($(this).text());
	if($(this).text() == '男') {
		setCookie("sex", "男","h24");
		$("#seximg").attr("src", "../../img/Register/boy.png");
	} else {
		setCookie("sex", "女","h24");
		$("#seximg").attr("src", "../../img/Register/girl.png");
	}
	swiper.slideNext();
});

//下一步
$('.nextstep').click(function() {
	$("#end-high").html($("#high").val());
	$("#end-time").html(new Date().getFullYear()*1-$("#time").val().split("年")[0]*1+"岁");
	swiper.slideNext();		
});
//结束下一页
//初始化执行
$(function() {
	setTimeout("ChangeBackground()", 50);
	ChangeBackground();
});
//全屏背景
function ChangeBackground() {
	$("#hao").css({
		"height": window.screen.availHeight,
		"background-image": "linear-gradient(to top,rgb(0,158,112), rgb(79,186,82))",
		"background-repeat": "no-repeat"
	});
}
//球
function BallBackground(Id, wh, html, size, filter) {
	$("#" + Id).css({
		"height": wh,
		"width": wh,
		"border-radius": "100%",
		"text-align": "center",
		"line-height": wh,
		"color": "white",
		"font-size": size,
		"box-shadow": "2px 2px 3px 0px rgb(79,186,82)",
		"background-image": "linear-gradient(to top,rgb(0,158,112), rgb(79,186,82))",
		"background-repeat": "no-repeat",
		"filter": "blur(" + filter + "px)",
		"-webkit-filter": "blur(" + filter + "px)"
	});
	$("#" + Id).html(html);
}
function sub()
{

	var a=$('#inp-info').data('sex'),
	b=$("#high").val().replace('cm',''),
	c=$("#time").val().replace('年','/').replace('日','').replace('月','/');
	$ys.post('/app/Member/AddMemberInfo',{
		sex:a,
		birth:c,
		height:b,
	},function(data){
		if(data.success)
		{
			$ys.platform.close(function(){
				$ys.platform.open({url:'/Html/Home/index.html'});
			});
			
		}				
	});
}