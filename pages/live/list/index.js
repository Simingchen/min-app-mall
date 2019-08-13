const util = require('../../../utils/util.js');
Page({
    data: {
        videoList:[],
        liveList: []
    },
    onLoad: function () {
        this.getMsg()
        this.getLive();
    },
    getMsg() {
        var that = this;
        var params = new Object();
        var url = "getPlayBack.ashx"
        params.Page = 0;
        params.Size = 10;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0].List
                that.setData({
                    videoList: oData
                });
            },
        })
    },
    // 直播列表
    getLive() {
        var that = this;
        var params = new Object();
        var url = "getLiveIn.ashx"
        params.Size = 7;
        params.Page = 0;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    liveList: oData.List
                });
            },
        })
    },
})
