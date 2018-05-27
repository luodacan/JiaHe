function sub(){
	var mobile =$('#username').val();
	var checkCode = $('#checkCode').val();
	var reg=/^0?(13|15|18|14|17)[0-9]{9}$/;
	if(!reg.test(mobile))
	{
		$.dialog.errorTips('手机格式不正确');					
	}else if (!checkCode)
	    $.dialog.errorTips('请填写验证码');
	else{
		var loading = showLoading('请稍候', 1);
	    var encrypt = new JSEncrypt();
	    encrypt.setPublicKey(ysapp.custom.RsaKey);
	    $ys.post('/app/member/UserMobile',{
	    	checkCode: checkCode,
	    	mobile:mobile
	    },function(data){
	    	loading.close();
	    	if(data.success){
	    		$.succeedTips('更换成功！');
	    		$ys.platform.close(function(){
	    			$ys.platform.open('/Html/User/UserManage.html');
	    		});
	    		
		    	}else{
		    		$.dialog.errorTips(data.msg);
		    	}    	
		    });
		}	
	}
	var delayTime = 60;
	var delayFlag = true;
	function countDown() {
	    delayTime--;
	    $("#sendMobileCode").attr("disabled", "disabled");
	$("#dyMobileButton").html('重新获取('+delayTime+'s)');
	if (delayTime == 1) {
	    delayTime = 60;
	    $("#dyMobileButton").html("获取短信验证码");
	    $("#sendMobileCode").removeAttr("disabled");
	        delayFlag = true;
	    } else {
	        delayFlag = false;
	        setTimeout(countDown, 1000);
	    }
	}
	
	function sendMobileCode() {
	    if ($("#sendMobileCode").attr("disabled")) {
	    return;
	}
	var mobile = $("#username").val();
	var reg = /^0?(13|15|18|14|17)[0-9]{9}$/;
	if (!mobile) {
	    $.dialog.errorTips("请输入手机号");
	    return;
	}
	if (!reg.test(mobile)) {
	    $.dialog.errorTips("手机号码格式有误，请输入正确的手机号");
	        return;
	    }
	    sendmCode(mobile);
	}
	function sendmCode(mobile) {
	    if ($("#sendMobileCode").attr("disabled") || delayFlag == false) {
	    return;
	}		
	$("#sendMobileCode").attr("disabled", "disabled");
	$ys.post("/app/member/BindSendCode?destination=" + mobile,{},
	function(result){
		if (result.success == true) {	
	        	$.dialog.succeedTips(result.msg);
	            $("#dyMobileButton").html("60秒后重新获取");		
	            setTimeout(countDown, 1000);
	            $("#sendMobileCode").attr("disabled", "disabled");
	        }else{
	        	$.dialog.errorTips(result.msg);
	        	$("#sendMobileCode").removeAttr("disabled");
	            }	    	
	    });		    
	}