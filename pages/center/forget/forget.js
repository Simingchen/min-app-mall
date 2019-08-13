// pages/center/login/login.js
const util = require('../../../utils/util.js');
Page({
    data: {
        user: "",        //用户名
        password: "",    //密码
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
    checkForm: function (e) { // 验证手机号
        // ^(?![0 - 9] + $)(?![a - zA - Z] + $)[0 - 9A- Za - z]{ 6, 12 } $
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })

        var type = e.currentTarget.dataset.type;
        if (type == "user") {
            var reg = /^1\d{10}$/;
            var iso = reg.test(e.detail.value);
            if (iso) {
                this.setData({
                    ['isDisabled']: true
                })
            } else {
                this.setData({
                    ['isDisabled']: false
                })
            }
        }
    },
    sendCode: function (e) {    // 发送验证码
        if (!e.currentTarget.dataset.disabled) {
            this.alert("请输入正确手机号")
            return false;
        }
        var type = e.currentTarget.dataset.type;
        if (e.currentTarget.dataset.disabled) {
            var that = this;
            that.setData({
                ['isDisabled']: false
            })

            var params = new Object();
            var url = "getVerificationCodeForForgetPwd.ashx"
            params.Mobile = that.data.user;
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
                    
                    if (oData.Status == 200) {
                        var time = that.data.codeTime

                        var timer = setInterval(function () {
                            time--;
                            that.setData({
                                ['codeTime']: time
                            })
                            that.setData({
                                ['isDisabled']: false
                            })
                            that.setData({
                                ['codeButtonOn']: 1
                            })

                            if (time <= 0) {
                                clearInterval(timer);
                                that.setData({
                                    ['isDisabled']: true
                                })
                                that.setData({
                                    ['codeButtonOn']: 0
                                })
                            }
                        }, 1E3)
                    }
                },
                fail: function () {
                    wx.showToast({
                        icon: 'none',
                        title: "失败"
                    })
                },
            })
            
        }
    },
    next: function () {
        var user = this.data.user;
        var password = this.data.password;
        var code = this.data.code;
        if (!user) {
            this.alert("请输入手机号")
            return false;
        }
        if (!code) {
            this.alert("请输入验证码")
            return false;
        }

        // 去修改密码
        wx.navigateTo({
            url: '/pages/center/changePass/change',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    alert: function (txt) {
        wx.showModal({
            title: "温馨提示",
            content: txt,
            confirmColor: "#f79bb0"
        })
    },
    onLoad: function () {
    }
})