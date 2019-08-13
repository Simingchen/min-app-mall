const util = require('../../../utils/util.js');
Page({
    data: {
        token: "",   // 提交订单过来的token
        btnTxt: "",     // 按钮文本
        addrId: "",   // 地址ID
        backPage: "",    // 返回上一页地址
        isDefault: null,  // 默认地址
        user: {
            isDefault: false,
            Mobile: "",
            Address: "",
        },
        region: ['广东省', '广州市', '海珠区'],
    },
    getMsg: function (id) {
        var that = this;
        var url = "getAddress.ashx"
        var params = new Object();
        params.RID = id;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    var data = oData.Data[0];
                    that.setData({
                        user: data,
                        region: [data.Province, data.City, data.County]
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
    changeMsg: function (e) {  // 修改信息
        var type = e.currentTarget.dataset.type;
        this.setData({
            ['user.' + type]: e.detail.value
        })
    },
    addNewAddr: function () {  // 添加确认修改新地址
        var that = this;
        if (!this.data.user.Name) {
            this.alert("请输入收货人")
            return false;
        }

        if (!this.data.user.Mobile) {
            this.alert("请输入联系电话")
            return false;
        }

        if (!this.data.user.Address) {
            this.alert("请输入详细地址")
            return false;
        }

        var url = "saveAddress.ashx"
        var params = new Object();
        params.Request = this.data.addrId ? "Update" : "Add";
        params.RAID = this.data.addrId ? this.data.addrId : "";
        params.Name = this.data.user.Name;
        params.Mobile = this.data.user.Mobile;
        params.Address = this.data.user.Address;
        params.Province = this.data.region[0];
        params.City = this.data.region[1];
        params.County = this.data.region[2];
        params.IsDefault = this.data.user.IsDefault? false : true;
        console.log(params)
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    var title = that.data.addrId ? "修改成功" : "添加成功"
                    wx.showToast({
                        title: title,
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            // 如果从地址列表过来返回去，防止历史记录过去不更新信息
                            if (that.data.backPage == 'list') {
                                wx.redirectTo({
                                    url: '/pages/center/addrList/addrlist'
                                })
                                return false;
                            }
                            if (that.data.backPage == 'bargain') {
                                wx.redirectTo({
                                    url: '/pages/bargain/list/index'
                                })
                                return false;
                            }
                            if (that.data.token) {  // 提交订单页
                                let pages = getCurrentPages();  // 当前页面
                                let prevPage = pages[pages.length - 2]  // 上一页
                                prevPage.setData({
                                    token: that.data.token
                                })
                            }
                            wx.navigateBack({ // 成后返回上一页
                                delta: 1
                            })
                        }
                    })
                }
            }
        })
    },
    onLoad: function (options) {  // 页面加载
        var title;
        var btnTxt;
        if (options.id) {
            this.getMsg(options.id)
            this.setData({
                addrId: options.id
            })
            title = "编辑地址";
            btnTxt = "确认修改"
        } else {
            title = "添加地址";
            btnTxt = "确认添加"
        }
        if (options.back) {
            this.setData({
                backPage: options.back
            })
        }
        if (options.token) {
            this.setData({
                token: options.token
            })
        }

        wx.setNavigationBarTitle({  // 设置标题
            title: title
        })
        this.setData({   // 设置按钮文字
            btnTxt: btnTxt
        })
    }, 
    // 设置默认地址
    setDefault(e) {
        var that = this;
        // 添加地址可设默认地址
        if (!this.data.addrId) {
            that.setData({
                ['user.isDefault']: !that.data.user.isDefault
            })
            return false;
        }
        
        var url = "saveAddressInDefault.ashx"
        var params = new Object();
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]

                if (oData.Status == 200) {
                    that.setData({
                        ['user.isDefault']: !that.data.user.isDefault
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
    alert: function (txt) {
        wx.showModal({
            title: "温馨提示",
            content: txt,
            confirmColor: "#f79bb0"
        })
    }
})