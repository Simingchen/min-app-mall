const util = require('../../../utils/util.js');
let wxparse = require("../../../wxParse/wxParse.js");
var app = getApp().globalData,
    timer = app.timer;
Page({
    data: {
        topBanner: {
            indicatorDots: true,
            color: "#faccc0",
            activeColor: "#f69ab0",
            autoplay: false,
            interval: 5000,
            duration: 300,
            circular: true,
            list: []
        },
        isShowAddrPopup: false,
        address: [],
        bargainId: "",    // 砍价ID
        isShowDialog: false,    // 是否显示加入购物车弹窗
        isShowparams: false,    // 是否显示产品参数
        goods: {},
        productQuantity: 1,         // 选定商品数量
        curStock: null,    // 选定的当前库存
        curSkuId: null,     // 当前选定的skuID
        curPrice: null,     // 当前选定价格
        curProty: null,     // 当前选定属性
        commnetList: [],
        wxTimerList: {}
    },
    getMsg (options) {
        var that = this;
        var url = "getGoodsDetails.ashx";
        var params = new Object();
        params.Index = options.index;
        params.Number = options.number;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                var curStock = JSON.stringify(oData.Data[0].SkuInfo) == "[]" ? oData.Data[0].TotalStock : oData.Data[0].SkuInfo[0].Stock;  
                var curProty = JSON.stringify(oData.Data[0].SkuInfo) != "[]" && oData.Data[0].SkuInfo[0].Name;
                if (oData.Status === "200") {
                    that.setData({
                        goods: oData.Data[0],
                        curStock: curStock,
                        curPrice: oData.Data[0].Price,
                        curSkuId: oData.Data[0].DefaultSkuID,
                        curProty: curProty,
                        bargainId: oData.Data[0].BaraginID,
                        
                    })
                    that.setData({
                        ["topBanner.list"]: that.data.goods.Img.split(",")
                    })

                    wxparse.wxParse('content', 'html', that.data.goods.Content, that, 5)

                    if (oData.Data[0].IsGetBargin == 1) {
                        that.countDown(oData.Data[0].RemainTime)
                    }

                    that.getGoodsCommnetList();
                }
            }
        })
    },
    // 切换sku弹窗
    toggleSku: function (e) {
        this.setData({
            isShowDialog: !this.data.isShowDialog
        })
    },
    // 加减商品数量
    changeQuantity: function (e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var nowNum = this.data.productQuantity;
        
        if (type > 0) {
            if (this.data.productQuantity < this.data.curStock) {
                nowNum++;
            }
        } else {
            nowNum > 1 ? nowNum-- : nowNum = 1;
        }
        that.setData({
            ["productQuantity"]: nowNum
        })
    },
    // 收藏
    collect () {
        var that = this;
        var url = "addToCollectionList.ashx";
        var params = new Object();
        params.Store = this.data.goods.Index;
        params.Number = this.data.goods.Number;

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
                if (oData.Status == 202) {
                    that.setData({
                        ["goods.isCollected"]: !that.data.goods.isCollected
                    })
                }
            }
        }, true)
    },
    // 加入购物车
    goBuy (e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var url = "addToCart.ashx";
        var params = {};
        var skuId = this.data.curSkuId;
        params.SID = this.data.goods.StoreID;
        params.Quantity = this.data.productQuantity;
        if (!that.data.goods.SkuInfo.length) {
            skuId = that.data.goods.DefaultSkuID
        }
        params.ID = skuId;
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
                that.setData({
                    isShowDialog: false
                })
                if (oData.Status === "200") {
                    if (type == 2) {
                        wx.redirectTo({
                            url: "/pages/shopCart/shopCart"
                        })
                    }
                }
            }
        }, true)
    },
    // 选择水库
    selectSku(e) {
        var item = e.currentTarget.dataset.item;
        this.setData({
            curSkuId: item.MainID,  // 当前选定的skuID
            curStock: item.Stock || 0,    // 选定的当前库存
            curPrice: item.Price,     // 当前选定价格
            curProty: item.Name,     // 当前选定属性
        })
    },
    // 评论
    getGoodsCommnetList() {
        var that = this;
        var url = "getGoodsCommnetList.ashx";
        var params = {};
        params.Size = 10;
        params.Page = 0;
        params.Index = this.data.goods.Index;
        params.Number = this.data.goods.Number;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    that.setData({
                        commnetList: oData.Data[0].List
                    })
                }
                console.log(that.data.commnetList)
            }
        })
    },
    // 切换显示产品参数
    toogleParams () {
        this.setData({
            isShowparams: !this.data.isShowparams
        })
    },
    // 地址弹窗
    toggleAddrPopup() {
        this.getAddress();
        this.setData({
            isShowAddrPopup: !this.data.isShowAddrPopup
        })
    },
    // 获取地址信息
    getAddress: function () {
        var that = this;
        var url = "getAddressList.ashx"
        var params = new Object();
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        address: oData.Data
                    })
                } else {
                    wx.showToast({
                        icon:"none",
                        title: '请先登录',
                    })
                }
            }
        }, true)
    },
    // 选择地址
    chooseAddress(e) {
        wx.redirectTo({
            url: '/pages/bargain/detail/index?address=' + e.currentTarget.dataset.id + '&bargain=' + this.data.bargainId + '&goodsId=' + this.data.curSkuId + "&prepath=goods",
        })
    },
    countDown: function (data) {
        //开启第一个定时器
        var wxTimer1 = new timer({
            beginTime: data,
            name: 'wxTimer1',
            complete: function () {
                console.log("完成了")
            }
        })
        wxTimer1.start(this);
    },
    onLoad: function (options) {
        this.setData({
            bargainId: options.bargain
        })
        this.getMsg(options);
    }
})
