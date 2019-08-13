const util = require('../../../utils/util.js');

Page({
    data: {
        isLoadData: true, // 是否可加载数据
        items: [], // 数据
        curMethods: null, // 当前方法
        curType: -1, // 当前类型 默认为全部
        totalPages: 0, // 所有页数
        curItem: "", // 选定的当前item
    },
    getList: function(page, size, StoreID, CategoryID) {
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
            success: function(res) {
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
                        items,
                        isLoadData,
                        curPage: page,
                    })
                }
            }
        })

        this.setData({
            curPage: page,
        })
    },
    onLoad: function(options) {
        this.getList(0, 20, "", "")
    },
    // 兑换
    getCoupon(e) {
        var that = this;
        var params = {};
        var url = "getExchange.ashx"
        params.CID = e.currentTarget.dataset.id;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    wx.showToast({
                        icon: "none",
                        title: oData.Msg,
                    })
                }
            },
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.isLoadData) {
            var page = this.data.curPage + 1
            this.getList(page, 20, "", "");
        }
    },
})