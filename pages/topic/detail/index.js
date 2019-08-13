const util = require('../../../utils/util.js');
let wxparse = require("../../../wxParse/wxParse.js");
Page({
    data: {
        isShowPopup: false,
        topic:{}
    },
    // 分类
    getMsg(id) {
        var that = this;
        var params = {};
        var url = "getTopicByID.ashx"
        params.TID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    topic: oData
                });
                wxparse.wxParse('content', 'html', that.data.topic.Content, that, 5)
            },
        })
    },
    // 关注
    saveFollow(e) {
        var url = "cancelFocus.ashx"
        var type = e.currentTarget.dataset.follow;
        console.log(type)
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

                    that.setData({
                        ['topic.IsFollow']: type == 0 ? 1 : 0
                    })
                }
            },
        })
    },
    likeTopic (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        var params = {};
        var url = "LikeTopic.ashx"
        params.TopicID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    wx.showToast({
                        icon: "none",
                        title: "点赞成功",
                    })
                    that.setData({
                        ['topic.IsLike']: 1
                    })
                }
            },
        })
    },
    // 评论列表
    toChat(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/topic/comment/index?id='+ id,
        })
    },
    // 加入
    goUrl(e) {
        var index = e.currentTarget.dataset.index;
        var number = e.currentTarget.dataset.number;
        wx.redirectTo({
            url: '/pages/goods/detail/index?index='+ index +'&number=' + number,
        })
    },
    // 切换弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id)
    },
})
