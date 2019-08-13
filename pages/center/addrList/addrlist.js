// pages/center/addrList/addrlist.js
const util = require('../../../utils/util.js');
Page({
    data: {
        backPage: "",
        items: [],           // 地址数据
        isAddNew: false,   // 是否显示添加按钮
        addrNum: 7,   // 地址总数大于不能添加新地址
    },
    // 获取信息
    getMsg: function () {
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
                        items: oData.Data
                    })
                }
            }
        })
    },
    // 设置默认地址
    setDefault(e) {
        var that = this;
        var url = "saveAddressInDefault.ashx"
        var params = new Object();
        var id = e.currentTarget.dataset.id;
        params.AID = id
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.data.items.forEach((item1, index) => {
                        var isDefault = 'items[' + index + '].isDefault'
                        if (id == item1.ID) {
                            that.setData({
                                [isDefault]: 1
                            })
                        } else {
                            that.setData({
                                [isDefault]: 0
                            })
                        }
                    })

                    if (that.data.backPage == "submit") {  // 返回提交订单页
                        wx.navigateBack({ // 成后返回上一页
                            delta: 1
                        })
                    }
                }
            }
        })
    },
    // 删除按钮
    delBtn: function (e) {
        var that = this
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: "提示",
            content:"确定删除该地址吗？",
            confirmColor: "#f79bb0",
            success: function (res) {
                if (res.confirm) {
                    var url = "delReceiverAddress.ashx"
                    var params = {};
                    params.RID = id;
                    util.POST({
                        url: url,
                        params: JSON.stringify(params),
                        success: function (res) {
                            var oData = res.data[0]
                            if (oData.Status == 200) {
                                that.data.items.forEach((item, index) => {  // 成功后删除
                                    if (id == item.ID) {
                                        that.data.items.splice(index, 1);
                                        that.setData({
                                            items: that.data.items
                                        })
                                    }
                                })

                                that.verifyLength()
                            }
                        }
                    })
                    
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 检验列表长度
    verifyLength: function () {
         var isAdd = this.data.items.length >= this.data.addrNum;
         this.setData({
             isAddNew: isAdd,
         })
        
    },
    addNewAddr: function (e) {  // 添加新地址还是编辑地址
        var id = e.currentTarget.dataset.id;
        var url;
        if (id) {
            url = "/pages/center/addrNew/addNew?back=list&id=" + id
        } else {
            url = "/pages/center/addrNew/addNew?back=list"
        }

        wx.navigateTo({
            url: url
        })
    },
    onLoad: function (options) {
        this.getMsg();
        this.setData({
            backPage: options.back
        })
    },
})