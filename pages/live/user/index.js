const util = require('../../../utils/util.js');
Page({
    data: {
        curTab: 0,
        user: {},
        topicList: [],
        videoList: []
    },
    switchTab (e) {
        this.setData({
            curTab: e.currentTarget.dataset.id
        });
    },
    // 获取信息
    getMsg: function (id) {
        var that = this;
        var url = "getMemberByID.ashx"
        var params = {};
        params.MID = id;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    that.setData({
                        user: oData.Data[0]
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: oData.Msg,
                        duration: 1000
                    })
                }
            }
        })
    },
    // 获取话题
    getMessage(id) {
        var that = this;
        var params = new Object();
        var url = "getTopicByMember.ashx"
        params.Size = 10;
        params.Page = 0;
        params.MemberID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                
                that.setData({
                    topicList: oData.List
                });
            },
        })
    },
    getVideoList(id, page) {
        var that = this;
        var params = new Object();
        var url = "getPlaybackByMember.ashx"
        params.Page = 0;
        params.MID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]

                that.setData({
                    videoList: oData.List
                });
                console.log(that.data.topicList)
            },
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id)
        this.getMessage(options.id);
        this.getVideoList(options.id, 0)
    }
});

