// pages/orderList/orderList.js
const util = require('../../../utils/util.js');
Page({
    data: {
        curMethods: null,       // 当前方法
        isLoadData: true,   // 是否可加载数据
        items: [],     // 订单数据
        curType: -1,              // 当前类型 默认为全部
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
        curItem: "",         // 选定的当前item
    },
    switchOrder: function (e) {
        // type  -1：全部 0：待付款 1：待发货 2：待收货 4：已完成
        var type = e.currentTarget.dataset.type;
        this.getOrderList(type, 0, 10);
    },
    getOrderList: function (type, page, size) {
        var that = this;
        var url = "getMyTradeByStatus.ashx"
        var params = new Object();
        params.Status = type;
        params.Page = page;
        params.Size = size;
        
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status === "200") {
                    var items = [];
                    var isLoadData = false;
                    if (page == 0) {
                        items = oData.Data[0].List
                    } else {
                        items = that.data.items.concat(oData.Data[0].List);
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        isLoadData = false;
                    } else {
                        isLoadData = true;
                    }
                    that.setData({
                        curType: type,
                        items,
                        isLoadData,
                        curPage: page,
                    })
                }
            }
        })
    },
    // 查看物流
    seeExpress: function (e) {  
        var id = e.currentTarget.dataset.id;
        var number = e.currentTarget.dataset.number;
        wx.navigateTo({
            url: "/pages/goods/express/index?id=" + id + "&number=" + number
        })
    },
    // 点击取消订单
    cancleOrder: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: "提示",
            content: "取消订单？",
            confirmColor: "#f79bb0",
            success: function (res) {
                if (res.confirm) {
                    var url = "cancelTrade.ashx"
                    var params = {};
                    params.TID = id;
                    util.POST({
                        url: url,
                        params: JSON.stringify(params),
                        success: function (res) {
                            that.data.items.forEach((item, index) => {  // 成功后删除订单
                                var Status = 'items[' + index + '].Status'
                                if (id == item.ID) {
                                   that.setData({
                                       [Status]: 1
                                   })
                                }
                            })
                        },
                        
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // refund 申请退款
    refundApply (e) {
        // var that = this;
        // var id = e.currentTarget.dataset.id;
        // wx.showModal({
        //     title: "提示",
        //     content: "申请退款？",
        //     confirmColor: "#f79bb0",
        //     success: function (res) {
        //         if (res.confirm) {
        //             var url = "cancelTrade.ashx"
        //             var params = {};
        //             params.TID = id;
        //             util.POST({
        //                 url: url,
        //                 params: JSON.stringify(params),
        //                 success: function (res) {
        //                     that.data.items.forEach((item, index) => {  // 成功后删除订单
        //                         var Status = 'items[' + index + '].Status'
        //                         if (id == item.ID) {
        //                             that.setData({
        //                                 [Status]: 9
        //                             })
        //                         }
        //                     })
        //                 },

        //             })
        //         } else if (res.cancel) {
        //             console.log('用户点击取消')
        //         }
        //     }
        // })
    },
    // 确认收货
    certainOrder: function (e) {
        var that = this;
        var number = e.currentTarget.dataset.number;
        var id = e.currentTarget.dataset.id;
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
                            if (oData.Status === "200") {
                                that.data.items.forEach((item, index) => {
                                    if (id == item.ID) {
                                        var status = 'items[' + index + '].Status';
                                        that.setData({
                                            status: 5
                                        })
                                    }
                                })
                                wx.showToast({
                                    icon: 'none',
                                    title: "成功",
                                    duration: 1000
                                })
                            } else {
                                wx.showToast({
                                    icon: 'none',
                                    title: oData.Msg,
                                    duration: 1000
                                })
                            }
                        },
                        fail: function () {
                            
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 在线支付前弹出密码框
    payPop: function (item) {
        this.curItem = item;
        // 直接支付
        this.payOrder();
    },
    onLoad: function (options) {
        this.getOrderList(-1, 0, 10)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var type = this.data.curType;
            var page = this.data.curPage + 1
            this.getOrderList(type, page, 10);
        }
    },
})