const util = require('../../../utils/util.js');
Page({
    data: {
        isShowAttent: true,
        isShowDialog: false,    // 是否显示加入购物车弹窗
        video: "",
    },
    getMsg (id) {
        var that = this;
        var params = new Object();
        var url = "getPlayBackByID.ashx"
        params.ID = id;
        
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0].File
                that.setData({
                    video: oData
                });
            },
        })
    },
    // 关不关注信息
    hideAttent: function () {
        this.setData({
            isShowAttent: false
        })
    },
    // 加入购物车
    addCart: function (e) {
        var id = e.currentTarget.dataset.id;
        this.setData({
            isShowDialog: true
        })
    },
    // 关闭加入购物车
    hideCart: function (e) {
        var id = e.currentTarget.dataset.id;
        this.setData({
            isShowDialog: false
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id);
    }
});  

