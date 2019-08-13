const util = require('../../../utils/util.js');
Page({
    data: {
        express: {},
    },
    getMsg: function (id, num) {
        var that = this;
        var url = "getLogisticsDetails.ashx"
        var params = {};
        params.LCID = id;
        params.Num = num;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                console.log(oData)
                if (oData.Status == 200) {
                    that.setData({
                        express: oData.Data
                    })
                }
            },
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id, options.number);
    },
})