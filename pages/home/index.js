const app = getApp()
const util = require('../../utils/util.js');
Page({
    data: {
        topBanner: {
            indicatorDots: true,
            color: "#fff",
            activeColor: "#000",
            autoplay: true,
            interval: 5000,
            duration: 300,
            circular: true,
            list: []
        },
        floorBanner: {
            indicatorDots: true,
            color: "#fff",
            activeColor: "#000",
            autoplay: true,
            interval: 5000,
            duration: 300,
            circular: true,
        },
        adList: [],
        commentList: {
            tit: "话题",
            enTit: "CONVERSATION",
        },
        live: {   // 直播
            id: 123423,
            tit: "直播精选",
            enTit: "LIVE SELECTION",
            room: []
        },
        floorList:[ ],   // 楼层
        lifeList:[],
        recommendShop: [ ], // 每日好店
        likeGoods:[ ],// 猜你喜欢
        bargain: {
            background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
            indicatorDots: true,
            // autoplay: true,
            circular: true,
            interval: 2000,
            duration: 500,
            previousMargin: 0,
            nextMargin: 0,
            current: 1,
            list: []
        }
    },
    // 获取轮播
    getBannerList: function (type, data) {
        var that = this;
        var params = {};
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
    // 顶部广告位
    getAd () {
        var that = this;
        var params = {};
        var url = "getSubjectList.ashx";
        params.Page = 0;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0];
                that.setData({
                    adList: oData.List
                });
            },
        })
    },
    // 话题
    getCommentList () {
        var that = this;
        var params = {};
        var url = "getTopicList.ashx"
        params.Size = 5;
        params.Page = 0;
        params.TopicStatus = 1;
        // params.CategoryID = null;
        // params.MemberID = 0;
        params.TopicType = 0;
        params.Type = 0;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    ["commentList.list"]: oData.List
                });
            },
        })
    },
    // 珠光宝气
    getJew() {
        var that = this;
        var params = {};
        var url = "getCategoryNavigation.ashx"
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                   lifeList: oData.List
                });
            },
        })
    },
    // 直播列表
    getLive () {
        var that = this;
        var params = {};
        var url = "getLiveIn.ashx"
        params.Size = 7;
        params.Page = 0;
        
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    ["live.room"]: oData.List
                });
            },
        })
    },
    // 获取楼层
    getFloorList: function () {
        var that = this;
        var params = {};
        var url = "getFloorList.ashx"
        params.Size = 4;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    floorList: oData.List
                });
            },
        })
    },
    // 每日好店
    getRecommendShop () {
        var that = this;
        var params = {};
        var url = "getRecommendStore.ashx"
        params.Size = 4;
        params.Page = 0;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    recommendShop: oData.List
                });
            },
        })
    },
    getBargainList() {
        var that = this;
        var params = {};
        var url = "getBargainList.ashx"
        params.Page = 0;
        params.Size = 3
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    ['bargain.list']: oData.List
                });
            },
        })
    },
    bargainSwiperChange (e) {
        if (e.detail.source == 'touch') {
            this.setData({
                ["bargain.current"]: e.detail.current
            })
        }
    },
    // 获取猜你喜欢
    getLikeGoods: function () {
        var that = this;
        var params = {};
        var url = "getGoodsByRadom.ashx"
        params.Size = 10;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    likeGoods: oData.List
                });
            },
        })
    },
    onLoad: function () {
        // 首页顶部
        this.getBannerList('topBanner.list', '377FC847-D2C0-4778-B167-2B5155700FEA');
        // 顶部广告位
        this.getAd();
        // 话题
        this.getCommentList();
        // 直播列表
        this.getLive()
        // 楼层
        this.getFloorList();
        // 每日好店
        this.getRecommendShop();
        // 生活爱我
        // this.getBannerList('lifeList','7CBE1B2A-FDBC-44F8-AC80-D4DFA4546CD0'); 
        this.getJew();
        // 砍价
        this.getBargainList()
        // 猜你喜欢
        this.getLikeGoods();
        var that = this;
        //获取到globadata的值
        that.data.imageUrlPath = app.globalData.imageUrlPath;
        that.setData({
            imageUrlPath: that.data.imageUrlPath
        })
    },
    onShow() {
        this.getLive()
    }
})
