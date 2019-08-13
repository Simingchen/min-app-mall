const util = require('../../../utils/util.js');

Page({
    data: {
        token: null,
        PaymentTypeID: "",   // 支付id
        express: {},
        input: {},  // 快递与优惠券的索引表单输入
        order: {},
        isanonymous: false,  // 是否匿名
        allPrice: 0,
        allExpressPrice: 0,
        isShowPayPoup: false,
    },
    // 获取订单
    getOrder: function (Token, RAID) {
        var that = this;
        var url = "getTrade.ashx"
        var params = new Object();
        params.Token = Token;
        params.RAID = RAID,
        that.setData({
            token: params.Token
        })
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    that.setData({
                        order: oData.Data[0]
                    })

                    let indexObject = {}
                    var storeList = that.data.order.StoreDetailsList;
                    storeList.forEach((item, index) => {
                        indexObject['expressIndex' + index] = 0 // 快递索引
                        indexObject['couponIndex' + index] = 0 //优惠券索引
                        indexObject['leavemsg' + index] = "" // 留言

                        var expressChecked = "order.StoreDetailsList[" + index + "].LogistList[0].checked";

                        if (item.CouponList.length) {  // 有优惠券才默认设置第一个为checked
                            var couponCheck = "order.StoreDetailsList[" + index + "].CouponList[0].checked";
                            that.setData({
                                [couponCheck]: true,
                            })
                        }
                        
                        that.setData({
                            [expressChecked]: true,
                        })
                    })
                    
                    that.setData({
                        input: indexObject,
                    })
                    
                    that.getAllprice()
                }
            }
        })
    },
    // 获取全部价格
    getAllprice(expressIndex = 0) {
        let allPrice = 0;
        let allExpressPrice = 0;
        this.data.order.StoreDetailsList.forEach((item, index) => {
            item.LogistList.forEach((subItem, subIndex) => {
                if (subItem.checked) {
                    allPrice = allPrice + Number(item.TotalPrice) + Number(item.LogistList[subIndex].DefaultPrice);
                    
                    allExpressPrice = allExpressPrice + Number(item.LogistList[subIndex].DefaultPrice);
                }
            })
        })

        this.setData({
            allPrice,
            allExpressPrice: allExpressPrice.toFixed(2)
        })
    },
    // 获取支付方式
    getPayId: function (id) {
        var that = this;
        var url = "getPayType.ashx"
        var params = new Object();

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        PaymentTypeID: oData.Data[0]
                    })
                }
            }
        })
    },
    // 获取收货人信息
    getExpress: function () {
        var that = this;
        var url = "getDefaultLogistics.ashx"
        var params = {};
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    if (oData.Data[0].GetNotAnyAddress == 1) {   // 没有获得地址去添加地址
                        wx.navigateTo({
                            url: '/pages/center/addrNew/addNew?backpage=submitorder&token=' + that.data.token,
                        })
                    }
                    that.setData({
                        express: oData.Data[0]
                    })
                }
            }
        })
    },
    // 配送方式改变
    bindExpressChange: function (e) {  
        var that = this;
        let CheckIndex = e.currentTarget.dataset.index;
        var storeList = that.data.order.StoreDetailsList;
        
        storeList[CheckIndex].LogistList.forEach((subItem, subIndex) => {
            var expressChecked = "order.StoreDetailsList[" + CheckIndex + "].LogistList[" + subIndex + "].checked";
            that.setData({
                [expressChecked]: false,
            })
        })
        var expressChecked = "order.StoreDetailsList[" + CheckIndex + "].LogistList[" + e.detail.value + "].checked";
        that.setData({
            [expressChecked]: true,
        })

        this.setData({
            ["input.expressIndex" + CheckIndex]: e.detail.value,
        })
        // console.log(that.data.order.StoreDetailsList)
        this.getAllprice();
    },
    // 优惠券改变
    couponChange (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            ["input.couponIndex" + index]: e.detail.value
        })
    },
    // 录入信息
    inputMsg (e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            ["input.leavemsg" + index]: e.detail.value
        })
    },
    // 匿名按钮
    switchChange (e) {
        this.setData({
            ["isanonymous"]: e.detail.value
        })
    },
    // 支付弹窗
    togglePayPoup() {
        console.log("df")
        this.setData({
            isShowPayPoup: !this.data.isShowPayPoup
        })
    },
    // 提交订单
    submitOrder: function () {
        var that = this;
        var selectOrder = [];
        var url = "batchSubmitTrade.ashx";
        var params = {
            RAID: this.data.express.ID,  // 收货人地址ID
            PaymentTypeID: "6b9a6e2b-2cc9-4fb0-9439-152da05f6a72",  // 支付方式ID
            // LID: null,  // 配送方式ID
            // BuyRemark: null,  // 买家备注
            // InvoiceRise: null,  // 发票抬头
            // CouponNumber: null,   // 优惠券编码
        };

        let dataObject = this.data;
        dataObject.order.StoreDetailsList.forEach((storeItems, index) => {
            var addItem = {
                OID: null
            }
            var addItem = {
                LID: null,  // 配送方式ID
                BuyRemark: null,  // 买家备注
                InvoiceRise: null,  // 发票抬头
                CouponNumber: null,   // 优惠券编码
                OrderDetailsList: []
            };

            var OrderDetailsList = [];
            addItem.LID = storeItems.LogistList[Number(dataObject.input['expressIndex' + index])].ID;
            if (storeItems.CouponList.length > 0) {
                addItem.CouponNumber = storeItems.CouponList[Number(dataObject.input['couponIndex' + index])].Number;
            }
            addItem.BuyRemark = dataObject.input['leavemsg' + index];
            storeItems.DetailsList.forEach((item, index) => {
                var goodsObject = {
                    OrderDetailsID: null
                }
                goodsObject.OrderDetailsID = item.ID
                OrderDetailsList.push(goodsObject);
            })

            addItem.OrderDetailsList = OrderDetailsList;
            selectOrder.push(addItem)
        })
        params.TradeList = selectOrder;

        // console.log(params)
        // return false;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                wx.showToast({
                    icon: 'none',
                    title: "触发微信支付...",
                    duration: 1000
                })
                if (oData.Status == 200) {
                    // 微信支付
                    util.PAY(oData.Data[0].Number, {
                        success() {
                            wx.redirectTo({
                                url: "/pages/order/list/index"
                            })
                        },
                        fail() {
                            wx.redirectTo({
                                url: "/pages/order/list/index"
                            })
                        }
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    icon: 'none',
                    title: "失败"
                })
            },
        })
    },
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                token: options.id
            })
            this.getOrder(options.id)
        }
        
        this.getPayId();
    },
    onShow() {
        this.getExpress();
        let pages = getCurrentPages();
        let curPage = pages[pages.length - 1]  // 当前页面
        if (curPage.data.token) {
            this.setData({
                token: curPage.data.token
            })
            this.getOrder(curPage.data.token)
        }
    }
})