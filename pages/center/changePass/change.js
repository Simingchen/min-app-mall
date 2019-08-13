const util = require('../../../utils/util.js');
Page({
    data: {
        pass: "", // 新密码
        password: "", // 再次输入密码密码
        code: "",
        isDisabled: true, // 发送按钮禁止
        codeButtonOn: false,
        codeTime: 60,
    },
    bindInput: function(e) { // 输入框输入
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })
    },
    checkForm: function(e) { // 验证手机号
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })
    },
    getCode: function(e) {
        if (!e.currentTarget.dataset.disabled) {
            return false;
        }
        var that = this;
        var url = "getVerificationCodeForCurrentMember.ashx"
        util.POST({
            url: url,
            success: function(res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    var type = e.currentTarget.dataset.type;

                    var data = 'isDisabled'
                    that.setData({
                        ['isDisabled']: false
                    })
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000
                    })
                    var time = that.data.codeTime

                    var timer = setInterval(function() {
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
                            that.setData({
                                ['codeTime']: 60
                            })
                        }
                    }, 1E3)
                }
            }
        })
    },
    change: function() {
        var pass = this.data.pass;
        var password = this.data.password;
        var code = this.data.code;
        if (!pass) {
            this.alert("请输入新的密码")
            return false;
        }
        if (pass.length < 8) {
            this.alert("密码长度太短了哦")
            return false;
        }
        if (!password) {
            this.alert("请再次输入新的密码")
            return false;
        }
        if (pass != password) {
            this.alert("两次密码不一致")
            return false;
        }
        if (!code) {
            this.alert("请输入验证码")
            return false;
        }

        var that = this;
        var url = "changePassword.ashx";
        let params = {};
        params.NewPassword = pass;
        params.Code = code;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    wx.redirectTo({
                        url: '/pages/center/login/login'
                    })
                }
            }
        })

    },
    alert: function(txt) {
        wx.showToast({
            icon: "none",
            title: txt,
        })
    },
    onLoad: function() {}
})