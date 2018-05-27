var orderId;
var Alipayplus,Wxpayplus;
$ys.platform.init(function(){			
	orderId=$ys.platform.QueryString('orderid');
	GetPayOrder(orderId);
	plus.payment.getChannels( function(s){					
		s.forEach(function(v,i,a){
			if(v.id=="alipay"){
				Alipayplus=v;
				$('#alipayplugin').show();
			}else if(v.id=="wxpay"){
				Wxpayplus=v;
				$('#wxpayplugin').show();
			}
		});
	}, function(e){
		alert( "获取支付通道列表失败："+e.message );
	});
});
function GetPayOrder(order){
	if(!order) return;
	$ys.post('/app/orders/payorder',{orderId:order},function(data){
		if(data.success){
			var info=data.info;
			$('#visitor').text(info.visitor);
			$('#product').text(info.product);
			$('#price').text('¥ '+info.price);
		}else{
			$.dialog.errorTips(data.msg);
		}				
	});				
}			
function changepay(sender)
{
	var obj=$(sender);
	var icon='<i class="glyphicon glyphicon-ok payflag" ></i>';
	if(!obj.hasClass('cur'))
		obj.addClass('cur').append(icon).siblings().removeClass('cur').find('.payflag').remove();
}
function pay()
{
	if(!orderId) {
		$.dialog.errorTips('订单不正确');
		return;
	}
	var now=$('div.cur').first();				
	var paytype=now.data('id');
	if(!paytype) {
		$.dialog.errorTips('请选择支付方式');
		return;
	}
	var loading=showLoading();
	$ys.post('/app/Payment/Get',{PayPlugs:paytype,orderId:orderId},
	function(data){
		loading.close();
		if(data.success){
			if(paytype=="alipayplugin"&&Alipayplus){
				requestPay(Alipayplus,data.result,paytype);
			}else if(paytype=="wxpayplugin"&&Wxpayplus){
				requestPay(Wxpayplus,JSON.parse(data.result),paytype);
			}else{
				$.dialog.alertTips('支付失败，请稍后再试！');
			}
		}else{
			$.dialog.errorTips(data.msg);
		}
	});
}
function requestPay(c,statement,t){			
		plus.payment.request(c, statement, function(){
			$.dialog.succeedTips("支付操作成功！");
			
			$ys.platform.open({url:'/Html/Pay/Paysuccess.html',extras:{plus:t}});
		}, function(e){
			$.dialog.errorTips("支付失败："+e.message);
		} );
	}