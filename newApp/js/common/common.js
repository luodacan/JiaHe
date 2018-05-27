/**
 * Created by AllanXu on 4/7/2016.
 */
var blobalUrl = ''; //全局url
define(['../common/urlConfig'], function(urlConfig) {
	var url = urlConfig.url;
	var newUrl = urlConfig.newUrl;
	blobalUrl = url;
	var common = {
		"web_url": url,
		"ajax_url": url + 'Appajax/',
		"new_ajax": newUrl + 'api/',
		"uploadUrl": {
			'wx_accompany_index': url + 'data/upload/slide_avatar',
			'upload_url': url + 'data/upload',
			'listIcon': url + 'data/upload/DiagnosisItem',
			'wxapp_icon': url + 'data/upload/wxapp',
			'DReservation': url + 'data/upload/DReservation',
			'review': url + 'data/upload/review',
			'statics_icon': url + 'statics/images/wxapp',
		},
		"order_status": {
			'-2': '已取消',
			'-1': '已退款',
			'0': '待处理',
			'1': '待付款',
			'2': '已付款',
			'3': '已完成',
		},
		"ajax_config": {
			data: {},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登录成功；
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				console.log(errorThrown);
			}
		},
		"ajax": function(getOption) { //isNew：是否新接口
			if(getOption.isLoding == 1) {
				common.addLoading();
			}
			var option = common._isExtend(getOption.option, common.ajax_config);
			var url = '';
			getOption.isNew == 1 ? url = common.new_ajax + getOption.option.url : url = common.ajax_url + getOption.option.url;
			var id=null;
			if(getOption.isRefresh){//是否下拉刷新
				id=getOption.isRefresh.id?getOption.isRefresh.id:"#webapp";
				common.refreshInit(id,getOption.isRefresh.fn);
			}
			var oldsuccess = option.success;
			var successfn = function(data) {
				if(getOption.isLoding == 1) {
					common.delLoading();
				}
				var token = data.token;
				app.setStorage('appToken', token);
				oldsuccess(data);
				if(getOption.isRefresh){
					common.refreshEnd(id);
				}
			}
			if(app.getStorage("appToken")) {
				option.data.token = app.getStorage("appToken");
			}
			//option.data.token = "WFkyMHVOWmt2RE5SOVhseHFseDFWYUpraWRqRHd5MUFOUXdMNTJMMzM2Yz0";
			console.log(option);
			option.success = successfn;

			mui.ajax(url, option);
		},
		"_isExtend": function(a, b) {
			for(var i in b) {
				if(!a[i]) {
					a[i] = b[i];
				}

			}
			return a;
		},
		"getQueryString": function(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg); //这里返回找到正则的匹配

			if(r != null) {
				return unescape(r[2]); //这里返回对应的值

			} else {
				if(sessionStorage.wx_authorize_search) {
					var r1 = sessionStorage.wx_authorize_search.substr(1).match(reg);
					if(r1 != null) return unescape(r1[2]);
				}
			}
			return null;
		},
		"DatePicker": function(that, name, option,callBack) { //选择日期
            option ? '' : option = {};
            var dtPicker = new mui.DtPicker(option);
            callBack?'':callBack=function (selectItems) {
                that[name] = selectItems.value;
                var show=name+"Show";
                that[show]=selectItems.value;
            };
            dtPicker.show(callBack);
            that[name] ? dtPicker.setSelectedValue(that[name]) : '';
		},
        "newDatePicker": function(option) { //选择日期new
            option.option ? '' : option.option = {};
            var dtPicker = new mui.DtPicker(option.option);
            option.callBack?'':option.callBack=function (selectItems) {
                option.value[option.name] = selectItems.value;
                option.text?option.text[option.name]=selectItems.value:"";
            };
            dtPicker.show(option.callBack);
            option.text[option.name] ? dtPicker.setSelectedValue(option.text[option.name]):dtPicker.setSelectedValue(option.value[option.name]);
        },
		"PopPicker": function(that, _value, _name, option, obj) { //选择器 写的固定，到时候换
			var back = '';
			var picker = new mui.PopPicker();
			picker.setData(option);
			picker.show(function(selectItems) {
				var thats = that;
				if(obj) {
					thats = thats[obj]
				}
				thats[_value] = selectItems[0].value;
				that[_name] = selectItems[0].text;
			})
		},
        "newPopPicker": function(option) { //选择器 新的
            var name =option.name||"";
            var picker = new mui.PopPicker();
            picker.setData(option.arr);
            picker.show(function(selectItems) {
                option.value?option.value[name] = selectItems[0].value:"";
                option.text?option.text[name] = selectItems[0].text:"";
                console.log(option.value);
            })
			var _index=0;
            for(var i=0,n=option.arr.length;i<n;i++){
                console.log(option.value[name]);
                if(option.value){
                    option.value[name]==option.arr[i].value?_index=i:"";
				}
			}
            picker.pickers[0].setSelectedIndex(_index);
        },
		"popPickernum": function(n, option, fn,Selected) { //选择器  多个
			var picker = new mui.PopPicker({
				layer: n
			});
			picker.setData(option);

			var o=Selected?Selected[0]:1;
			var t=Selected?Selected[1]:1;
			picker.pickers[0].setSelectedIndex(o);
			picker.pickers[1].setSelectedIndex(t);
			picker.show(fn);
			return picker;
		},
		"allSelectShow":function (select,value) {//选择器显示vue过滤器选项字
				if(value==null||value.length<=0) return "";
				for(var i=0,n=select.length;i<n;i++){
					if(select[i].value=value){
						return select[i].text;
					}
				}
        },
		"showToast": function(option) { //提示框
			option.icon = 'toast-' + option.icon || 'success';
			option.title ? '' : option.title = '';
			var title = '<div class="' + option.icon + '"></div>' + option.title;
			common.delLoading(); //若有则先删除loading
			common.showMask();
			setTimeout(function() {
				common.closeMask();
			}, 2000);
			mui.toast(title, {
				duration: '1200ms',
				type: 'div'
			});

		},
		"confirm_config": {
			message: '是否确认',
			title: '提示',
			btnValue: ['取消', '确定'],
			callback: function() {},
		},
		"confirm": function(option) { //确定框
			var newOption = common._isExtend(option, common.confirm_config);
			// console.log(newOption);
			mui.confirm(newOption.message, newOption.title, newOption.btnValue, function(e) {
				if(e.index == 1) {
					newOption.callback();
				} else {

				}
			})
			// mui.confirm(newOption);
		},
		"muiMask": null,
		"showMask": function(callback) {
			common.muiMask = mui.createMask(callback);
			common.muiMask.show();
		},
		"closeMask": function(callback) {
			common.muiMask.close();
		},
		"timeChange":function(_value){//时间转时间戳
            return Date.parse(_value.replace(/-/g,"/"))/ 1000;//ios 需要转化成2013/12/12时间格式
		},
		"changeTime": function(date,option) { // 时间戳转时间
			if(date == '' || date == null || date == 0) {
				return '';
			}
			var newDate = new Date(parseInt(date) * 1000);

			var year = newDate.getFullYear();
			var month = common.timeFormat(newDate.getMonth() + 1);
			var day = common.timeFormat(newDate.getDate());
			var hours = common.timeFormat(newDate.getHours());
			var minutes = common.timeFormat(newDate.getMinutes());
			if(option){
				var text="";
				for(var i=0,n=option.length;i<n;i++){
					switch (option[i]){
						case "y":text=text+year;break;
						case "M":text=text+"-"+month;break;
						case "d":text=text+"-"+day;break;
						case "h":text=text+" "+hours;break;
						case "m":text=text+":"+minutes;break;
					}
				}
				return text;
			}else{
                return year + '-' + month + '-' + day + " " + hours + ":" + minutes;

            }
		},
		"timeFormat": function(n) {
			return n >= 10 ? n : '0' + n;
		},
		//保存成功页面vue组件
		"successHtml": '<div class="common-success"><div class="pic"></div><span class="success-text">{{data_text}}</span><a href="javascript:;" v-on:click="successBtn" class="success-a">{{data_btn}}</a></div>',
		//无数据的时候
		"noDataHtml": '<div class="no-data" ><span class="image"></span><span class="text" v-text="data_text||\'暂无记录\'"></span></div>',
		"addLoading": function(option) { //添加加载框
			var loading = '<img class="load-icon" src="' + common.uploadUrl.statics_icon + '/loading.gif" alt="">';
			var add_loading = document.createElement('div');
			add_loading.setAttribute('id', 'add-loading');
			add_loading.innerHTML = loading;
			document.body.appendChild(add_loading);
		},
		"delLoading": function() { //删除加载框
			var loading = document.getElementById('add-loading');
			loading ? document.body.removeChild(loading) : '';
		},
		//获取图片预览 both方式
		"getFileUrl": function(sourceId) {
			var url;
			var fileObj = document.getElementById(sourceId);
			url = document.getElementById(sourceId).value;
			if(fileObj.files) { //高级浏览器Chrome Firefox ie10以上
				url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
			} else if(navigator.userAgent.indexOf("MSIE") > -1) { //低级浏览器  ie9及以下
				alert('您使用的浏览器版本较低，可能会影响上传功能，请升级浏览器版本再操作');
				fileObj.select();
				if(navigator.userAgent.indexOf("MSIE 9") > -1) {
					fileObj.blur(); //不加上document.selection.createRange().text在ie9会拒绝访问
				}
				url = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + document.selection.createRange().text + "')";
			} else if(navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
				url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
			}
			return url;
		},
		//上传图片预览 使用base64显示
		"showFileDataName": '',
		"showFlie": function(that, el, dataName) {
			this.showFileDataName = dataName;
			// this.showFileSize=size;
			if(!el.target.files[0].size) return; //判断是否有文件数量

			var files = el.target.files;
			for(var i = 0; i < files.length; i++) { //获取files文件组传入处理
				this.fileAdd(that, files[i]);
			}

			// el.target.value = ''//清空val值，以便可以重复添加一张图片
		},
		"fileAdd": function(that, file) {
			// this.size = this.size + file.size;//总大小
			var reader = new FileReader();
			reader.vue = that;
			reader.readAsDataURL(file);
			reader.onload = function() {
				file.src = this.result;
				var imgList = common.showFileDataName;
				// that[imgList].push(file);
				that[imgList] = [file]; //先上传一张
			}
		},
		"refreshInit":function(id,fn){//下拉刷新初始化
			if(mui(id).pullRefresh()) return false;
			   mui.init({
				    pullRefresh : {
					    container:id,
					    down : {
					      style:'circle',
					      callback:fn
					    }
				  }
			});
		},
		"refreshEnd":function(id){//下拉更新结束
			mui(id).pullRefresh()?mui(id).pullRefresh().endPulldown():"";
		}
	}
	return common;
});
// 全局的一些方法
var imgError = function(that) { //错误图片
	that.src = blobalUrl + 'statics/images/wxapp/error_img.png';
	that.onerror = 'null';
}