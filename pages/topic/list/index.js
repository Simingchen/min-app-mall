const util = require('../../../utils/util.js');
const app = getApp()
Page({
    data: {
        curTab: 1,
        hotList: [],
        newestList: [],
        sortList: []
    },
    switchTab (e) {
        this.setData({
            curTab: e.currentTarget.dataset.type
        })
    },
    // 列表
    getList(Type) {
        var that = this;
        var params = new Object();
        var url = "getTopicList.ashx"
        params.Size = 5;
        params.Page = 0;
        params.TopicStatus = 1;
        // params.CategoryID = null;
        // params.MemberID = 0;
        params.TopicType = 0;
        params.Type = Type;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                if (Type == 1) {
                    that.setData({
                        newestList: oData.List
                    });
                }
                if (Type == 2) {
                    that.setData({
                        hotList: oData.List
                    });
                }
            },
        })
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
    onLoad: function () {
        this.getList(1);
        this.getList(2);
        this.getSort();
        //获取到globadata的值
        this.data.imageUrlPath = app.globalData.imageUrlPath;
        this.setData({
            imageUrlPath: this.data.imageUrlPath
        })
    },
})
