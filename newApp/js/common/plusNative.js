/*h5+的native.js
 * ps: appUid:用户id  appToken:token值
 *
 * */
// ;(function (window) {
var app = {
    "init": function () {
        var title = document.title;
        console.log(title);
        title.length > 0 ? app.setNView({
            "titleNView": {
                titleText: title
            }
        }) : "";
    },
    "setNView": function (option) { //设置原生头部
        var wv = plus.webview.currentWebview();
        wv.setStyle(option);
    },

    "_isExtend": function (a, b) {
        if (!a) return false;
        for (var i in b) {
            if (!a[i]) {
                a[i] = b[i];
            }

        }
        return a;
    },
    "titleNView_config": {
        "backgroundcolor": "#c8a915",
        "titleText": "",
        "titlecolor": "#FFFFFF",
        "autoBackButton": false,
        // "buttons": []
    },
    "pop": function (data) { //跳转

        data.id ? "" : data.id = "";
        if(window.plus){
            data.name = "/newApp/" + data.name;
            data.VC_block ? "" : data.VC_block = function () {
            };
            if(data.titleNView && data.titleNView.buttons){

                var add={fontSize: '27px',fontSrc: '_www/fonts/mui.ttf',text:'\ue582',float:'left',onclick:function(){plus.webview.close(data.id);}};
                var isIn=0;
                for(var i=0,n=data.titleNView.buttons.length;i<n;i++){
                    if(data.titleNView.buttons[i].text==add.text)isIn=1;
                }
                isIn==0?data.titleNView.buttons.push(add):"";
            }else{
                data.titleNView?"":data.titleNView={};
                data.titleNView['autoBackButton']=true;
            }
            var titleNView = app._isExtend(data.titleNView, app.titleNView_config) || app.titleNView_config;

            var embed = plus.webview.open(data.name, data.id, {
                "titleNView": titleNView
            }, "slide-in-right", "");
            window.addEventListener('block_data', function (event) { //监听子页面返回数据
                data.VC_block(event.detail);
            });
            embed.onclose = function (e) { //关闭时

            };
        }else{
            data.name = "/webapp/newApp/" + data.name;
            window.location.href=data.name;
        }

    },
    "wxPay": function (statement, callback, pay_platform) {//微信支付
        var channel = null;
        plus.payment.getChannels(function (channels) {

            if (pay_platform == "ios_app_wx") {
                channel = channels[1];
            }
            if (pay_platform == "ios_app_alipay") {
                channel = channels[0];
            }
            console.log(JSON.stringify(statement));
            plus.payment.request(channel, statement, callback, function (error) {
            	console.log(JSON.stringify(error));
                plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
            });
        }, function (e) {
            console("获取支付通道失败：" + e.message);
        });

    },
    "close_VC": function () { //关闭当前页面  用到
    		if(window.plus){
    			 var ws = plus.webview.currentWebview();
        		plus.webview.close(ws, "slide-out-left");
    		}else{
    			 history.go(-1);
    		}
    },
    "block_VC": function (data) {
    		if(window.plus){
    			 var previous = plus.webview.getWebviewById(data.previous_id);
        		mui.fire(previous, 'block_data', data.data);
    		}
       
    },
    "getStorage": function (name) { //缓存
        return localStorage.getItem(name) || '';
    },
    "setStorage": function (name, val) {
        localStorage.setItem(name, val);
    },
    "cleanStorage": function (name) {
        localStorage.removeItem(name);
    },
    "autoOauth": function (callback) { //获取登录信息

        callback ? callback() : "";
    },
    "toWeb":function(url){//跳转外链接
        if(window.plus){
            plus.webview.open(url);
        }else{
            window.location.href=url;
        }
    },

}
if (window.plus) {
    app.init();
} else {
    document.addEventListener('plusready', app.init, false);
}
// })(window);