const util = require('../../utils/util.js');
Page({
    data: {
        curPage: 0,
        isLoadData: true,   // 是否可加载数据
        commentList: []
    },
    getMsg: function (size, page) {
        var that = this;
        var url = "getMyCommentList.ashx"
        var params = new Object();
        params.Size = size;
        params.Page = page;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    var commentList = [];
                    var isLoadData = false;
                    if (page == 0) {
                        commentList = oData.Data[0].List
                    } else {
                        commentList = that.data.commentList.concat(oData.Data[0].List);
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        isLoadData = false;
                    } else {
                        isLoadData = true;
                    }
                    that.setData({
                        navCurId: sortId,
                        commentList,
                        isLoadData,
                        curPage: page,
                    })
                }
            }
        })
    },
    onLoad: function() {
        this.getMsg(10, 0)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var page = this.data.curPage + 1
            this.getMsg(10, page);
        }
    },
})