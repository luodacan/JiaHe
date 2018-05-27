//所有点击事件
$(document).ready(function(event) {
	var body = $("body");
	body.on("click", "td", function() {
		var text = (+$(this).find("div").find("span").text());
		if(text  > 0) {
			var myDate = new Date();
			var _t=myDate.getFullYear()+'-'+AppCustom.isbig10((myDate.getMonth()+1))+'-'+AppCustom.isbig10((+text));
			todayhealth(_t);
			curday(text);
		}
	});
});


//判断当前年份是否是闰年(闰年2月份有29天，平年2月份只有28天)
function isLeap(year) {
	return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
}
var html = '';
var i, k,
	today = new Date(), //获取当前日期
	y = today.getFullYear(), //获取日期中的年份
	m = today.getMonth(), //获取日期中的月份(需要注意的是：月份是从0开始计算，获取的值比正常月份的值少1)
	d = today.getDate(), //获取日期中的日(方便在建立日期表格时高亮显示当天)
	firstday = new Date(y, m, 1), //获取当月的第一天
	dayOfWeek = firstday.getDay(), //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
	days_per_month = new Array(31, 28 + isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31), //创建月份数组
	str_nums = Math.ceil((dayOfWeek + days_per_month[m]) / 7); //确定日期表格所需的行数
$(".year").html(y);
$(".month").html(m + 1);
$(".day").html(d);
html += "<table class='table'><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>"; //打印表格第一行(显示星期)

for(i = 0; i < str_nums; i += 1) { //二维数组创建日期表格
	html += '<tr>';
	for(k = 0; k < 7; k++) {
		var idx = 7 * i + k; //为每个表格创建索引,从0开始
		var date = idx - dayOfWeek + 1; //将当月的1号与星期进行匹配
		(date <= 0 || date > days_per_month[m]) ? date = '&nbsp;': date = idx - dayOfWeek + 1; //索引小于等于0或者大于月份最大值就用空表格代替
		if(date == d) {
			var dd = date;
			html += '<td style="color:red;"><div><span>' + date + '</span><div>' + LunarCalendar(y, m + 1, dd) + '</div></div></td>';
		} else {
			var dd = date;
			html += '<td><div><span>' + date + '</span><div>' + LunarCalendar(y, m + 1, dd) + '</div></div></td>';
		}
	}
	html += '</tr>';
}
html += '</table>';
$("#MyDate").append(html);

