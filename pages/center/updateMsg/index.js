// pages/center/login/login.js
const util = require('../../../utils/util.js');
Page({
    data: {
        passward: "",        // 用户名
        phone: "",    // 手机
        code: "",
        isDisabled: false,   // 发送按钮禁止
        codeButtonOn: false,
        codeTime: 60,
    },
    bindInput: function (e) {   // 输入框输入
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })
    },
    sendCode: function (e) {    // 发送验证码
        if (!this.data.phone) {
            this.alert("请输入手机号")
            return false;
        }
        var phoneReg = /^1\d{10}$/;
        if (!phoneReg.test(this.data.phone)) {
            this.alert("手机号格式错误！");
            return false;
        }
        
        if (!this.data.isDisabled) {
            var that = this;
            var params = new Object();
            var url = "/getVerificationCodeForForgetPwd.ashx"
            params.Mobile = that.data.phone;
            util.POST({
                url: url,
                params: JSON.stringify(params),
                success: function (res) {
                    var oData = res.data[0];
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000
                    })
                    
                    if (oData.Status == 201) {
                        wx.showToast({
                            icon: 'none',
                            title: oData.Msg,
                            duration: 1000
                        })
                        that.setData({
                            ['isDisabled']: true
                        })
                    }
                    
                    // if (oData.Status == 200) {
                        var time = that.data.codeTime
                        that.setData({
                            ['isDisabled']: true,
                            ['codeButtonOn']: 1
                        })
                        var timer = setInterval(function () {
                            time--;
                            that.setData({
                                ['codeTime']: time
                            })
                            
                            if (time <= 0) {
                                clearInterval(timer);
                                that.setData({
                                    ['isDisabled']: false
                                })
                                that.setData({
                                    ['codeButtonOn']: 0
                                })
                            }
                        }, 1E3)
                    // }
                }
            })
            
        }
    },
    save: function () {
        var passward = this.data.passward;
        var phone = this.data.phone;
        var code = this.data.code;
        
        if (!phone) {
            this.alert("请输入手机号")
            return false;
        }
        var phoneReg = /^1\d{10}$/;
        if (!phoneReg.test(this.data.phone)) {
            this.alert("手机号格式错误！");
            return false;
        }
        if (!code) {
            this.alert("请输入验证码")
            return false;
        }
        if (!passward) {
            this.alert("请输入密码")
            return false;
        }
        var params = {};
        var url = ""
        params.passward = that.data.passward;
        params.phone = that.data.phone;
        params.code = that.data.code;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0];
                wx.showToast({
                    title: '修改成功',
                    duration: 1000
                })
                
            }
        })
        
    },
    alert: function (txt) {
        wx.showToast({
            icon: 'none',
            title: txt
        })
    },
    onLoad: function () {
    }
})