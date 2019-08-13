const util = require('../../../utils/util.js');
Page({
    data: {
        curTab: 1,
        sortList: [],
        topicList: []
    },
    switchTab(e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            curTab: type
        })
        this.getMsg(type);
    },
    // 分类
    getSort() {
        var that = this;
        var params = new Object();
        var url = "getTopicCategory.ashx"
        params.Size = 7;
        params.Page = 0;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data
                that.setData({
                    sortList: oData
                });
            },
        })
    },
    getMsg(sort) {
        var that = this;
        var params = new Object();
        var url = "getTopicList.ashx"
        params.Size = 5;
        params.Page = 0;
        params.TopicStatus = 1;
        params.CategoryID = sort;
        // params.MemberID = 0;
        params.TopicType = 0;
        params.Type = 0;

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
    onLoad: function (options) {
        this.getSort();
        this.getMsg(options.type);
        this.setData({
            curTab: options.type
        })
    },
})
