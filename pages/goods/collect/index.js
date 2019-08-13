const util = require('../../../utils/util.js');
Page({
    data: {
        curPage: 0,
        isLoadData: true,   // 是否可加载数据
        isLogin: false,
        totalMoney: 0,           // 选定总金额
        totalNum: 0,             // 选定商品数量
        isAllSelect: false,      // 是否全选还是取消全选
        isEditStatus: true,     // 是否在编辑状态
        allSelectBtn: false,     // 选定所有商品
        allSelectDeleted: false,  // 选定所有删除项(编辑模式)
        isAllSelectDeleted: false, // 是否全选还是取消全选(编辑模式)
        totalNum2: 0,            // 选定删除商品数量(编辑模式)
        editTxt: "编辑",         // 编辑文字
        curProduct: "",          // 删除单选当前的选中商品
        isMultProduct: 1,       // 是否选中并删除多个商品 0为单个删除 1为全部删除 2为失效删除
        totalPages: 1,           // 所有页数
        curPage: 1,              // 当前页数
        cartItems: [   // 列表数据
            
        ]
    },
    // 删除操作************************************
    // 勾选单品删除
    selectDeleted: function (e) {
        var that = this;
        var goodsId = e.currentTarget.dataset.id;
        var flag = e.currentTarget.dataset.deleted;
        var product = e.currentTarget.dataset.item;

        this.data.cartItems.forEach((item, index) => {
            var goods = 'cartItems[' + index + '].List';
            if (product.ID == item.ID) {
                item.List.forEach((goodsItem, goodsIndex) => {
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
                if (id == item.ID) {
                    console.log(deleted)
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
            var goods = 'cartItems[' + index + '].List';
            if (id == item.ID) {
                item.List.forEach((goodsItem, goodsIndex) => {
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
                item.List.forEach((goodsItem, goodsIndex) => {
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
            item.List.forEach((goodsItem, goodsIndex) => {
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
            var goods = 'cartItems[' + index + '].List';
            item.List.forEach((goodsItem, goodsIndex) => {
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
            var goods = 'cartItems[' + index + '].List';
            item.List.forEach((goodsItem, goodsIndex) => {
                var deleted = goods + '[' + goodsIndex + '].deleted';
                if (deleted) {
                    that.setData({
                        [deleted]: !flag
                    })
                }
            })
        })
        // 计算总数量
        this.calTotalDeletedNum();
    },
    // 删除所选项
    goDeleted: function () {
        var that = this;
        var selectGoods = [];
        var item = {};
        this.data.cartItems.forEach((item, index) => {
            item.List.forEach((goodsItem, goodsIndex) => {
                if (goodsItem.deleted) {
                    item.CID = goodsItem.ID
                    selectGoods.push(item)
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
                    var url = "deleteCollectGoods.ashx";
                    var params = new Object();
                    params.LstCollectGoods = selectGoods;

                    util.POST({
                        url: url,
                        params: JSON.stringify(params),
                        success: function (res) {
                            var oData = res.data[0]
                            wx.showToast({
                                icon: 'none',
                                title: oData.Msg,
                                duration: 1000
                            })
                            if (oData.Status === "200") {
                                // 过滤有删除标记的商品
                                var newCartItems = [];
                                var newGoods = [];
                                that.data.cartItems.forEach((item, index) => {
                                    if (!item.deleted) {
                                        newGoods = item.List.filter((goodsItem, goodsIndex) => {
                                            return !goodsItem.deleted;
                                        })
                                        item.List = newGoods;
                                        newCartItems.push(item)
                                    }
                                })

                                that.setData({
                                    cartItems: newCartItems
                                })
                            }
                        }
                    })
                    
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getMsg(size, page) {
        var that = this;
        var url = "getMyCollectionList.ashx";
        var params = new Object();
        params.Size = size;
        params.Page = page;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    that.setData({
                        curPage: page,
                    })
                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            ["cartItems"]: oData.Data
                        })
                    } else {
                        var data = that.data.ListList.concat(oData.Data[0].List);
                        that.setData({
                            ["cartItems"]: data
                        })
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        that.setData({
                            isLoadData: false
                        })
                    } else {
                        that.setData({
                            isLoadData: false
                        })
                    }
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
    goUrl (e) {
        var index = e.currentTarget.dataset.index;
        var number = e.currentTarget.dataset.number;
        wx.navigateTo({
            url: "/pages/goods/detail/index?index="+index+"&number="+ number,
            
        })
    },
    onLoad: function (options) {
        this.getMsg(10, 0)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isLoadData) {
            var page = this.data.curPage + 1
            this.getMsg(10, page);
        }
    },
})