var auths=null,wxauths,qqauths;
			
document.addEventListener( "plusready", function(){
		plus.oauth.getServices(function(services){
			if(services.length>0){
				auths = services;
				loadlogin();
			}			
		}, function(e){
			alert( "获取分享服务列表失败："+e.message+" - "+e.code );
		});
}, false );

$(function(){
	$ys.post('/app/Member/GetMemberInfo',{},function(data){
		if(data.success)
		{
			$('#sp-mobile').text(data.mobile);
			var qqflag=false,wxflag=false;
			if(data.oauth.length>0)
			{
				var qqflag=false,wxflag=false;
				data.oauth.forEach(function(v,i,a){
					if(v=='qq'&&!qqflag){
						qqflag=true;
						$('#sp-bindqq').text('解绑');
					}else if(v=='wechat'&&!wxflag){
						wxflag=true;
						$('#sp-bindwx').text('解绑');
					}
				});							
			}
			$('#bindwx').bind('click',function(){
				bindoauth("wechat",wxflag);
			});						
			$('#bindqq').bind('click',function(){
				bindoauth("qq",qqflag);
			});
		}else{
			$.dialog.errorTips(data.msg);
		}
	});
});	
function bindoauth(oauthname,Isbind)//isbind false绑定 true解绑
{
	if(Isbind)
	{
		$.dialog.confirm('确认解除绑定'+(oauthname=='qq'?'QQ':'微信')+'？',function(){
			$ys.post('/app/member/unbind',{oauth:oauthname},function(data){
				if(data.success){
					$.dialog.succeedTips('解绑成功');
					changebind(oauthname,false);
				}else{
					$.dialog.errorTips(data.msg);
				}						
			});						
		});
	}
	else
	{
		var objoauth=(oauthname=='qq'?qqauths:wxauths);
		if(objoauth)
		{
			if(!objoauth.authResult)
			{
				objoauth.login(function(e){
					var userinfo= e.target.userInfo;
					var ofrom=(oauthname=='qq'?'qq':'wechat');
					var oopenid=(oauthname=='qq'?e.target.authResult.openid:e.target.userInfo.openid);
					var userinfo= e.target.userInfo;
					var unionid= (userinfo.unionid?userinfo.unionid:'');
					saveauth(ofrom,oopenid,unionid,userinfo.headimgurl,'',userinfo.nickname,function(){								
						authLogout(objoauth);
					},function(){
						changebind(oauthname,true);
					});
					}, function(e){
					$.dialog.errorTips( "登录认证失败！" );
				} );
			}else{
				authLogout(objoauth);
			}
		}else{
			$.dialog.errorTips('绑定失败');
		}					
	}
}		
function saveauth(oauthId,openId,unionId,Icon,appid,nickname,callback,successcallback)
{
	var loading=showLoading();
	$ys.post('/app/member/OauthBind',{oauthId:oauthId,openId:openId,unionId:unionId,Icon:Icon,appid:appid,nickname:nickname},
	function(data){
		loading.close();
		callback();
		if(data.success){
			successcallback();
			$.dialog.succeedTips('绑定成功');					
		}else{
			$.dialog.errorTips(data.msg);
		}
	});
}
function changebind(oauthname,Isbind)
{
	var tmp=(Isbind?'解绑':'未绑定');
	if(oauthname=='qq'){
		$('#sp-bindqq').text(tmp);					
		$('#bindqq').unbind('click').bind('click',function(){
			bindoauth("qq",Isbind);
		});
	}else if(oauthname=='wechat'){
		$('#sp-bindwx').text(tmp);
		$('#bindwx').unbind('click').bind('click',function(){
			bindoauth("wechat",Isbind);
		});	
	}
}
function loadlogin()
{
	for(var i in auths)
	{
		var item=auths[i];
		if(item.id=="weixin")
		{						
			wxauths=item;
		}else if(item.id=="qq")
		{							
			qqauths=item;
		}
	}
}
function authLogout(auth)
{
	if(auth.authResult)
	{
		auth.logout(function(e){
			
		}, function(e){
			$.dialog.errorTips( "注销登录认证失败！" );
		});					
	}				
}