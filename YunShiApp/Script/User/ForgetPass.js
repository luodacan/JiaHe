function sub(){
	var mobile =$('#username').val();
	var password = $.trim($('#password').val());
	var repeatPassword = $.trim($('#repeatPassword').val());
	var checkCode = $('#checkCode').val();
	var reg=/^0?(13|15|18|14|17)[0-9]{9}$/;
	if(!reg.test(mobile))
	{
		$.dialog.errorTips('手机格式不正确');					
	}else if(!password)
		$.dialog.errorTips('请输入密码');
	else if(password.length < 6 && password.length > 20)
	    $.dialog.errorTips('密码必须6-20位字符');
	else if (!repeatPassword)
	    $.dialog.errorTips('请再次输入密码');
	else if (password != repeatPassword)
	    $.dialog.errorTips('两次密码不一致');
	else if (!checkCode)
	    $.dialog.errorTips('请填写验证码');
	else{
		var loading = showLoading('请稍候', 1);
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(ysapp.custom.RsaKey);
	$.post($ys.url +'/app/login/Resetpass',
	{
	    username: encrypt.encrypt(mobile),
	    password: encrypt.encrypt(password),
	    checkCode: checkCode,
	},
	function (result) {
	    loading.close();
	    if (result.success) {
	        $.dialog.succeedTips('修改成功!', function () {
	            $('.backicon').click();
	        });
	    }
	    else
	        $.dialog.alert('修改失败!' + result.msg);
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
	$.post($ys.url +"/app/Login/ForgetPassSendCode?destination=" + mobile,{},
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
	},'json');		    
	}