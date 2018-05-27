/*
* ps: appUid:用户id  appToken:token值
*
* */
// ;(function (window) {
var app = {
    init: function () {//初始化的信息  暂时用不到
        // this.info={host:location.host};
        this.info = {is_app: true};
        if (typeof(wenriver_appInfo) == "undefined") {
            wenriver_appInfo = {host: location.origin, is_app: false};
        }
        else {
            wenriver_appInfo.is_app = true;
            if (wenriver_appInfo.sign != undefined) {
                localStorage.sign = wenriver_appInfo.sign;
            }
            localStorage.doctorId = wenriver_appInfo.doctorId;
        }
        this.info.host = wenriver_appInfo.host;
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            // this.info.host="http://mutable.tunnel.qydev.com/";//测试
            //  this.info.host="http://jed.wenriver.com/";//正式
        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
        } else //pc
        {
            this.info = {host: "/"};
        }

    },
    pop: function (data) {// 用到的  跳转
        // if (wenriver_appInfo.is_app) {
        if (data.VC_block != undefined) {
            app.VC_block = data.VC_block;
            data.VC_block = "";
        }
        data.name = "webapp/dev/" + data.name;

        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            //  location.href=data.name+".html";

            window.webkit.messageHandlers.app.postMessage({"act": "pop", "data": data});
        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
            //if(data.name)data.name="webapp/dev/"+data.name;
            app_android.pop(JSON.stringify(data));
        }
        // }
        // else //pc
        // {
        //     var href = '';
        //     if (data.name != undefined) {
        //         href = 'file:///Users/whsczl/Desktop/HealthAndroid/branches/Health520/assets/webapp/dev/' + data.name;
        //
        //     }
        //     if (data.url != undefined) {
        //         href = data.url;
        //     }
        //     window.location.href = href;
        // }
    },
    post: function (data) {//提交 post
        if (wenriver_appInfo.is_app) {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
            {
                window.webkit.messageHandlers.app.postMessage({"act": "post", "data": data});

            } else if (/(Android)/i.test(navigator.userAgent))//android
            {
                app_android.post(JSON.stringify(data));
            }
        } else //pc
        {
            appPost(data, data.method);
        }
    },
    appPost: function (postObj, act) {


    },
    close_VC: function () {//关闭当前页面  用到
        app.popVC({"name": "whsczl_app_close_vc"});
    },
    closed: function () {//回调关闭后的的操作   用到
        if (app.closed_callback != undefined) {
            app.closed_callback();
        }
    },
    block: function (data) {//回调的数据  a页面到b页面 b页面传递数据给a页面  还停留在b页面
        app.popVC({"name": "whsczl_app_blcok", "data": data});
    },
    popVC: function (data) {//ios专用 用于特地 controller 的跳转   用到的
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {

            window.webkit.messageHandlers.app.postMessage({"act": "popVC", "data": data});

        } else if (/(Android)/i.test(navigator.userAgent))//android
        {

            app_android.popVC(JSON.stringify(data));

        }

    },
    vc_block: null,
    VC_block: function (data) {
        if (app.vc_block != null) {
            app.vc_block(data);
        }
    },
    block_VC: function (data) {

        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            app.popVC({"name": "whsczl_app_blcok", 'data': data});

        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
            app_android.block_VC(JSON.stringify(data));
        }
    },
    jump_to_login_vc: function () {//跳去登录
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            app.popVC({"name": "jump_to_login_vc"});

        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
            app_android.popVC(JSON.stringify({"name": "jump_to_login_vc"}));
        }
    },
    wxPay_success_callback: function () {//微信支付回调
        if (app.callback_wxPay) {
            app.callback_wxPay();
        }
    },
    callback_wxPay: null,
    wxPay: function (data, callback, pay_platform) {//微信支付
        app.callback_wxPay = callback;
        pay_platform ? '' : pay_platform = '';
        // app.wxPay_success_callback();
        // return;

        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            if (pay_platform == 'ios_app_wx') {
                app.popVC({"name": "whsczl_app_wxpay", "data": data});
            }
            if (pay_platform == 'ios_app_alipay') {
                app.popVC({"name": "whsczl_app_alipay", "data": data});
            }

        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
            app_android.wxPay(JSON.stringify(data));
        }
    },
    viewWillAppear_callback: null,
    viewWillAppear: function (viewWillAppear_callback) {//监控回到页面时候的操作
        app.viewWillAppear_callback = viewWillAppear_callback;
        app_android.popVC(JSON.stringify({"name": "viewWillAppear_callback"}));
    },
    whsczl_app_viewWillAppear_callback: function () {//我不能用
        if (app.viewWillAppear_callback) {
            app.viewWillAppear_callback();
        }
    },
    oauthCallback: null,
    oauthToken: function (tokenData) {
        if (tokenData.token) {
            localStorage.token = tokenData.token;
        }
        if (app.oauthCallback) {
            app.oauthCallback(tokenData);
        }
    },
    getStorage: function (name) {//缓存
        return localStorage.getItem(name) || '';
    },
    setStorage: function (name, val) {
        localStorage.setItem(name, val);
    },
    cleanStorage: function (name) {
        localStorage.removeItem(name);
    },
    autoOauth: function (callback) {//用户登录
        callback ? '' : callback = function (a) {
        };
        var successfn = function (data) {
            if (data.uid == 0) {//获取用户信息失败
                app.jump_to_login_vc(); //跳转到 登录页面
            } else {
                app.setStorage('appUid', data.uid);
            }
            if (data.token) {
                app.setStorage('appToken', data.token);
            }
            callback(data);
        }
        app.oauthCallback = successfn;
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))//ios
        {
            app.popVC({"name": "whsczl_autoOauth"});
        } else if (/(Android)/i.test(navigator.userAgent))//android
        {
            app_android.autoOauth();
        }
    }
}
app.init();
// })(window);
var a = {
    "Question_score": "1",//题目分数 problem_num
    "Question_Id": "1",//题目id review_basic_problem_id
    "Question_Title": "每日膳食安排",//题目title
    "selected_options": [{
        "Option_Cause": "",//选项cause cause
        "Option_Suggest": "",//suggest
        "Option_Harm": "三餐饮食既无规律也不适量",//harm
        "Option_score": "1",//option_num
        "Option_id": "4"//id
    }]
};
