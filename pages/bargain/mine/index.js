const util = require('../../../utils/util.js');
var app = getApp().globalData,
    timer = app.timer;
Page({
    data: {
        curTab: -1,
        items: [],
        isLoadData: true,   // 是否可加载数据
        curType: -1,              // 当前类型 默认为全部
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
        goods: {},
        wxTimerList: {}
    },
    getMsg(page, type) {
        var that = this;
        var params = new Object();
        var url = "getBargainMemberByMember.ashx"
        params.Page = page;
        params.Size = 10;
        params.Status = type;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    that.setData({
                        curPage: page,
                    })

                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            items: oData.Data[0].List
                        })
                    } else {
                        var data = that.data.items.concat(oData.Data[0].List);
                        that.setData({
                            items: data
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

                }
            },
        })
    },
    getgoods (type) {
        var that = this;
        var params = {};
        var url = "getDoingBargainByMember.ashx"
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data
                that.setData({
                    goods: oData
                })

                that.data.goods.forEach((item, index) => {
                    that.countDown(item.RemainingTime, index);
                })
            },
        })
    },
    // 切换弹窗
    togglePopup () {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
    // 导航切换
    switchTab (e) {
        this.setData({
            curTab: e.currentTarget.dataset.type
        })
        this.getMsg(0, e.currentTarget.dataset.type);
    },
    onLoad: function (options) {
        this.getgoods();
        this.getMsg(0, -1);
    },
    countDown: function (data, index) {
        var that = this;
        var wxTimer1 = new timer({
            beginTime: data,
            name: 'wxTimer' + index,
            complete: function () {
                that.setData({
                    ["goods.Status"]: 2
                })
            }
        })
        wxTimer1.start(this);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var type = this.data.curType;
            var page = this.data.curPage + 1;
            this.getMsg(page, type);
        }
    },
});

