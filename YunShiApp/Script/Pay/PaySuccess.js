$ys.platform.init(function(){
	var plus=$ys.platform.QueryString('plus');
	if(plus=='alipayplugin'){
		$('.pay_bg').addClass('alibg');
		$('.btnsucc').addClass('alicol');
		$('.pay_content').show();
	}else if(plus=='wxpayplugin'){
		$('.pay_bg').addClass('wxbg');
		$('.btnsucc').addClass('wxcol');
		$('.pay_content').show();
	}
});
function payend()
{
	$ys.platform.close(function(){
		$ys.platform.open({url:'/Html/Home/index.html'});
	});
	
}
