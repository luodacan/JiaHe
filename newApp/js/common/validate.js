/**
 * Created by Wenwu on 7/19/2016.
 */
define(function (validate) {
    var validate = function (fn, value) {
        console.log(fn);
        return validateFn[fn](value);
    }

    var validateFn = {
        isEmpty: function (value) {
            return (value.toString().length > 0);
        },
        // 手机号码验证
        isMobile: function (value) {
            var length = value.length;
            if (value.toString().length > 0){
                var mobile = new RegExp(/^(((13[0-9]{1})|(15[0-35-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
                var tel = new RegExp(/^(\d{3,4}-?)?\d{7,9}$/g);
                return tel.test(value) || (length == 11 && mobile.test(value));
            }else{
                return true;
            }

        },
        isEmail: function (value) {
            var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return reg.test(value);
        },
        isIdCard: function (idcard){//身份证
            if (idcard.toString().length > 0) {

                var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
                var idcard, Y, JYM, ereg;
                var S, M;
                var idcard_array = new Array();
                idcard_array = idcard.split("");
                //地区检验
                if (area[parseInt(idcard.substr(0, 2))] == null) return false;
                //身份号码位数及格式检验
                switch (idcard.length) {
                    case 15:
                        if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                        }
                        if (ereg.test(idcard)) return true;
                        else return false;
                        break;
                    case 18:
                        //18位身份号码检测
                        //出生日期的合法性检查
                        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                        if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                        } else {
                            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                        }
                        if (ereg.test(idcard)) {//测试出生日期的合法性
                            //计算校验位
                            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                                + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                                + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                                + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                                + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                                + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                                + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                                + parseInt(idcard_array[7]) * 1
                                + parseInt(idcard_array[8]) * 6
                                + parseInt(idcard_array[9]) * 3;
                            Y = S % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1);//判断校验位
                            if (M == idcard_array[17]) return true; //检测ID的校验位
                            else return false;
                        }
                        else return false;
                        break;
                    default:
                        return false;
                        break;
                }
                return true;
            }else{
                return true;
            }

        }
    }
    return validate;
});