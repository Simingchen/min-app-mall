const util = require('../../utils/util.js');
Page({
    data: {
        curTab: 2,
        storeId: "",
        OrderByField: 0,
        store: {},
        TimeRemain: "",   // 上新时间
        newestList: [],
        hotList: [],
        hotGoods:[],
        isLoadData: true,   // 是否可加载数据
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
        couponList: [],
        topBanner: {
            indicatorDots: true,
            color: "#fff",
            activeColor: "#000",
            autoplay: true,
            interval: 5000,
            duration: 300,
            circular: true,
            list: []
        },
    },
    switchTab(e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            curTab: type
        })
        if (type == 1 || type == 0) {
            this.getList(0, this.data.storeId, type);
        }
    },
    getMsg(id) {
        var that = this;
        var params = {};
        var url = "getStoreByID.ashx"
        params.StoreID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    store: oData
                });
            },
        })
    },
    getList(page, StoreID, OrderByField) {
        var that = this;
        var params = {};
        var url = "getStoreGoodsList.ashx"
        params.Page = page;
        params.size = 20;
        params.StoreID = StoreID;
        params.OrderByField = OrderByField;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    if (OrderByField == 0) {
                        that.setData({
                            TimeRemain: oData.Data[0].TimeRemain,
                            newestList: oData.Data[0].List
                        })
                    }  
                    if (OrderByField == 1) {
                        that.setData({
                            hotList: oData.Data[0].List
                        })
                    } 
                }
            },
        })
    },
    // 优惠券
    getCouponList: function (page, size, StoreID, CategoryID) {
        var that = this;
        var url = "getCouponList.ashx"
        var params = {};
        params.Page = page;
        params.Size = size;
        params.StoreID = StoreID;
        params.CategoryID = CategoryID;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status === "200") {
                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            couponList: oData.Data[0].List
                        })
                    }
                }
            },
        })
    },
    // 爆款
    getRecommendGoods: function (page, size, StoreID) {
        var that = this;
        var url = "getRecommendGoods.ashx"
        var params = {};
        params.Page = page;
        params.Size = size;
        params.StoreID = StoreID;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status === "200") {
                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            hotGoods: oData.Data[0].List
                        })
                    }
                }
            }
        })
    },
    // 关注
    saveFollow(e) {
        var url = "cancelFocus.ashx"
        var type = e.currentTarget.dataset.follow;
        if (type == 0) {
            url = "focusOn.ashx"
        }
        var id = e.currentTarget.dataset.id;
        var that = this;
        var params = {};

        params.ToID = id;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    var title = "";
                    if (type == 1) {
                        title = '取消成功'
                    } else {
                        title = '关注成功'
                    }
                    wx.showToast({
                        icon: "none",
                        title: title,
                    })

                    that.data.items.forEach((item, index) => {  // 成功后取消
                        var Status = 'items[' + index + '].IsMutualConcern'
                        if (id == item.FromID) {
                            that.setData({
                                [Status]: type == 0 ? 1 : 0
                            })
                        }
                    })
                }
            },
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id);
        this.getList(0, options.id, 0);
        this.getCouponList(0, 20, options.id, "")
        this.getRecommendGoods(0, 20, options.id, "")
        this.setData({
            storeId: options.id
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var page = this.data.curPage + 1
            this.getList(page, this.data.storeId, this.data.OrderByField);
        }
    },
})
