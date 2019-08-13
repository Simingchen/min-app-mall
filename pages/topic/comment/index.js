const util = require('../../../utils/util.js');
Page({
    data: {
        id: "",   // 话题ID
        isSending: false,
        sendCon: "",
        isLoadData: true,   // 是否可加载数据
        items: [],     // 订单数据
        curType: -1,              // 当前类型 默认为全部
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
    },
    getList: function (id, page, size) {
        var that = this;
        var url = "getTopicCommentList.ashx"
        var params = {};
        params.TID = id;
        params.Page = page;
        params.Size = size;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
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
    bindInput: function (e) {   // 输入框输入
        this.setData({
            "sendCon": e.detail.value
        })
    },
    send(e) {
        if (this.data.isSending) {
            return false;
        }
        if (!this.data.sendCon) {
            wx.showToast({
                icon:"none",
                title: '说说你的看法~',
            })
            return false;
        }
        this.setData({
            isSending: true
        })
        var id = this.data.id;
        var that = this;
        var params = {};
        var url = "commentTopic.ashx"
        params.TID = id;
        params.Content = this.data.sendCon;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                that.setData({
                    isSending: false
                })
                var oData = res.data[0];
                if (oData.Status == 200) {
                    wx.showToast({
                        icon: 'none',
                        title: '评论成功',
                    })
                    let arr = that.data.items;
                    let comment = {}
                    comment.FromName = arr[0].FromName;
                    comment.Content = that.data.sendCon;
                    comment.CreateTime = arr[0].CreateTime;
                    comment.FromHead = arr[0].FromHead;

                    arr.splice(0, 0, comment)
                    that.setData({
                        items: arr
                    })
                    that.setData({
                        "sendCon": ""
                    })
                    wx.pageScrollTo({
                        scrollTop: 0,
                    })
                }
            },
        })
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        this.getList(options.id, 0, 10);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var id = this.data.id;
            var page = this.data.curPage + 1
            this.getList(id, page, 10);
        }
    },
})
