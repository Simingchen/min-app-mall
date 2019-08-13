const util = require('../../../utils/util.js');
Page({
    data: {
        phone: "",
        code: "",
        isDisabled: true, // 发送按钮禁止
        codeButtonOn: false,
        codeTime: 60,
    },
    bindInput: function (e) { // 输入框输入
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })
    },
    getCode: function (e) {
        if (!e.currentTarget.dataset.disabled) {
            return false;
        }
        var phone = this.data.phone
        if (!this.data.phone) {
            this.alert("请输入手机号")
            return false;
        }
        var that = this;
        let params = {};
        params.Mobile = phone;
        var url = "getVerificationCode.ashx"
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
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
                            that.setData({
                                ['codeTime']: 60
                            })
                        }
                    }, 1E3)
                }
            }
        })
    },
    change: function () {
        var phone = this.data.phone;
        var password = this.data.password;
        var code = this.data.code;
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            this.alert("手机号码有误，请重填")
            return false;
        }

        if (!code) {
            this.alert("请输入验证码")
            return false;
        }

        var that = this;
        var url = "bindMobile.ashx";
        let params = {};
        params.Mobile = phone;
        params.Code = code;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    this.alert("修改成功")
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/center/mine/mine'
                        })
                    }, 1000)
                }
            }
        })

    },
    alert: function (txt) {
        wx.showToast({
            icon: "none",
            title: txt,
        })
    },
    onLoad: function () { }
})