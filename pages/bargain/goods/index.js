const util = require('../../../utils/util.js');
Page({
    data: {
        bargainId: "",    // 砍价ID
        isShowPopup: false,    // 显示弹窗
        goods: {},
        address: []
    },
    getMsg(id) {
        var that = this;
        var params = {};
        var url = "getBargainDetails.ashx"
        params.BargainID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                console.log(oData)
                that.setData({
                    goods: oData
                });
            },
        })
    },
    // 获取地址信息
    getAddress: function () {
        var that = this;
        var url = "getAddressList.ashx"
        var params = new Object();
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        address: oData.Data
                    })
                }
            }
        })
    },
    // 选择地址
    chooseAddress (e) {
        wx.navigateTo({
            url: '/pages/bargain/detail/index?address=' + e.currentTarget.dataset.id + '&bargain=' + this.data.bargainId + '&goodsId=' + this.data.goods.GoodsID,
        })
    },
    // 砍价
    bargain (id) {
        // var that = this;
        // var params = new Object();
        // var url = "getSubject.ashx"
        // params.Page = 0;
        // params.SubjectID = id;

        // util.POST({
        //     url: url,
        //     params: JSON.stringify(params),
        //     success: function (res) {
        //         var oData = res.data[0].Data[0]
                
        //     },
        // })
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
    onLoad: function (options) {
        options.id = "f80dbb9e-c717-41f9-b398-bd609d6facff"
        this.getMsg(options.id);
        this.getAddress();
        this.setData({
            bargainId: options.id
        })
    },
    onShareAppMessage: function () {
        return {
            title: '自定义转发标题',
            path: '/pages/bargain/goods/index?id=' + this.data.bargainId
        }
        var that = this;
        // 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
        　　title: "转发的标题",        // 默认是小程序的名称(可以写slogan等)
            path: '/pages/bargain/goods/index?id=' + this.data.bargainId,        // 默认是当前页面，必须是以‘/’开头的完整路径
        　　imgUrl: '',     //可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        　　success: function (res) {
            　　　// 转发成功之后的回调
            　　　if (res.errMsg == 'shareAppMessage:ok') {
            　　　}
        　　},
        　　fail: function () {// 转发失败之后的回调
            　　if (res.errMsg == 'shareAppMessage:fail cancel') {
                　　　　　　　　// 用户取消转发
            　　} else if (res.errMsg == 'shareAppMessage:fail') {
                　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
            　　}
        　　},
            complete: function() { // 转发结束之后的回调（转发成不成功都会执行）
        　　}
    　　};
        return shareObj;
    },
    // 关闭弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
});

