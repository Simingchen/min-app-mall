const util = require('../../../utils/util.js');
Page({
    data: {
        user: {},
        percentage: 0
    },
    onLoad: function () {
        this.getMsg()
    },
    getMsg() {
        var that = this;
        var params = new Object();
        var url = "getMemberGradeInfo.ashx"
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    user: oData
                });
                // 百分比进度条
                let per = (oData.CurrentExperience / oData.RequireExperience) * 100 + "%";
                that.setData({
                    percentage: per,
                })
            },
        })
    },
})
