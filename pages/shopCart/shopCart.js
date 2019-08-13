// pages/shopCart/shopCart.js
const util = require('../../utils/util.js');
Page({
    data: {
        isLogin: false,
        totalMoney: 0,           // 选定总金额
        totalNum: 0,             // 选定商品数量
        isAllSelect: false,      // 是否全选还是取消全选
        isEditStatus: false,     // 是否在编辑状态
        allSelectBtn: false,     // 选定所有商品
        allSelectDeleted: false,  // 选定所有删除项(编辑模式)
        isAllSelectDeleted: false, // 是否全选还是取消全选(编辑模式)
        totalNum2: 0,            // 选定删除商品数量(编辑模式)
        editTxt: "编辑",         // 编辑文字
        curProduct: "",          // 删除单选当前的选中商品
        isMultProduct: 1,       // 是否选中并删除多个商品 0为单个删除 1为全部删除 2为失效删除
        totalPages: 1,           // 所有页数
        curPage: 1,              // 当前页数
        cartItems: []// 购物车列表数据
    },
    // 获取信息
    getGoods: function () {
        var that = this;
        var url = "getMyCart.ashx"
        var params = new Object();

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        cartItems: oData.Data[0].List
                    })
                }
            }
        })
    },
    // 点击全选 flag:true 选中全选 false 取消全选
    allSelect: function (e) {
        var that = this;
        var flag = e.currentTarget.dataset.flag;
        var checked = "";

        // 全选标志
        this.setData({
            isAllSelect: !flag
        })

        this.data.cartItems.forEach((item, index) => {
            checked = 'cartItems[' + index + '].checked';
            // 全选商店
            if (checked) {
                that.setData({
                    [checked]: !flag
                })
            }
            
            // 全选商品
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                var checked = goods + '[' + goodsIndex + '].checked';
                if (checked) {
                    that.setData({
                        [checked]: !flag
                    })
                }
            })
        })
        // 计算总金额
        this.calTotalMoney();
    },
    // 商店选择
    selectShop: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var flag = e.currentTarget.dataset.checked;
        var checked = "";
        this.data.cartItems.forEach((item, index) => {
            checked = 'cartItems[' + index + '].checked';
            if (checked) {
                if (id == item.StoreID) {
                    that.setData({
                        [checked]: !flag
                    })
                }
            }
        })
        
        // 检测商店子商品全选非全选
        this.checkGoods(id, flag);

        // 检测所有
        this.checkAll();
    },
    // 单个商品选择
    selectProduct: function (e) {
        var that = this;
        var goodsId = e.currentTarget.dataset.id;
        var flag = e.currentTarget.dataset.checked;
        var product = e.currentTarget.dataset.item;
        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            if (product.StoreID == item.StoreID) {
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    if (goodsId == goodsItem.ID) {
                        var checked = goods + '[' + goodsIndex + '].checked';
                        that.setData({
                            [checked]: !flag
                        })
                    }
                })
            }
        })

        // 检测当前商店
        this.checkShop(product);
        // 检测所有
        this.checkAll();
    },
    // 检测商店子商品全选非全选
    checkGoods: function (id, flag) {
        var that = this;
        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            if (id == item.StoreID) {
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    var checked = goods + '[' + goodsIndex + '].checked';
                    if (checked) {
                        that.setData({
                            [checked]: !flag
                        })
                    }
                })
            }
        })

        // 计算总金额
        this.calTotalMoney()
    },
    // 检测商店全选非全选
    checkShop: function (product) {
        // 全部选中则全选点亮
        var that = this;
        var checkAllFlags = true;
        var checkIndex = "";    // 需要检索的商店
        this.data.cartItems.forEach((item, index) => {
            if (product.StoreID == item.StoreID) {
                checkIndex = index;
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    checkAllFlags = checkAllFlags && goodsItem.checked;
                })
            }
        })

        // 操作
        var checked = 'cartItems[' + checkIndex + '].checked';
        if (checked) {
            that.setData({
                [checked]: checkAllFlags
            })
        }

        // 计算总金额
        this.calTotalMoney()
    },
    // 检测所有全选非全选
    checkAll: function () {
        // 全部选中则全选点亮
        var that = this;
        var checkAllFlags = true;
        var checkIndex = "";    // 需要检索的商店
        this.data.cartItems.forEach((item, index) => {
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                checkAllFlags = checkAllFlags && goodsItem.checked;
            })
        })

        // 操作全选标志
        this.setData({
            isAllSelect: checkAllFlags
        })
    },
    // 计算总金额，计算勾选的商品数
    calTotalMoney: function () {
        var that = this;
        var totalMoney = 0;
        var totalNum = 0;
        
        // 清空设置选定价格
        that.setData({
            totalMoney: totalMoney
        })
        // 设置选定数量
        that.setData({
            totalNum: totalNum
        })

        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                if (goodsItem.checked) {
                    totalMoney = (totalMoney * 100 + goodsItem.SingelPrice * goodsItem.Quantity * 100) / 100
                    totalNum += 1;
                    // 设置选定价格
                    that.setData({
                        totalMoney: totalMoney
                    })
                    // 设置选定数量
                    that.setData({
                        totalNum: totalNum
                    })
                }
            })
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
    // 加减商品数量
    changeQuantity: function (e) {
        var that = this;
        var goodsId = e.currentTarget.dataset.id;
        var product = e.currentTarget.dataset.item;
        var type = e.currentTarget.dataset.type;
        var nums = null;
        var nowNum = null;

        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            if (product.StoreID == item.StoreID) {
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    if (goodsId == goodsItem.ID) {
                        var nowNum = this.data.cartItems[index].LstOrderDetails[goodsIndex].Quantity;
                        
                        nums = goods + '[' + goodsIndex + '].Quantity';
                        
                        if (type > 0) {
                            nowNum++;
                        } else {
                            nowNum > 1 ? nowNum-- : nowNum = 1;
                        }
                        
                        var url = "saveQuantityForCart.ashx";
                        var params = {};
                        params.OID = goodsId;
                        params.Quantity = nowNum;
                        util.POST({
                            url: url,
                            params: JSON.stringify(params),
                            success: function (res) {
                                var oData = res.data[0]
                                if (oData.Status == 200) {
                                    that.setData({
                                        [nums]: nowNum
                                    })

                                    // 计算总金额
                                    that.calTotalMoney();
                                }
                            }
                        })
                    }
                })
            }
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
    // 勾选商店删除
    selectShopDeleted: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var flag = e.currentTarget.dataset.deleted;
        var deleted = "";
       
        this.data.cartItems.forEach((item, index) => {
            deleted = 'cartItems[' + index + '].deleted';
            
            if (deleted) {
                if (id == item.StoreID) {
                    that.setData({
                        [deleted]: !flag
                    })
                }
            }
        })

        // 检测商店子商品全选非全选
        this.checkDeletedGoods(id, flag);

        // 检测所有
        this.checkAllDeleted();
    },
    // 检测商店子商品全选非全选删除状态
    checkDeletedGoods: function (id, flag) {
        var that = this;
        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].LstOrderDetails';
            if (id == item.StoreID) {
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    var deleted = goods + '[' + goodsIndex + '].deleted';
                    if (deleted) {
                        that.setData({
                            [deleted]: !flag
                        })
                    }
                })
            }
        })

        // 计算删除数量
        this.calTotalDeletedNum()
    },
    // 检测商店删除全选非全选
    checkShopDeleted: function (product) {
        // 全部选中则全选点亮
        var that = this;
        var checkAllFlags = true;
        var checkIndex = "";    // 需要检索的商店
        this.data.cartItems.forEach((item, index) => {
            if (product.ID == item.ID) {
                checkIndex = index;
                item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                    checkAllFlags = checkAllFlags && goodsItem.deleted;
                })
            }
        })

        // 操作
        var deleted = 'cartItems[' + checkIndex + '].deleted';
        if (deleted) {
            that.setData({
                [deleted]: checkAllFlags
            })
        }

        // 计算删除数量
        this.calTotalDeletedNum()
    },
    // 检测所有全选非全选
    checkAllDeleted: function () {
        // 全部选中则全选点亮
        var that = this;
        var checkAllFlags = true;
        var checkIndex = "";    // 需要检索的商店
        this.data.cartItems.forEach((item, index) => {
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                checkAllFlags = checkAllFlags && goodsItem.deleted;
            })
        })

        // 操作全选标志
        this.setData({
            isAllSelectDeleted: checkAllFlags
        })
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
    // 结算商品
    goPay: function () {
        var selectGoods = [];
        this.data.cartItems.forEach((item, index) => {
            item.LstOrderDetails.forEach((goodsItem, goodsIndex) => {
                if (goodsItem.checked) {
                    var addItem = {
                        OID: null
                    }
                    addItem.OID = goodsItem.ID;
                    selectGoods.push(addItem)
                }
            })
        })
        var url = "submitCart.ashx";
        var params = new Object();
        params.OrderDetailsList = selectGoods;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    // 购物车结算到订单
                    wx.navigateTo({
                        url: "/pages/order/submit/index?id=" + oData.Data[0].Token
                    })
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
    onLoad: function (options) {
        
    },
    onShow () {
        this.getGoods()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    goUrl () {
        
    }
})