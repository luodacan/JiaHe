/**
 * Created by wj on 2017/8/10.
 */

define(['mui', 'vue', 'common','app','validate'], function (mui, Vue, common,not_app,validate) {

    var vueApp = new Vue({
        el: '#webapp',
        data: {
            hasList:'',//列表是否有数据
            userInfoList:[],//列表数据集
            hasUserInfoList:false,//判断是否刷新
            listShow:1,//显示第几page
            editUserInfo:{visitor_name:'',visitor_id_card:'',visitor_phone:''},//添加修改的用户信息
            editUserInfoConfig:{'visitor_name':['isEmpty'],'visitor_phone': ['isEmpty','isMobile'], 'visitor_id_card': ['isEmpty','isIdCard']},//验证规则
            editOrAdd:0,//添加或修改
            userInfoEditItem:'',//暂存修改的用户信息
            dataFrom: {//提交的内容用于与上一页交互
                'visitor_name':'',
                'visitor_phone':'',
                'visitor_id_card':'',
            },
            vaname: {//验证提示信息
                'visitor_name': '请输入姓名',
                'visitor_id_card': '请输入正确的就诊人身份证',
                'visitor_phone': '请输入正确的就诊人手机号',
            }
        },
        methods: {
            init: function () {
                var that=this;
                var isUserChoose = common.getQueryString('isUserChoose');
                that.isUserChoose=isUserChoose;
                var option={
                    url:'guest_info/list',
                    data:{},
                    success:function(data){
                        console.log(data);

                        if(data.code==0){
                            var list=data.data;
                            if(list.length>0){
                                that.hasList=true;
                                that.userInfoList=list;
                            }else{
                                that.hasList=false;
                            }
                            that.hasUserInfoList=true;
                        }else{
                            that.hasList=false;
                        }

                    }
                }
                if(!that.hasUserInfoList){
                    common.ajax({option:option,isNew:1,isLoding:1});
                }
                that.showPageNum(1);
            },
            userInfoDel:function(item){//删除
                var that=this;
                common.confirm({'message':"是否确认删除？",callback:function(){

                    var option = {
                        url:"guest_info/delete",
                        data:{'id':item.id},
                        success: function (data) {
                            console.log(data);
                            if(data.code==0){
                                that.hasUserInfoList=false;

                                common.showToast({'title':'删除成功', 'icon': 'success'});
                                setTimeout(function(){
                                    that.init();
                                },1000);
                            }else{
                                common.showToast({'title':data.message, 'icon': 'error'});
                            }
                        },
                    };
                    common.ajax({option:option, isLoding: 1,isNew:1});
                }});
            },
            addUserInfo:function(){//添加
                this.editOrAdd=1;
                this.editUserInfo={visitor_name:'',visitor_id_card:'',visitor_phone:''};
                this.showPageNum(2);
            },
            userInfoEdit:function(item){//编辑
                this.userInfoEditItem=item;
                var editUserInfo=this.editUserInfo;
                editUserInfo.visitor_name=item.name;
                editUserInfo.visitor_id_card=item.card_number;
                editUserInfo.visitor_phone=item.phone_number;
                this.editOrAdd=2;
                this.showPageNum(2);
            },
            oninput: function (val, obj, name) {//监控文本输入双向绑定
                this[obj][name] = val;//因v-model无法绑定动态加载的变量  所以用这种方式
            },
            editUserSave:function(type,item){//保存
                var that = this;

                var dataFrom = that.editUserInfo;
                var va_config = that.editUserInfoConfig;

                var va_back = that.validateFn(dataFrom, va_config);//验证开始

                if (!va_back) {//验证不通过
                    return false;
                }
                var url='';
                that.editOrAdd==1?url='guest_info/add':url="guest_info/edit";
                var userData={name:dataFrom['visitor_name'],phone_number:dataFrom['visitor_phone'],card_number:dataFrom['visitor_id_card']};
                if(that.editOrAdd==2){
                    userData['id']=that.userInfoEditItem.id;
                }
                var option = {
                    url:url,
                    data:userData,
                    success: function (data) {
                        console.log(data);
                        if(data.code==0){
                            that.hasUserInfoList=false;
                            if(that.editOrAdd==2){
                                that.isUserChoose='';
                                that.dataFrom['visitor_name']='';
                                that.dataFrom['visitor_phone']='';
                                that.dataFrom['visitor_id_card']='';
                            }
                            common.showToast({'title':'保存成功', 'icon': 'success'});
                            setTimeout(function(){
                                that.init();
                            },1000);
                        }else{
                            common.showToast({'title':data.message, 'icon': 'error'});
                        }
                    },
                };
                common.ajax({option:option, isLoding: 1,isNew:1});
            },
            chooseUserInfo: function (item) {
                this.isUserChoose=item.id;
                var dataFrom={};
                dataFrom['visitor_name']=item.name;
                dataFrom['visitor_id_card']=item.card_number;
                dataFrom['visitor_phone']=item.phone_number;
                app.block_VC({"previous_id":"diagnosis_order","data":{"dataFrom":dataFrom,"isUserChoose":item.id}});
                app.close_VC();
            },
            // 显示数
            showPageNum:function(num){
                this.listShow = num||1;
            },
            goBack:function(){
                app.block_VC({});
                app.close_VC();
            },
            validateFn: function (value, config) {//循环验证
                var that = this;
                var vaname = that.vaname;
                var back = true;
                errors:
                    for (var i in vaname) {
                        if (config[i] && value[i] != undefined) {
                            for (var a = 0, n = config[i].length; a < n; a++) {
                                var types = config[i][a];
                                if (!validate(types, value[i])) {
                                    common.showToast({'title': vaname[i], 'icon': 'error'});
                                    back = false;
                                    break errors;
                                }
                            }
                        }
                    }
                return back;
            },
        },
        components: {
            nodata: {
                template: common.noDataHtml,
                data: function () {
                    return {data_text: '暂无添加的就诊人'}
                }
            }
        }
    });
    app.autoOauth(vueApp.init);//获取登录信息
});
