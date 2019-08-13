const util = require('../../../utils/util.js');
const app = getApp()
Page({
    data: {
        curTab: 1,
        hotList: [],
        newestList: [],
        isEditStatus: false,     // 是否在编辑状态
        allSelectBtn: false,     // 选定所有商品
        allSelectDeleted: false,  // 选定所有删除项(编辑模式)
        isAllSelectDeleted: false, // 是否全选还是取消全选(编辑模式)
        totalNum2: 0,            // 选定删除商品数量(编辑模式)
        editTxt: "编辑",         // 编辑文字
    },
    switchTab (e) {
        this.setData({
            curTab: e.currentTarget.dataset.type
        })
    },
    // 列表
    getList(Type) {
        var that = this;
        var params = new Object();
        var url = "getTopicList.ashx"
        params.Size = 5;
        params.Page = 0;
        params.TopicStatus = 1;
        // params.CategoryID = null;
        // params.MemberID = 0;
        params.TopicType = 0;
        params.Type = Type;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                if (Type == 1) {
                    that.setData({
                        newestList: oData.List
                    });
                }
                if (Type == 2) {
                    that.setData({
                        hotList: oData.List
                    });
                }
            },
        })
    },
    // 分类
    getSort() {
        var that = this;
        var params = new Object();
        var url = "getTopicCategory.ashx"
        params.Size = 7;
        params.Page = 0;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data
                that.setData({
                    sortList: oData
                });
            },
        })
    },
    // 更改状态为编辑或完成
    changeEditStatue: function () {
        this.setData({
            isEditStatus: !this.data.isEditStatus
        })
        var editTxt = this.data.isEditStatus ? "完成" : "编辑";

        this.setData({
            editTxt: editTxt
        })
    },
    // 点击全选 flag:true 选中全选 false 取消全选
    allSelectDeleted: function (e) {
        var that = this;
        var flag = e.currentTarget.dataset.flag;
        // this.data.allSelectBtn = flag;
        var deleted = "";

        // 全选标志
        this.setData({
            isAllSelectDeleted: !flag
        })

        this.data.cartItems.forEach((item, index) => {
            deleted = 'cartItems[' + index + '].deleted';
            // 全选商店
            if (deleted) {
                that.setData({
                    [deleted]: !flag
                })
            }

            // 全选商品
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                var deleted = goods + '[' + goodsIndex + '].deleted';
                if (deleted) {
                    that.setData({
                        [deleted]: !flag
                    })
                }
            })
        })
        // 计算总金额
        this.calTotalDeletedNum();
    },
    // 计算删除勾选的商品数
    calTotalDeletedNum: function () {
        var that = this;
        // var totalMoney = 0;
        var totalNum = 0;

        // 设置选定数量
        that.setData({
            totalNum2: totalNum
        })

        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                if (goodsItem.deleted) {
                    totalNum += 1;
                    // 设置选定数量
                    that.setData({
                        totalNum2: totalNum
                    })
                }
            })
        })
    },
    // 删除操作************************************
    // 勾选单品删除
    selectDeleted: function (e) {
        var that = this;
        var goodsId = e.currentTarget.dataset.id;
        var flag = e.currentTarget.dataset.deleted;
        var product = e.currentTarget.dataset.item;

        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            if (product.StoreID == item.StoreID) {
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    if (goodsId == goodsItem.ID) {
                        var deleted = goods + '[' + goodsIndex + '].deleted';
                        if (deleted) {
                            that.setData({
                                [deleted]: !flag
                            })
                        }
                    }
                })
            }
        })

        // 检测当前商店
        this.checkShopDeleted(product);
        // 检测所有
        this.checkAllDeleted();
    },
    // 删除所选项
    goDeleted: function () {
        var that = this;
        var selectGoods = [];
        this.data.cartItems.forEach((item, index) => {
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                if (goodsItem.deleted) {
                    var addItem = {};
                    addItem.OID = goodsItem.ID
                    selectGoods.push(addItem);
                }
            })
        })

        wx.showModal({
            title: '提示',
            content: '确定删除所选项吗？',
            confirmColor: "#f6819e",
            success: function (res) {
                if (res.confirm) {
                    // 执行删除接口
                    var url = "deleteFromCart.ashx"
                    var params = new Object();
                    params.LstOrderDetails = selectGoods;
                    util.POST({
                        url: url,
                        params: JSON.stringify(params),
                        success: function (res) {
                            var oData = res.data[0]

                            if (oData.Status == 200) {
                                // 过滤有删除标记的商品
                                var newCartItems = [];
                                var newGoods = [];
                                that.data.cartItems.forEach((item, index) => {
                                    if (!item.deleted) {
                                        newGoods = item.LstOrderDetails.filter((goodsItem, goodsIndex) => {
                                            return !goodsItem.deleted;
                                        })
                                        item.LstOrderDetails = newGoods;
                                        newCartItems.push(item)
                                    }
                                })

                                that.setData({
                                    cartItems: newCartItems
                                })
                                that.calTotalDeletedNum();
                                // 计算总金额
                                that.calTotalMoney();
                            } else {
                                wx.showToast({
                                    icon: 'none',
                                    title: oData.Msg,
                                    duration: 1000
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

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    onLoad: function () {
        this.getList(1);
        this.getList(2);
        this.getSort();
        //获取到globadata的值
        this.data.imageUrlPath = app.globalData.imageUrlPath;
        this.setData({
            imageUrlPath: this.data.imageUrlPath
        })
    },
})
