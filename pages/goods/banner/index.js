const util = require('../../../utils/util.js');
let wxparse = require("../../../wxParse/wxParse.js");
Page({
    data: {
        detail: {}
    },
    getMsg(id) {
        var that = this;
        var params = {};
        var url = "getBannerInfo.ashx"
        params.RID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    detail: oData
                });
                wxparse.wxParse('content', 'html', that.data.detail.Content, that, 5)
            },
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
