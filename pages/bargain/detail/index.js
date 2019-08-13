const util = require('../../../utils/util.js');
var app = getApp().globalData,
    timer = app.timer;
Page({
    data: {
        prepath: "",
        BargainID: "", // 砍价ID
        isShowPopup: 0, // 显示弹窗
        BargainMemberID: "",    // 会员记录ID
        bargain: {},
        goods: {},
        countDownNum: 0,
        percentage: '',
        timer: "",
        wxTimerList: {}
    },
    // 开始砍价
    startBargain(BargainID, GoodsSkuID, ReceiverAddressID) {
        var that = this;
        var params = {};
        var url = "startBargain.ashx"
        params.BargainID = BargainID;
        params.GoodsSkuID = GoodsSkuID;
        params.ReceiverAddressID = ReceiverAddressID;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0].Data[0];
                that.setData({
                    bargain: oData,
                    BargainMemberID: oData.BargainMemberID,
                    isShowPopup: true,
                })
                // 获取详情
                that.getMsg(oData.BargainMemberID);
            },
        })
    },
    getMsg(id) {
        var that = this;
        var params = {};
        var url = "getBargainMemberDetails.ashx"
        params.BargainMemberID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    goods: oData
                });

                // 百分比进度条
                let per = (oData.BargainBalance / oData.Price) * 100 + "%";
                that.setData({
                    percentage: per,
                })

                that.countDown(oData.RemainingTime);
            },
        }, true)
    },
    // 砍价
    hlepBargain(BargainID, BargainMemberID) {
        var that = this;
        var params = {};
        var url = "helpBargain.ashx"
        params.BargainID = that.data.BargainID;
        params.BargainMemberID = that.data.BargainMemberID;
        console.log(that.data)
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                console.log(oData)
                if (oData.Status == 200) {
                    that.setData({
                        bargain: oData.Data[0],
                        isShowPopup: true,
                    })
                } 
            },
        })
    },
    onLoad: function(options) {
        if (options.prepath == "goods") {
            this.startBargain(options.bargain, options.goodsId, options.address);
            this.setData({
                BargainID: options.bargain,
                prepath: options.prepath
            })
            return false;
        }
        if (options.prepath == "mybargain") {
            // 获取砍价信息
            this.getMsg(options.id);
            this.setData({
                BargainMemberID: options.id,
                BargainID: options.bargainid
            })
            return false;
        }
        if (options.prepath == "share") {
            // 获取砍价信息
            this.getMsg(options.id);
            this.setData({
                BargainMemberID: options.id,
                BargainID: options.bargain,
                prepath: options.prepath
            })
        }
    },
    onShareAppMessage: function() {
        var shareObj = {　　
            title: "我发现一件好货，一起砍价免费拿", // 默认是小程序的名称(可以写slogan等)
            path: '/pages/bargain/detail/index?id=' + this.data.BargainMemberID + "&bargain=" + this.data.BargainID + "&prepath=share", 
            imgUrl: '',
            uccess: function(res) {　　　 // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {　　　}　　
            },
            fail: function(res) { // 转发失败之后的回调
                if (res.errMsg == 'shareAppMessage:fail cancel') {　// 用户取消转发
                } else if (res.errMsg == 'shareAppMessage:fail') {　// 转发失败
                }　　
            },
            complete: function() { // 转发结束之后的回调（转发成不成功都会执行）
            }　　
        };
        return shareObj;
    },
    countDown: function(data) {
        var that = this;
        //开启第一个定时器
        var wxTimer1 = new timer({
            beginTime: data,
            name: 'wxTimer1',
            complete: function () {
                that.setData({
                    ["goods.Status"]: 2
                })
            }
        })
        wxTimer1.start(this);
    },
    // 关闭弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
});