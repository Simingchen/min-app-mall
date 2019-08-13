const util = require('../../../utils/util.js');
const app = getApp()
Page({
    data: {
        isShowPopup: false,
        goodsList: [],
        isLoadData: true,   // 是否可加载数据
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
        curTab: 0,    // 导航
    },
    getList (page) {
        var that = this;
        var params = {};
        var url = "getBargainList.ashx"
        params.Page = page;
        params.size = 10;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    that.setData({
                        curPage: page,
                    })
                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            goodsList: oData.Data[0].List
                        })
                    } else {
                        var data = that.data.goodsList.concat(oData.Data[0].List);
                        that.setData({
                            goodsList: data
                        })
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        that.setData({
                            isLoadData: false
                        })
                    } else {
                        that.setData({
                            isLoadData: true
                        })
                    }
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: oData.Msg,
                        duration: 1000
                    })
                }
            },
        })
    },
    // 导航切换
    toggleTab (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            curTab: type
        })
    },
    // 切换弹窗
    togglePopup () {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
    bargain (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/bargain/goods/index?id=' + id
        })
    },
    onLoad: function (options) {
        this.getList(0);
        //获取到globadata的值
        this.data.imageUrlPath = app.globalData.imageUrlPath;
        this.setData({
            imageUrlPath: this.data.imageUrlPath
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var page = this.data.curPage + 1
            this.getList(page);
        }
    },
});

