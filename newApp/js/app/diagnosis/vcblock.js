/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'config', 'common','app'], function (mui, Vue, config, common,app_model) {
    var thispage = new Vue({
        el: '#webapp',
        data: {
            list:[],
            picUrl:config.uploadUrl,
            slide:{},
        },
        
        methods: {
            init: function () {
               app.viewWillAppear(function(){//网页重新回来之后
                console.log("a");
                alert("a");
                });
              
            },
            autoOauth:function(){
              app.autoOauth(function(tokenData){//获取用户信息之类
                
                  if(tokenData.uid==0){
                    app.jump_to_login_vc(); //跳转到 登录页面
                   }
                   console.log(tokenData.token);
                });
            
                   console.log(localStorage.token);
            },
            pop:function(){
              app.pop({"name":"diagnosis/vcblock.html","VC_block":function(data){
			   console.log("vc_block"+data);
			   }});
            },
            block_vc:function(){
			  app.block_VC({"haha":"enen"});
			},
			wxpay:function(){
			
			var option = {
                    data: {},
                    type: 'post',
                    success: function (data) {
                    console.log(data);
                       app.wxPay(data.data,function(){
                        console.log("支付回调");
                      });
                    },
                }
               common._ajax("https://zenggs.jk520.cc/Appajax/Payall/prepay_wx_test_ios",option);
			},
            
        },
        components: {}
    });
    thispage.init();
    mui.init();
});