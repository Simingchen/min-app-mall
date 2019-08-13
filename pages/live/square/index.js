const util = require('../../../utils/util.js');
Page({
    data: {
        slide:{
            indicatorDots: true,
            color: "#fff",
            activeColor: "#000",
            autoplay: true,
            interval: 5000,
            duration: 300,
        },
        banner: [],   // 轮播图
        navList: [],    // 导航分类
        navCurId: "",   // 当前导航ID
        liveList: [],
        isLoadData: true,   // 是否可加载数据
        totalPages: 0,         // 所有页数
        curPage: 0,           // 当前页数
    },
    getMsg() {
        var that = this;
        var params = {};
        var url = "getLiveTopic.ashx"

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data
                that.setData({
                    navList: oData
                });
                that.setData({
                    navCurId: oData[0].ID
                });
                that.getList(0, oData[0].ID)
            },
        })
    },
    // 获取轮播
    getBannerList: function (type, data) {
        var that = this;
        var params = new Object();
        var url = "getBannerList.ashx"
        params.GameID = data;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data
                that.setData({
                    [type]: oData
                });
            },
        })
    },
    // 切换导航
    switchTab (e) {
        let id = e.currentTarget.dataset.id;
        this.getList(0, id)
    },
    // 获取列表
    getList: function (page, sortId, IsRecommend) {
        var that = this;
        var params = {};
        var url = "getRecommendLive.ashx"
        params.Page = page;
        params.LiveTopicID = sortId;
        params.IsRecommend = 0;
        
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    var liveList = [];
                    var isLoadData = false;
                    if (page == 0) {
                        liveList = oData.Data[0].List
                    } else {
                        liveList = that.data.liveList.concat(oData.Data[0].List);
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        isLoadData = false;
                    } else {
                        isLoadData = true;
                    }
                    that.setData({
                        navCurId: sortId,
                        liveList,
                        isLoadData,
                        curPage: page,
                    })
                }
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var id = this.data.navCurId;
            var page = this.data.curPage + 1
            this.getList(page, id);
        }
    },
    onLoad: function () {
        this.getMsg()
        // 首页顶部
        this.getBannerList('banner', '109A0875-928A-4D3C-B8AD-73393B2AD59E');
    },
    onShow() {
        this.getMsg()
    }
})
