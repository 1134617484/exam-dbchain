// 账号
let codeReg = /^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/;
// 电话
let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

// 必须为数字
let numberReg = /^\d+$|^\d+[.]?\d+$/;

// 密码
let passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/;
// let passwordReg = /^(?![\d]+$)([^\u4e00-\u9fa5\s]){6,20}$/
// 登录密码
// let LoginPasswordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/;

// 支付密码
let PayPasswordReg = /^\d{6,16}\b/;

// 联系人
let contactsReg = /^[\u0391-\uFFE5A-Za-z]+$/;

//身份证号码验证
let regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

//邮箱验证
let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

//发件人姓名，必须中文
let nameReg = /[\u4e00-\u9fa5]/gm;

//QQ验证
let qqReg = /^[1-9][0-9]{4,}$/;

//只能由英文字母组成
let enReg = /^[a-z]+$/i;

// 验证网址
let urlReg = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

//验证IP
let ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

// 验证授权服务
let accessReg = /^[a-z0-9]+$/i;
//银行卡验证
let card_number_reg = /^(\d{16}|\d{19})$/;
// 登录注册用户名
let usernameReg = /^[u4E00-u9FA5A-Za-z0-9_]{2,8}$/;

// name命名正则
let fieldNameReg = /^\s*$|^[a-z][a-z0-9_]+$/;

let FormValidate = (function () {
  function FormValidate() {}
  // From表单验证规则  可用于公用的校验部分
  FormValidate.Form = function () {
    return {
      // 账号的验证规则
      validateCode(rule, value, callback) {
        if (!value) {
          return callback(new Error("请输入账号"));
        }
        if (!codeReg.test(value)) {
          callback(new Error("账号必须为6-20位字母和数字组合"));
        } else {
          callback();
        }
      },
      // 只能中文的验证
      validateChinese(rule, value, callback) {
        if (value !== "") {
          if (!nameReg.test(value)) {
            callback(new Error("必须为中文字符"));
          } else {
            callback();
          }
        } else {
          callback("不能为空");
        }
      },
      // 只能英文的验证
      validateEnglish(rule, value, callback) {
        if (value !== "") {
          if (!enReg.test(value)) {
            callback(new Error("必须为英文字符"));
          } else {
            callback();
          }
        } else {
          callback("不能为空");
        }
      },
      // 只能数字的验证
      validateNumber(rule, value, callback) {
        if (value !== "") {
          if (!numberReg.test(value)) {
            callback(new Error("必须为数字"));
          } else {
            callback();
          }
        } else {
          callback("不能为空");
        }
      },

      // 密码的验证
      validatePsdReg(rule, value, callback) {
        if (!value) {
          return callback(new Error("请输入密码"));
        }
        if (!passwordReg.test(value)) {
          callback(new Error("请输入6-20位数字+字母组合的密码"));
        } else {
          callback();
        }
      },
      // 密码再次验证
      validateNewPsdReg(rule, value, callback) {
        //console.log(value)
        //console.log(this)
        if (value !== this.numberValidateForm.password) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
      // 支付密码验证
      validatePayPsdReg(rule, value, callback) {
        if (!value) {
          return callback(new Error("请输入密码"));
        }
        if (!PayPasswordReg.test(value)) {
          callback(new Error("请输入6-16位数字、字母的密码"));
        } else {
          callback();
        }
      },

      // 联系人
      validateContacts(rule, value, callback) {
        if (!value) {
          return callback(new Error("请输入联系人"));
        }
        if (!contactsReg.test(value)) {
          callback(new Error("联系人不可输入特殊字符"));
        } else {
          callback();
        }
      },

      // 邮箱的验证规则
      validateEmail(rule, value, callback) {
        if (value !== "") {
          if (!emailReg.test(value)) {
            callback(new Error("邮箱格式不正确"));
          } else {
            callback();
          }
        } else {
          callback(new Error("邮箱不能为空"));
        }
      },

      // 电话号码的验证
      validatePhone(rule, value, callback) {
        if (!value) {
          return callback(new Error("请输入手机号码"));
        }
        if (!phoneReg.test(value)) {
          callback(new Error("手机格式不正确"));
        } else {
          callback();
        }
      },

      // 身份证的验证规则
      ID(rule, value, callback) {
        if (!value) {
          return callback(new Error("身份证不能为空"));
        }
        if (!regId.test(value)) {
          callback(new Error("请输入正确的二代身份证号码"));
        } else {
          callback();
        }
      },

      // qq的验证规则
      validateQQ(rule, value, callback) {
        if (!value) {
          return callback(new Error("qq号码不能为空"));
        }
        if (!qqReg.test(value)) {
          callback(new Error("请输入正确的qq号码"));
        } else {
          callback();
        }
      },
      // ip的验证规则
      validateIp(rule, value, callback) {
        if (!value) {
          return callback(new Error("不能为空"));
        }
        if (!ipReg.test(value)) {
          callback(new Error("请输入正确的IP"));
        } else {
          callback();
        }
      },
      // url的验证规则
      validateUrl(rule, value, callback) {
        if (!value) {
          return callback(new Error("不能为空"));
        }
        if (!urlReg.test(value)) {
          callback(new Error("请输入正确的网址"));
        } else {
          callback();
        }
      },
      // 验证授权服务规则
      validateAccess(rule, value, callback) {
        if (!value) {
          return callback(new Error("不能为空"));
        }
        if (!accessReg.test(value)) {
          callback(new Error("只能由英文和数字组成"));
        } else {
          callback();
        }
      },
      // 银行卡号验证规则
      validateCardNum(rule, value, callback) {
        if (value !== "") {
          if (!card_number_reg.test(value)) {
            callback(new Error("银行卡号请输入16或者19位数字"));
          } else {
            callback();
          }
        } else {
          callback(new Error("银行卡不能为空"));
        }
      },
      // 开户名验证
      validateAccountName(rule, value, callback) {
        if (value !== "") {
          if (value.length < 2 || value.length > 10) {
            callback(new Error("开户名称过长或过短"));
          } else {
            callback();
          }
        } else {
          callback(new Error("支行名称"));
        }
      },
      // 银行名称验证
      validateBranchkName(rule, value, callback) {
        if (value !== "") {
          if (value.length < 5 || value.length > 30) {
            callback(new Error("支行名称过长或过短"));
          } else {
            callback();
          }
        } else {
          callback(new Error("支行名称"));
        }
      },
      // 登录/注册用户名 4-10位非中文
      validateUsername(rule, value, callback) {
        if (value !== "") {
          //console.log(usernameReg.test(value))
          if (!usernameReg.test(value)) {
            callback(new Error("用户名请输入2-8位字符"));
          } else {
            callback();
          }
        } else {
          callback(new Error("用户名不能为空"));
        }
      },
    };
  };
  // 导出当前(字段名，库名等)正则
  FormValidate.fieldNameReg = () => {
    return fieldNameReg;
  };

  return FormValidate;
})();

exports.FormValidate = FormValidate;
