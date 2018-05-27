$(".Ball").height($(".Ball").width() - 50);
$(".Ball").width($(".Ball").height());

function Ball(rangeValue, rangeValueok) {
	var canvas = document.getElementById('layer1');
	var ctx = canvas.getContext('2d');

	//range控件信息
	var rangeValue = rangeValue; //值
	var nowRange = 0,
		nowRangeok = 0; //用于做一个临时的range

	var point = rangeValue.toFixed(1).toString().split(".")[1];

	//画布属性
	var tScale = window.devicePixelRatio,
		tWidth = $(".Ball").width(),
		tHeight = $(".Ball").width();
	canvas.style.width = tWidth + "px";
	canvas.style.height = tHeight + "px";
	canvas.width = tWidth * tScale;
	canvas.height = tHeight * tScale;

	var mW = tWidth;
	var mH = tHeight;
	//	ctx.scale(2, 2);
	mW = mW / 1;
	mH = mH / 1;
	var line = 0;
	//圆属性
	var r = mH / 2; //圆心
	var cR = r - 0 * 2; //圆半径
	//Sin 曲线属性
	var sX = 0;
	var sY = mH / 2;
	var axisLength = mW; //轴长
	var waveWidth = 0.018; //波浪宽度,数越小越宽    
	var waveHeight = 9; //波浪高度,数越大越高
	var speed = 0.059; //波浪速度，数越大速度越快
	var xOffset = 0; //波浪x偏移量

	var color = [
		"rgb(120,200,130)", "rgb(196,187,175)",
		"rgb(255,255,255)", "rgb(196,187,175)",
		"rgb(71,179,77)", "rgb(150,210,160)"
	]; //颜色
	var lineWidth = [2, 2, 2, 2, 5, 1]; //宽度
	//画圈函数
	var IsdrawCircled = false;
	var drawCircle = function() {
			var li = 10;
			for(var i = 0; i < color.length; i++) {
				ctx.beginPath(); //开始绘画
				ctx.lineWidth = lineWidth[i]; //线条的宽度
				ctx.strokeStyle = color[i]; //边框颜色
				ctx.arc(r, r, r - li, 0, 2 * Math.PI, false);
				li += lineWidth[i];
				//				ctx.scale(1, 1);
				//1：圆的中心的 x 坐标。
				//2：圆的中心的 y 坐标。
				//3：圆的半径，起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
				//4：结束角，以弧度计。
				//5：可选。规定应该逆时针还是顺时针绘图。false = 顺时针，true = 逆时针。
				//6：Math.PI=3.14
				ctx.stroke(); //保存
			}
			line = li;
			ctx.beginPath();
			ctx.arc(r, r, cR - li + 1, 0, 2 * Math.PI);
			ctx.clip();
		}
		//画sin 曲线函数
	var drawSin = function(xOffset) {
		var grd = ctx.createRadialGradient((mW / 2), mW / 2, 0, (mW / 2), (mW / 2), (mW / 2));
		//1:渐变的开始圆的 x 坐标
		//2:渐变的开始圆的 y 坐标
		//3:开始圆的半径
		//4:渐变的结束圆的 x 坐标
		//5:渐变的结束圆的 y 坐标
		//6:结束圆的半径
		grd.addColorStop(0, "rgb(70,180,80)");
		grd.addColorStop(1, "rgb(120,200,130)");
		ctx.fillStyle = grd;
		ctx.strokeStyle = 'transparent'; //边框颜色
		ctx.arc(r, r, mW, 0, 2 * Math.PI, false);
		ctx.fillRect(0, 0, mW, mW);

		//浪
		var colorwave = ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.25)"];
		for(var j = 0; j < 3; j++) {
			ctx.save();
			var points = []; //用于存放绘制Sin曲线的点
			ctx.beginPath();
			//在整个轴长上取点
			for(var x = sX; x < sX + axisLength; x += 20 / axisLength) {
				//此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
				var y = -Math.sin((sX + x) * waveWidth + xOffset) * (j + 1);
				var dY = mH * (1 - nowRange / 100);
				points.push([x, dY + y * waveHeight]);
				ctx.lineTo(x, dY + y * waveHeight);
			}

			ctx.shadowColor = "transparent";
			ctx.shadowBlur = 5;
			ctx.scale(1, 1);
			//封闭路径
			ctx.lineTo(axisLength, mH);
			ctx.lineTo(sX, mH);
			ctx.lineTo(points[0][0], points[0][1]);
			ctx.fillStyle = colorwave[j];
			ctx.fill();
			ctx.restore();
		}
	};
	//写百分比文本函数
	var drawText = function() {
		ctx.save();
		var size = 0.4 * cR;
		ctx.font = size + 'px 微软雅黑';
		ctx.textAlign = 'center';
		if(rangeValue > 30) {
			ctx.fillStyle = "rgba(73, 163, 82, 1)";
		} else {
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
		}
		ctx.fillText(nowRange + "." + point, r, r * 1.5);

		var size = 0.7 * cR;
		ctx.font = size + 'px 微软雅黑';
		ctx.textAlign = 'center';
		if(rangeValue > 75) {
			ctx.fillStyle = "rgba(73, 163, 82, 1)";
		} else {
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
		}

		ctx.fillText("H", r, r - line * 0.75);
		ctx.restore();
	};
	//进度条
	var progress = function() {
			var canvas = document.getElementById('layer2');
			var ctx = canvas.getContext('2d');
			//画布属性
			var tScale = window.devicePixelRatio,
				tWidth = $(".Ball").width(),
				tHeight = $(".Ball").width();
			canvas.style.width = tWidth + "px";
			canvas.style.height = tHeight + "px";
			canvas.width = tWidth;
			canvas.height = tHeight;

			ctx.beginPath(); //开始绘画
			ctx.lineWidth = 5; //线条的宽度
			ctx.strokeStyle = "rgb(9,239,9)"; //边框颜色
			ctx.arc(r, r, r - 12, (Math.PI / 180 * 270), Math.PI / 180 * (360 / 100 * nowRangeok + 270));
			//ctx.scale(1, 1);
			//1：圆的中心的 x 坐标。
			//2：圆的中心的 y 坐标。
			//3：圆的半径，起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
			//4：结束角，以弧度计。
			//5：可选。规定应该逆时针还是顺时针绘图。false = 顺时针，true = 逆时针。
			//6：Math.PI=3.14
			ctx.stroke(); //保存
		}
		//球
	var progressball = function() {
			var canvas = document.getElementById('layer3');
			var ctx = canvas.getContext('2d');
			//画布属性
			var tScale = window.devicePixelRatio,
				tWidth = $(".Ball").width(),
				tHeight = $(".Ball").width();
			canvas.style.width = tWidth + "px";
			canvas.style.height = tHeight + "px";
			canvas.width = tWidth;
			canvas.height = tHeight;
			//			ctx.clearRect(0, 0, tWidth, tHeight);
			var r = (tWidth) / 2;
			ctx.save(); //将当前以左上角坐标为(0,0)的上下文环境进行保存，这样是为了在接下来中要进行画布偏移后，可以进行还原当前的环境
			ctx.translate(r, r);
			ctx.rotate((360 / 100 * nowRangeok + 180) * 1 * Math.PI / 180); //设定每次旋转的度数
			ctx.fillStyle = "rgb(9,239,9)";
			ctx.beginPath();
			ctx.arc(0, r-15, 15, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
			ctx.restore(); //将当前为(500,400)的点还原为（0,0）,其实在save中就是将上下文环境保存到栈中，在restore下面对其进行还原
		}
		//加
	var render = function() {
		ctx.clearRect(0, 0, mW, mH);

		if(IsdrawCircled == false) {
			drawCircle();
		}

		if(nowRange <= rangeValue) {
			var tmp = 1;
			nowRange += tmp;
		}

		if(nowRange > rangeValue) {
			var tmp = 1;
			nowRange -= tmp;
		}

		drawSin(xOffset);
		drawText();
		progress();
		progressball();
		xOffset += speed;
		requestAnimationFrame(render);
	}
	render();
	var renderok = function() {
		if(nowRangeok <= rangeValueok) {
			var tmp = 1;
			nowRangeok += tmp;
		}

		if(nowRangeok > rangeValueok) {
			var tmp = 1;
			nowRangeok -= tmp;
		}

		progress();
		progressball();
		requestAnimationFrame(renderok);
	}
	renderok();
}
var index = 0;
var draw = function() {
	var canvas = document.getElementById('layer1');
	var ctx = canvas.getContext('2d');
	var mW = canvas.width = $(".Ball").width();
	var mH = canvas.height = $(".Ball").height();
	mW = mW / 1;
	mH = mH / 1;
	var r = mH / 2; //圆心
	index++;
	if(index > 360) {
		index = 0;
	}
	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.arc(r, r, r - 10, (Math.PI / 180 * 270), Math.PI / 180 * (index + 270));
	//1：圆的中心的 x 坐标。
	//2：圆的中心的 y 坐标。
	//3：圆的半径，起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
	//4：结束角，以弧度计。
	//5：可选。规定应该逆时针还是顺时针绘图。false = 顺时针，true = 逆时针。
	//6：Math.PI=3.14
	ctx.strokeStyle = "rgb(9,239,9)";
	ctx.stroke();
}
setInterval(function() {
	draw();
}, 10000 / 360);