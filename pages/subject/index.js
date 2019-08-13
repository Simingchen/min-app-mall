const util = require('../../utils/util.js');
let wxparse = require("../../wxParse/wxParse.js");
Page({
    data: {
        info: {}
    },
    getMsg(id) {
        var that = this;
        var params = new Object();
        var url = "getSubject.ashx"
        params.Page = 0;
        params.SubjectID = id;

        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0].Data[0]
                that.setData({
                    info: oData
                });

                var tempString = that.data.info.Content;
                var temp = ""
                oData.List.forEach((item, index) => {
                    temp = "<div>" + item.Name + "</div>";
                    temp = `
                        <a class="goods-item flex-box" hover-class="none" url="123" href="/pages/goods/detail/index?index=${item.Index}&number=${item.Number}">
                        <img class="img" src="${item.Img}">
                        <div class="flex-item">
                            <div class="name ellipsis2">${item.Name}</div>
                            <div class="price">￥ ${item.Price}</div>
                            <div class="join">
                                <img src="../../img/75_03.png">
                            </div>
                        </div>
            </a>
                    `
                    var ex = "{" + (index + 1) + "}"
                    tempString = tempString.replace(ex, temp)
                })
                wxparse.wxParse('content', 'html', tempString, that, 5)
            },
        })
    },
    goUrl(e) {
        var val = e.currentTarget.dataset
        console.log(val)
    },
    wxParseTagATap: function (e) {
        var href = e.currentTarget.dataset.src;
        console.log(href);
        //我们可以在这里进行一些路由处理
        wx.redirectTo({
            url: href
        })
    },
    onLoad: function (options) {
        this.getMsg(options.id);
    }
});

