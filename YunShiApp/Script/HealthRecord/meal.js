$(function(){
	GetCalorie();
	$('#h-today').text(AppCustom.getToday());				
});
function GetCalorie()
{
	$ys.post('/app/Food/MemberMeal',{},function(data){
		if(data.success){
			var info=data.info;
			ani("num1",data.eat);
			var tmp=(+info.ZcMax)+(+info.JMax)+(+info.WMax)+(+info.WcMax)-(+data.eat);
			ani("num2",tmp);
			ani("num3",data.motion);												
			$('#zc').text(info.ZcMin+'-'+info.ZcMax);
			$('#wc').text(info.WcMin+'-'+info.WcMax);
			$('#wc1').text(info.WMin+'-'+info.WMax);
			$('#jc').text(info.JMin+'-'+info.JMax);
		}else{
			$.dialog.errorTips(data.msg);
		}
	});
}
function ani(elem,num)
{
	if(num>0){
		NumAutoPlusAnimation(elem, {
				time: 1500,
				num: num,
				regulator: 50
			});
	}else{
		$('#'+elem).text(0);
	}				
}
//数字自增到某一值动画参数（目标元素,自定义配置） 
function NumAutoPlusAnimation(targetEle, options) {

	/*可以自己改造下传入的参数，按照自己的需求和喜好封装该函数*/
	//不传配置就把它绑定在相应html元素的data-xxxx属性上吧 
	options = options || {};

	var $this = document.getElementById(targetEle),
		time = options.time || $this.data('time'), //总时间--毫秒为单位 
		finalNum = options.num || $this.data('value'), //要显示的真实数值 
		regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度 

		step = finalNum / (time / regulator),
		/*每30ms增加的数值--*/
		count = 0, //计数器 
		initial = 0;

	var timer = setInterval(function() {

		count = count + step;

		if(count >= finalNum) {
			clearInterval(timer);
			count = finalNum;
		}
		//t未发生改变的话就直接返回 
		//避免调用text函数，提高DOM性能 
		var t = Math.floor(count);
		if(t == initial) return;

		initial = t;

		$this.innerHTML = initial;
	}, 30);
}