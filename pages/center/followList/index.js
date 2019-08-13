const util = require('../../../utils/util.js');
Page({
    data: {
        type: 0,   // 1关注 粉丝
        isLoadData: true,   // 是否可加载数据
        items: [],     // 订单数据
        curType: -1,              // 当前类型 默认为全部
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
    },
    switchTab(e) {
        this.setData({
            curTab: e.currentTarget.dataset.type
        })
    },
    goUrl (e) {
        var id = e.currentTarget.dataset.id;
        if (this.data.type == 1) {
            id = e.currentTarget.dataset.tid;
        }
        wx.navigateTo({
            url: "/pages/live/user/index?id="+ id,
        })
    },
    // 
    getList(page, type) {
        var that = this;
        var params = new Object();
        var url = "getMyFans.ashx"
        if (type == 1) {
            url = "getMyFollow.ashx"
        }
        params.Size = 20;
        params.Page = page;

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
                        items,
                        isLoadData,
                        curPage: page,
                    })
                } 
            }
        })
    },
    // 关注
    saveFollow (e) {
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
                    if (type == 0) {
                        title = '关注成功'
                    } else {
                        title = '取消成功'
                    }
                    wx.showToast({
                        icon: "none",
                        title: title,
                    })
                    if (that.data.type == 1) {
                        that.data.items.forEach((item, index) => {  // 成功后取消
                            var Status = 'items[' + index + '].IsMutualConcern'
                            if (id == item.FromID) {
                                that.setData({
                                    [Status]: type == 0 ? 1 : 0
                                })
                            }
                        })
                    }
                }
            },
        })
    },
    onLoad: function (options) {
        this.setData({
            type: options.type
        })
        var title = "";
        if (options.type == 1) {
            title = "关注";
        } else {
            title = "粉丝";
        }
        wx.setNavigationBarTitle({  // 设置标题
            title: title
        })
        this.getList(0, options.type);
    },
})
