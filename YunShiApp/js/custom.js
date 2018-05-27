var ysapp={
		custom:{
			url:'http://yl.fsslpc.com',//'http://localhost:62162',	
			IsApp:function(){//true为APP
				return !(navigator.userAgent.indexOf("Html5Plus")<0);
			},
			IsInt:function(num){
				var reg=/^\+?[1-9][0-9]*$/;
				return reg.test(num);
			},
			join:function(list,separator,elem){
				var arr=[];
				var result;	
				list.forEach(function(v,i,a){
					arr.push(v[elem]);
				});
				result=arr.join(separator);		
				return result;
			},
			IsFloat:function(num){
				var reg=/^[0-9]+([.]{1}[0-9]{1,10})?$/;
				return reg.test(num);
			},
			DateToday:function(){
				return this.now('yyyy/MM/dd');	
			},
			getToday:function(){
				return this.now('MM月dd日');				
			},
			now:function(format){
				var myDate = new Date();
				return this.timeFormat(myDate,format); 
			},
			timestampByService:function (timestamp,format)
			{
			     timestamp = timestamp.replace(/\/Date\((\d+)\)\//gi, "$1");
			     var odate = new Date();
			     odate.setTime(timestamp);
			     return this.timeformat(odate,format);					   
			},
			timeformat:function(_Date,format){
				var m = _Date.getMonth() + 1;
			     m = m < 10 ? ('0' + m) : m;
			     var d = _Date.getDate();
			     d = d < 10 ? ('0' + d) : d;
			     var h = _Date.getHours();
			     h = h < 10 ? ('0' + h) : h;
			     var minute = _Date.getMinutes();
			     var second = _Date.getSeconds();
			     minute = minute < 10 ? ('0' + minute) : minute;
			     second = second < 10 ? ('0' + second) : second;
			     
			    format=format.replace('yyyy',_Date.getFullYear());
				format=format.replace('MM',m);
				format=format.replace('dd',d);
				format=format.replace('HH',h);
				format=format.replace('mm',minute);
				format=format.replace('ss',second);
			    return format;
			},
			LoginFlag:true,
			post:function(action,param,callback){
				param.token=localStorage.getItem('appToken');
				var isapp=this.IsApp();
				var _this=this;
				$.post(this.url+action,param,function(data){
					callback(data);	
					if(!data.success&&data.msg=='请登录！'&&_this.LoginFlag)
					{
						_this.LoginFlag=false;
						if(isapp){			
							ysapp.app.open({url:'/Login.html'});
							var wvs=plus.webview.all();						
							for(var i=0;i<wvs.length;i++)
							{
								var now=wvs[i];	
								if(now.id.indexOf('Login.html')>0)
									continue;
								plus.webview.close(now);
							}		
						}else{
							ysapp.web.open({url:'/Login.html'});
						}
					}
				},'json');				
			},
			Slide:function(action,param,sender,sucallback,callback,facallback){
					this.post(action,param,function(data){
					if(data.success){
						var list=data.result;
						var html=[];
						var tmp='';
						if(list.length>0) {
							list.forEach(function(v,i,a){
								tmp=sucallback(v,i);
								html.push(tmp);
							});
							sender.append(html.join(''));
						}
					}else{			
						if(typeof(facallback)=='function') facallback(data.msg);
					}
					if(typeof(callback)=='function') callback(data);
				});
			},
			Page:{
				enable:true,
				param:{pageSize:10,pageNo:1},
				action:'',
				sender:{},
				result:'',
				Render:function(){},
				init:function(opt){
					this.action=opt.action||'';
					this.sender=opt.sender||{};
					this.result=opt.result||'';
					this.Render=opt.Render||function(){};
					$.extend(this.param,opt.param);
					this.bind();
					},
				reload:function(opt){
					$.extend(this.param,opt.param);
					this.param.pageNo=1;
					this.enable=true;
					this.sender.empty();
					this.Load();					
				},
				bind:function()
				{
					var obj=this;
					$(window).scroll(function () {
				    var scrollTop = $(this).scrollTop();
				    var scrollHeight = $(document).height();
				    var windowHeight = $(this).height();
				    if (scrollTop + windowHeight >= scrollHeight) {
				        if (!obj.enable) return;
				         ++obj.param.pageNo; 
				         obj.Load();
				    }
					});
					obj.Load();
				},
				Load:function()
				{
					var obj=this;
					obj.enable=false;		
					ysapp.custom.post(obj.action,obj.param,function(data){
						if(data.success)
						{										
							var list=data[obj.result],
								html=[],
								tmp='';
							list.forEach(function(v,i,a){
									tmp=obj.Render(v,i);
									html.push(tmp);
								});
								obj.sender.append(html.join(''));
							if(list.length<obj.param.pageSize)
							{
								$('.Pageload').hide();
							
							}else{
								obj.enable=true;
								
							}
						}
					});
				},
				
			},
		},
		app:{
			init:function(callback){
				document.addEventListener('plusready',function(){
					callback();
				},false);
			},
			path:'/YunShiApp',
			creatwindow:function(opt){
				var wid=opt.id?opt.id:opt.url.replace('/','-');	
				var w=plus.webview.create(opt.url,wid,{},opt.extras||{});
				w.show('slide-in-right');
			},
			open:function(opt){
				opt.url=this.path+opt.url;
				opt.id=opt.id?opt.id:opt.url.replace('/','-');
				var _view=plus.webview.getWebviewById(opt.id);
				if(_view) _view.show('slide-in-right');
				else this.creatwindow(opt);					
			},
			QueryString:function(name){	
			var currentView = plus.webview.currentWebview();
				return (currentView[name]?currentView[name]:'')
			},
			close:function(callback){
				var v=plus.webview.currentWebview();
				if(callback) callback();
				plus.webview.close(v);
			},
			back:function(){
				var webview = plus.webview.currentWebview();
				plus.webview.close(webview,'slide-out-right');
			},
			
		},
		web:{
			init:function(callback){
				$(function(){
					callback();
				});
			},
			path:'/webapp/YunShiApp',
			open:function(opt){
				var param='';
				if(opt.extras){
					var arr=[];
					for(var i in opt.extras){
						arr.push(i+'='+opt.extras[i]);
					}
					param='?'+arr.join('&');
				}
				window.location.href=this.path+opt.url+param;
			},
			QueryString:function(name){
				var AllVars = window.location.search.substring(1);
			    var Vars = AllVars.split("&");
			    for (i = 0; i < Vars.length; i++) {
			        var Var = Vars[i].split("=");
			        if (Var[0] == name) return Var[1];
			    }
			    return "";
			},
			close:function(callback){				
				if(callback) callback();			
			},
			back:function(){
				window.history.go(-1);
			},
			
		},
};
var $ys=ysapp.custom;
	$ys.platform=(ysapp.custom.IsApp()?ysapp.app:ysapp.web);



	document.addEventListener('plusready', function() {
		var first = null;   
        plus.key.addEventListener('backbutton', function() {  
        	var len=plus.webview.all().length;	        
        	if(len>1) 
        	{	        		
                $ys.platform.back();            
            } 
            else
            {
	        	if (!first) 
	        	{
	                first = new Date().getTime();               
	                setTimeout(function() {
	                    first = null;
	                }, 1000);
	                plus.nativeUI.toast('再按一次退出应用');
	            } 
	            else
	            {
	                if (new Date().getTime() - first < 1500) {
	                    plus.runtime.quit();
	                }
	            }
       		}             	          
        });
    });


AppCustom=new Object();
AppCustom.QueryString=function(name) {
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (i = 0; i < Vars.length; i++) {
        var Var = Vars[i].split("=");
        if (Var[0] == name) return Var[1];
    }
    return "";
};
AppCustom.IsInt=function(num){
	var reg=/^\+?[1-9][0-9]*$/;
	return reg.test(num);
}
AppCustom.join=function(list,separator,elem)
{
	var arr=[];
	var result;	
	list.forEach(function(v,i,a){
		arr.push(v[elem]);
	});
	result=arr.join(separator);		
	return result;
}
AppCustom.IsFloat=function(num){
	var reg=/^[0-9]+([.]{1}[0-9]{1,10})?$/;
	return reg.test(num);
}
AppCustom.getToday=function()
{
	var myDate = new Date();
	//return myDate.getFullYear()+'.'+AppCustom.isbig10((myDate.getMonth()+1))+'.'+AppCustom.isbig10(myDate.getDate());	
	return (myDate.getMonth()+1)+'月'+AppCustom.isbig10(myDate.getDate())+'日';
}
AppCustom.DateToday=function()
{
	var myDate = new Date();
	return myDate.getFullYear()+'/'+AppCustom.isbig10((myDate.getMonth()+1))+'/'+AppCustom.isbig10(myDate.getDate());
}
AppCustom.isbig10=function(m)
 {
 	if(m>0&&m<10) return '0'+m;
 	else return m;
 }