/*返回农历*/
function LunarCalendar(yyyy, MM, dd) {
	//24  气节
	var solarTerm = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
	//公历节日
	var sFtv = '{"1-1":" 元旦","2-14":"情人节", "3-8":"妇女节", "3-12":"植树节", "3-15":"消费者权益日", "4-01":"愚人节", "5-1":"劳动节", "5-4":"青年节", "5-12":"护士节", "6-1":"儿童节", "7-1":"建党节", "8-1":"建军节", "9-10":"教师节", "9-28":"孔子诞辰", "10-1":"国庆节", "10-6":"老人节", "10-24":"联合国日", "12-24":"平安夜", "12-25":"圣诞节"}';
	//农历节日
	var lFtv = '{"1-1":"春节", "1-15":"元宵节", "5-5":"端午节", "7-7":"七夕情人节", "7-15":"中元节", "8-15":"中秋节", "9-9":"重阳节", "12-8":"腊八节", "12-24":"小年","12-30":"除夕"}';
	//农历月份
	var lMon = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
	//星期几
	var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	//段位
	var dan = ["初", "十", "廿", "三十"];
	//生肖
	var cz = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
	//地支
	var earthly = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
	//天干
	var lday = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
	//数值
	var num = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
	//返回
	var rv = "";
	if(dd != "&nbsp;") {
		var result = calendar.solar2lunar(yyyy, MM, dd); //农历信息
		//气节开始
		var Integrity = getIntegrity(yyyy, MM, dd); //气节
		if(Integrity != "") {
			return Integrity;
		}
		//气节开始
		//农历开始
		var LMD = result.lMonth + "-" + result.lDay;
		var LFtv = eval('(' + lFtv + ')');
		var lmd = LFtv[LMD]; //农历
		if(lmd != "undefined" && lmd != undefined) {
			return lmd;
		}
		//农历结束
		//阳历开始
		var SMD = result.cMonth + "-" + result.cDay;
		var SFtv = eval('(' + sFtv + ')');
		var smd = SFtv[SMD]; //农历
		if(smd != "undefined" && smd != undefined) {
			return smd;
		}
		//阳历结束
		return(result.IDayCn == "初一" ? result.IMonthCn : result.IDayCn);
	}
	return rv;
}
//24气节
function getIntegrity(yyyy, mm, dd) {
	mm = mm - 1;
	var sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);
	var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
	var tmp1 = new Date((31556925974.7 * (yyyy - 1900) + sTermInfo[mm * 2 + 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
	var tmp2 = tmp1.getUTCDate();
	var solarTerms = "";
	if(tmp2 == dd)
		solarTerms = solarTerm[mm * 2 + 1];
	tmp1 = new Date((31556925974.7 * (yyyy - 1900) + sTermInfo[mm * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
	tmp2 = tmp1.getUTCDate();
	if(tmp2 == dd)
		solarTerms = solarTerm[mm * 2];
	return solarTerms;
}
//初始化执行
$(function() {
	ChangeBackground();
});
//全屏背景
function ChangeBackground() {
	$("body").css({
		"height": window.screen.availHeight,
		"background-image": "linear-gradient(to top,rgb(0,188,112), rgb(79,186,82))",
		"background-repeat": "no-repeat"
	});
}

//所有点击事件
$(document).ready(function(event) {
	var body = $("body");
	//免费色卡
	body.on("click", ".text-default", function() {
		$(this).addClass("text-main").removeClass("text-default");
	});
	body.on("click", ".text-main", function() {
		$(this).addClass("text-default").removeClass("text-main");
	});
	body.on("click", "#Cancel", function() {
		TimeClose();
	});
	body.on("click", "#Ok", function() {
		TimeClose();
	});
	body.on("click", ".add", function() {
		if($(this).data("href") == "alert") {
			Mask(0.2);
			Time();
		} else {
			location.href = $(this).data("href")
		}
	});

});
//遮罩层
function Mask(transparency) {
	var html = '';
	var css = 'overflow: hidden;position:fixed;top:0;left:0;width:100%;z-index:1000;height: 100%;background-color: rgba(0, 0, 0,' + transparency + ');';
	html += "<div class='mask' style='" + css + "'><div>";
	$("body").append(html);
}

//关闭时间
function TimeClose() {
	$(".div-mian").remove();
	$(".mask").remove();
	$("body").css("overflow", "auto");
}

function Time() {
	$("body").css("overflow", "hidden");
	var html = '';
	html += '<div class="div-mian" style="overflow: hidden;">';
	html += '<div class="vertical-container-center pad-lr10" style="overflow: hidden;">';
	html += '<div class="row row-white" style="width: 100%;">';
	html += '<div class="col-xs-12 pad-none">';
	html += '<div class="col-xs-6 text-center pad-tb10 border-r"><span class="text-main">起始时间</span></div>';
	html += '<div class="col-xs-6 text-center pad-tb10"><span class="text-main">结束时间</span></div>';
	html += '</div>';
	html += '<div class="col-xs-12 pad-none" style="height:165px;">';
	html += '<div class="col-xs-6 text-center pad-tb10 border-tb border-r">';
	html += '<div class="col-xs-4 text-center overflow-auto" style="height:140px;">';
	html += '<div>';
	for(var i = 0; i < 24; i++) {
		html += '<div>' + (i < 10 ? "0" + i : i) + '</div>';
	}
	html += '</div>';
	html += '<div>';
	for(var i = 0; i < 24; i++) {
		html += '<div>' + (i < 10 ? "0" + i : i) + '</div>';
	}
	html += '</div>';
	html += '</div>';
	html += '<div class="col-xs-4 text-center">';
	html += '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>';
	html += '</div>';
	html += '<div class="col-xs-4 text-center overflow-auto" style="height:140px;">';
	for(var i = 0; i < 60; i++) {
		html += '<div>' + (i < 10 ? "0" + i : i) + '</div>';
	}
	html += '</div>';
	html += '</div>';
	html += '<div class="col-xs-6 text-center pad-tb10 border-tb">';
	html += '<div class="col-xs-4 text-center overflow-auto" style="height:140px;">';
	for(var i = 0; i < 24; i++) {
		html += '<div>' + (i < 10 ? "0" + i : i) + '</div>';
	}
	html += '</div>';
	html += '<div class="col-xs-4 text-center">';
	html += '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>' + '<div>:</div>';
	html += '</div>';
	html += '<div class="col-xs-4 text-center overflow-auto" style="height:140px;">';
	for(var i = 0; i < 60; i++) {
		html += '<div>' + (i < 10 ? "0" + i : i) + '</div>';
	}
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="col-xs-12 pad-none">';
	html += '<div class="col-xs-6 text-center pad-tb10 border-r" Id="Cancel"><span class="text-main">取消</span></div>';
	html += '<div class="col-xs-6 text-center pad-tb10"  Id="Ok"><span class="text-main">完成</span></div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$("body").append(html);

}



$(function(){
	var myDate = new Date();
	var today=myDate.getFullYear()+'-'+AppCustom.isbig10((myDate.getMonth()+1))+'-'+AppCustom.isbig10(myDate.getDate());
	todayhealth(today);
	initrl();
});
function initrl(){
	var myDate = new Date();
	var d=myDate.getDate();
	curday(d);
}
function curday(num)
{
	$('div.cur').removeClass('cur');
	$('.table').find('span').each(function(i,e){
		if((+$(e).text())==num) $(e).closest('div').addClass('cur');					
	});
}
function todayhealth(today)
{
	$('#listtask').html('');
	$ys.post('/app/Health/HealthPage',{today:today},function(data){
		if(data.success)
		{
			var motion=data.motion,eat=data.eat,list=data.list;
			if(motion.length>0)
			{
				var arr=[];
				motion.forEach(function(v,i,a){
					arr.push(creathtml(v.Name,v.MotionTime+'分钟'+v.Calorie+'千卡'));
				});
				$('#todaymotion').html(arr.join(''));
			}else $('#todaymotion').html('');
			
			if(eat.length>0)
			{
				var arr=[];
				eat.forEach(function(v,i,a){
					arr.push(creathtml(v.Name,v.Calorie+'千卡'));
				});
				$('#eattoday').html(arr.join(''));
			}else $('#eattoday').html('');	
			
			if(list.length>0)
			{
				var arr=['<div class="col-xs-12 column"><h4 class="span-white">我的任务</h4><hr class="mar-tb5" />']
				,tmp;
				list.forEach(function(v,i,a){
					tmp='<h6 class="span-white">'+v.Suggest+(v.prog>=100?'<span class="glyphicon glyphicon-ok" style="float:right"></span>':'<span class="glyphicon glyphicon-remove" style="float:right"></span>')+'</h6>';
					arr.push(tmp)
				});
				arr.push('</div>');
				$('#listtask').append(arr.join(''));
			}
			
		}					
	});
	loadguide(today);
}
function creathtml(one,two)
{
	var tmp='<div class="row pad-tb10">'+
	'<div class="col-xs-3 text-left">'+
		one+
	'</div>'+
	'<div class="col-xs-7 text-right">'+
		'<span class="text-main">'+two+'</span>'+
	'</div>'+
	'<div class="col-xs-2 column text-right pad-r20">'+
		'<span class="glyphicon glyphicon-trash"></span>'+
	'</div>'+
'</div><div class="border-b"></div>';
	return tmp;
}


function loadguide(day)
{	
	var d={token:localStorage.getItem('appToken'),reservationTime:day};
	$.post('https://php.jk520.cc/Appajax/Otodiagnosis/my_oto_diagnosis',
	"="+JSON.stringify(d),function(data){					
			if(data.code==0&&data.data.length>0){
				var arr=['<div class="col-xs-12 column"><h4 class="span-white">我的导诊</h4><hr class="mar-tb5" />']
				,tmp;
				data.data.forEach(function(v,i,a){
					tmp='<h6 class="span-white">'+v.item_name+'</h6>';
					arr.push(tmp)
				});
				arr.push('</div>');
				$('#listtask').append(arr.join(''));
			}
	},'json');				
}
//https://php.jk520.cc/Otodiagnosis/my_oto_diagnosis {token:参数token}
//https://php.jk520.cc/Otodiagnosis/my_oto_diagnosis_detail {token:参数token,id:导诊id} 