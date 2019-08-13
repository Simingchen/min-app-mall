const util = require('../../../utils/util.js');
Page({
    data: {
        order: {
            orderId: "",
        },
        
    },
    // 获取订单
    getOrder: function (id) {
        var that = this;
        var url = "getTradeInfo.ashx"
        var params = new Object();
        params.Number = id;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        order: oData.Data[0]
                    })
                }
            }
        })
    },
    // 去付款
    goPay() {
        var number = this.data.orderId;
        // 微信支付
        util.PAY(number, {
            success() {
                setTimeout(() => {
                    wx.navigateTo({
                        url: "/pages/order/list/index"
                    })
                }, 1e3)
            },
            fail() {
                console.log("支付取消");
            }
        })
    },
    // 确认收货
    certainOrder: function (e) {
        var that = this;
        var number = this.data.order.Number;
        wx.showModal({
            title: "提示",
            content: "确认收货？",
            confirmColor: "#f79bb0",
            success: function (res) {
                if (res.confirm) {
                    var url = "confirmTrade.ashx"
                    var params = new Object();
                    params.Number = number;
                    util.POST({
                        url: url,
                        params: JSON.stringify(params),
                        success: function (res) {
                            var oData = res.data[0]

                            if (oData.Status == 200) {
                                wx.navigateBack({ // 成后返回上一页
                                    delta: 1
                                })
                                wx.showToast({
                                    icon:"none",
                                    title:oData.Msg,
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    onLoad: function (options) {
        this.setData({
            orderId: options.id
        })
        this.getOrder(options.id)
    },  
})