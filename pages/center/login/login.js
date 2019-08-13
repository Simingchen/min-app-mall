const util = require('../../../utils/util.js');
const app = getApp()
Page({
    data: {
        user: "",        //用户名
        password: "",    //密码
        device: ""    // 使用设备
    }, 
    bindInput: function (e) {   // 输入框输入
        this.setData({
            [e.currentTarget.dataset.type]: e.detail.value
        })
    },
    login: function (){
        var that = this;
        var user = this.data.user;
        var password = this.data.password;
        if (!user) {
            wx.showToast({
                icon:"none",
                title: "请输入手机号",
            })
            return false;
        }
        if (!password) {
            wx.showToast({
                icon: "none",
                title: "请输入密码",
            })
            return false;
        }
        wx.getSystemInfo({
            success: function (res) {
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
        var url = "loginByMobile.ashx"
        params.Mobile = user;
        params.Password = password;
        params.Device = that.data.device;

        wx.showLoading({
            title: "登录中..."
        })

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                wx.showToast({
                    icon: 'none',
                    title: oData.Msg,
                    duration: 1000
                })
                if (oData.Status === "200") {
                    wx.setStorageSync('losetime', oData.Data[0].LoseTime)
                    wx.setStorageSync('token', oData.Data[0].Token)

                    // 开始设置定时器检测登陆超时
                    util.setLogin(oData.Data[0].LoseTime);
                    
                    wx.switchTab({
                        url: '/pages/home/index'
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: "失败"
                })
            },
        })
        
    },
    onLoad: function () {
    },
})