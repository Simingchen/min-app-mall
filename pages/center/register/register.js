// pages/center/login/login.js
const util = require('../../../utils/util.js');
Page({
    data: {
        user: "",        //用户名
        password: "",    //密码
        code: "",
        device: "",    // 使用设备
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
        var that = this;
        if (!e.currentTarget.dataset.disabled) {
            this.alert("请输入正确手机号")
            return false;
        }
        var type = e.currentTarget.dataset.type;
        if (e.currentTarget.dataset.disabled) {
            var data = 'isDisabled'
            that.setData({
                ['isDisabled']: false
            })

            var params = new Object();
            var url = "getVerificationCode.ashx"
            params.Mobile = that.data.user;
            util.POST({
                url: url,
                params: JSON.stringify(params),
                success: function (res) {
                    var oData = res.data[0].Data
                },
                fail: function () {
                    wx.showToast({
                        title: "失败"
                    })
                },
            })

            wx.showToast({
                title: '发送成功',
                duration: 1000
            })
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
    signUp: function () {
        var that = this
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
        if (!password) {
            this.alert("请输入密码")
            return false;
        }
        if (password.length < 8) {
            this.alert("密码长度太短了哦")
            return false;
        }

        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                if (res.platform == "devtools") {
                    that.setData({
                        device: "PC"
                    });
                } else if (res.platform == "ios") {
                    that.setData({
                        device: "IOS"
                    });
                } else if (res.platform == "android") {
                    that.setData({
                        device: "Android"
                    });
                }
            }
        })

        var params = new Object();
        var url = "register.ashx"
        params.Mobile = user;
        params.Password = password;
        params.DeviceType = that.data.device;
        params.Code = code;

        wx.showLoading({
            title: "提交中..."
        })

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                wx.showToast({
                    icon: 'none',
                    title: oData.Msg
                })

                if (oData.Status == 200) {
                    wx.redirectTo({
                        url: '/pages/center/login/login'
                    })
                }
                wx.hideLoading({})
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: "失败"
                })
            },
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
    },
})