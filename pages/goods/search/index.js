const util = require('../../../utils/util.js');
Page({
    data: {
        searchTxt: "",
        hotSearch: [],
        historySearch: []   // 历史搜索
    },
    onLoad: function (options) {
        this.getSearch();
        this.getMsg();
    },
    getMsg: function () {
        var that = this;
        var url = "getHotKeys.ashx"
        var params = new Object();
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        hotSearch: oData.Data
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
                wx.showToast({
                    icon: 'none',
                    title: "失败"
                })
            },
        })
    },
    getSearch () {
        var that = this;
        wx.getStorage({
            key: 'historySearch',
            success: function (res) {
                that.setData({
                    historySearch: JSON.parse(res.data)
                })
            },
        })
    },
    // 搜索
    goSearch (e) {
        var that = this;
        var txt = e.detail.value;
        var arr = [];
        var itemTemp = {}
        itemTemp.txt = txt
        arr.push(itemTemp)
        wx.redirectTo({
            url: "/pages/goods/list/index?txt=" + e.detail.value
        })
        wx.getStorage({
            key: 'historySearch',
            success: function (res) {
                var temp = JSON.stringify(arr.concat(JSON.parse(res.data)).slice(0, 8))
                wx.setStorage({
                    key: 'historySearch',
                    data: temp,
                })
            },
            fail () {
                wx.setStorage({
                    key: 'historySearch',
                    data: JSON.stringify(arr),
                })
            }
        })

        this.setData({
            searchTxt: ""
        })
    }
})