const util = require('../../../utils/util.js');
let QRCode = require("../../../utils/qrcode.js").default;

Page({
    data: {
        isShowPopup: false,
        user: {},
        qrtext: 'asdf sdfa sdfg',
        wulius: [
            {
                id:"123",
                img: "https://gw.alicdn.com/bao/uploaded/TB1d8VQSpXXXXclapXXL6TaGpXX_140x10000Q75.jpg_.webp",
                items:[
                    {
                        time: "2018-06-16",
                        txt: "到达：广东深圳公司 已揽件",
                    },
                    {
                        time: "2018-06-16",
                        txt: "到达：广东深圳公司 已揽件"
                    },
                ]
            },
            {
                id: "1023",
                img: "https://gw.alicdn.com/bao/uploaded/TB1d8VQSpXXXXclapXXL6TaGpXX_140x10000Q75.jpg_.webp",
                items: [
                    {
                        time: "2018-06-16",
                        txt: "到达：广东深圳公司 已揽件"
                    },
                    {
                        time: "2018-06-16",
                        txt: "到达：广东深圳公司 已揽件"
                    },
                ]
            }
        ]
    },
    getMsg: function () {
        var that = this;
        var url = "getMember.ashx"
        util.POST({
            url: url,
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        user: oData.Data[0]
                    })
                }
            }
        }, true)
    },
    // 切换二维码弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
        return false;
        // this.createQRcode()
    },
    //单击生成二维码触发
    createQRcode: function () {
        this.QR.clear();
        this.QR.makeCode(this.data.qrtext);
    },
    onLoad: function (options) {
        this.getMsg();

        // 获取手机信息
        let sysinfo = wx.getSystemInfoSync();

        let qrcode = new QRCode('qrcode', {
            text: 'dfsgdsfgdfg',
            //获取手机屏幕的宽和长  进行比例换算
            //二维码底色尽量为白色， 图案为深色
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.correctLevel.H
        });
        //将一个局部变量共享
        this.QR = qrcode;

    },
    onShow: function () {  // 设置保存上一页的数据
        this.getMsg();
    },
})