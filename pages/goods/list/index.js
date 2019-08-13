var app = getApp();
const util = require('../../../utils/util.js');
Page({
    data: {
        currentTab: 3, //预设当前项的值
        curPage: 0,
        Alias: "",
        OrderByField: "",
        OrderBy: 0, // 0升序 1降序
        isLoadData: true, // 是否可加载数据
        isUp: false,
        isDown:false,
        name: "", // 搜索关键词
        "models": [
            {
            "name": "一级类目",
            "id": "6010",
            "type": "cat",
            "list": [{
                "name": "蜂蜜",
                "id": "6011",
                "pic": "//img.alicdn.com/imgextra/i4/844537169/TB2yG6qhpXXXXb2XXXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id =725677994&cat=50518003&q=èè"
            }, {
                "name": "阿胶",
                "id": "6012",
                "pic": "//img.alicdn.com/imgextra/i2/831867534/TB2LmnLhpXXXXcbXXXXXXXXXXXX-831867534.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=é¿è¶"
            }, {
                "name": "枸杞",
                "id": "6013",
                "pic": "//img.alicdn.com/imgextra/i1/844537169/TB22xnYhpXXXXXFXXXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=æ¸æ"
            }, {
                "name": "燕窝",
                "id": "6014",
                "pic": "//img.alicdn.com/imgextra/i1/844537169/TB2ferzhpXXXXakXpXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=ççª"
            }, {
                "name": "灵芝",
                "id": "6015",
                "pic": "//img.alicdn.com/imgextra/i1/844537169/TB2uGPahpXXXXbDXpXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=çµè"
            }, {
                "name": "西洋参",
                "id": "6016",
                "pic": "//img.alicdn.com/imgextra/i2/844537169/TB20tbkhpXXXXXfXpXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=è¥¿æ´å"
            }, {
                "name": "维生素",
                "id": "6017",
                "pic": "//img.alicdn.com/imgextra/i2/844537169/TB225TxhpXXXXaFXXXXXXXXXXXX-844537169.jpg",
                "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=ç»´çç´ "
            }]
            }, 
            {
                "name": "一级类目",
                "id": "6010",
                "type": "cat",
                "list": [{
                    "name": "蜂蜜",
                    "id": "6011",
                    "pic": "//img.alicdn.com/imgextra/i4/844537169/TB2yG6qhpXXXXb2XXXXXXXXXXXX-844537169.jpg",
                    "url": "//s.m.tmall.com/chaoshi.htm?user_id =725677994&cat=50518003&q=èè"
                }, {
                    "name": "阿胶",
                    "id": "6012",
                    "pic": "//img.alicdn.com/imgextra/i2/831867534/TB2LmnLhpXXXXcbXXXXXXXXXXXX-831867534.jpg",
                    "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=é¿è¶"
                }, {
                    "name": "枸杞",
                    "id": "6013",
                    "pic": "//img.alicdn.com/imgextra/i1/844537169/TB22xnYhpXXXXXFXXXXXXXXXXXX-844537169.jpg",
                    "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=æ¸æ"
                }, {
                    "name": "燕窝",
                    "id": "6014",
                    "pic": "//img.alicdn.com/imgextra/i1/844537169/TB2ferzhpXXXXakXpXXXXXXXXXX-844537169.jpg",
                    "url": "//s.m.tmall.com/chaoshi.htm?user_id=725677994&cat=50518003&q=ççª"
                }]
            }
        ],
        goodsList: []
    },
    getMsg: function(name, page) {
        var that = this;
        var url = "searchGoods.ashx"
        var params = new Object();
        params.Name = name;
        params.Page = page;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    var goodsList = [];
                    var isLoadData = false;
                    if (page == 0) {
                        goodsList = oData.Data[0].List
                    } else {
                        goodsList = that.data.goodsList.concat(oData.Data[0].List);
                    }

                    if (oData.Data[0].Page >= oData.Data[0].PageCount - 1) {
                        isLoadData = false;
                    } else {
                        isLoadData = true;
                    }
                    that.setData({
                        goodsList,
                        isLoadData,
                        curPage: page,
                    })
                }
            }
        })
    },
    getList: function(size, page, Alias, OrderByField, OrderBy, IsVirtual) {
        var that = this;
        var url = "getGoodsList.ashx"
        var params = {};
        params.Size = size;
        params.Page = page;
        params.Alias = Alias;
        params.OrderByField = OrderByField;
        params.OrderBy = OrderBy;
        params.IsVirtual = IsVirtual;

        if (that.data.name) {
            url = "searchGoods.ashx";
            params.Name = size;
        }

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function(res) {
                var oData = res.data[0]
                if (oData.Status === "200") {
                    that.setData({
                        curPage: page,
                    })

                    that.setData({
                        IsVirtual: IsVirtual,
                    })

                    // 如果页码为1，不进行列表叠加
                    if (page == 0) {
                        that.setData({
                            goodsList: oData.Data[0].List
                        })
                    } else {
                        var data = that.data.goodsList.concat(oData.Data[0].List);
                        that.setData({
                            goodsList: data
                        })
                    }

                    if (oData.Data[0].page >= oData.Data[0].PageCount - 1) {
                        that.setData({
                            isLoadData: false
                        })
                    } else {
                        that.setData({
                            isLoadData: false
                        })
                    }
                }
            }
        })
    },
    getSort(PID) {
        var that = this;
        var url = "getSonCategoty.ashx"
        var params = {};
        params.PID = PID;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                console.log(oData)
                if (oData.Status == 200) {
                    that.setData({
                        sortList: oData.Data[0].CategoryList
                    })
                    console.log(that.data.sortList)
                }
            },
        })
    },
    // 点击标题切换当前页时改变样式
    switchTab: function(e) {
        var that = this;
        var curOrder = 0
        var cur = e.target.dataset.current;

        if (this.data.currentTab == cur) {
            curOrder = this.data.OrderBy == 0 ? 1 : 0;

        }
        
        if (this.data.currentTab != cur) { // 不是同一类重新升序
            curOrder = 0;
        }

        this.setData({
            currentTab: cur,
            OrderByField: cur,
            OrderBy: curOrder,
            isUp: !curOrder,
            isDown: curOrder
        })

        var Alias = this.data.Alias;
        var OrderByField = this.data.OrderByField;
        var OrderBy = this.data.OrderBy;
        var page = this.data.curPage
        this.getList(20, page, Alias, OrderByField, OrderBy, 0)
    },
    onLoad: function(options) {
        if (options.txt){
            this.setData({
                name: options.txt
            })
        }
        if (options.id) {
            this.setData({
                Alias: options.id
            })
        }
        
        if (this.data.name) {
            this.getList(this.data.name, 0)
        } else {
            this.getList(20, 0, options.id, 0, 1, 0)
        }
        this.getSort(options.sort)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.isLoadData) {
            var Alias = this.data.Alias;
            var OrderByField = this.data.OrderByField;
            var OrderBy = this.data.OrderBy;
            var page = this.data.curPage + 1

            if (this.data.name) {
                this.getList(this.data.name, page)
            } else {
                this.getList(20, page, Alias, OrderByField, OrderBy, 0)
            }
        }
    },
})