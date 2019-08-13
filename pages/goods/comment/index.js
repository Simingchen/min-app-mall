const util = require('../../../utils/util.js');
Page({
    data: {
        options: "",   // 参数
        itemsData: "",
        isLoadData: true,   // 是否可加载数据
        items: [],     // 数据
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
    },
    getList: function (options, page, size) {
        var that = this;
        var url = "getGoodsCommnetList.ashx"
        var params = {};
        params.Page = page;
        params.Size = size;
        params.Index = options.index;
        params.Number = options.number;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                var items = [];
                var isLoadData = false;

                if (oData.Status === "200") {
                    if (page == 0) {
                        items = oData.Data[0].List
                    } else {
                        items = that.data.items.concat(oData.Data[0].List);
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        isLoadData = false;
                    } else {
                        isLoadData = true;
                    }
                    that.setData({
                        items,
                        isLoadData,
                        curPage: page,
                        itemsData: oData.Data[0]
                    })
                }
            }
        })
    },
    onLoad: function (options) {
        this.setData({
            options: options
        })
        this.getList(options, 0, 10);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var options = this.data.options;
            var page = this.data.curPage + 1
            this.getList(options, page, 10);
        }
    },
})
