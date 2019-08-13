Page({
    data: {
        all: 10,   // 限制昵称长度
        num: 10,    // 剩下数
        all2: 20,   // 限制签名总数
        num2: 20,    // 剩下数
        msg: "",
        type: ""
    },
    // 检索输入框字数
    checkNum: function (e) {
        this.setData({
            msg: e.detail.value
        })
        
        this.setData({
            num: this.data.all - this.data.msg.length
        })

        let pages = getCurrentPages();  // 当前页面
        let prevPage = pages[pages.length - 2]  // 上一页
        
        var type = this.data.type;
        prevPage.setData({
            [type]: e.detail.value
        })
    },
    // 检索输入框字数
    checkNum2: function (e) {
        this.setData({
            msg: e.detail.value
        })

        this.setData({
            num2: this.data.all2 - this.data.msg.length
        })

        let pages = getCurrentPages();  // 当前页面
        let prevPage = pages[pages.length - 2]  // 上一页

        var type = this.data.type;
        prevPage.setData({
            [type]: e.detail.value
        })
    },
    onLoad: function (options) {
        var title;

        if (options.type == "nickname") {
            title = "编辑昵称";
        }
        if (options.type == "sign") {
            title = "编辑签名";
        }
        if (options.type == "job") {
            title = "编辑职业";
        }
        if (options.type == "city") {
            title = "编辑城市";
        }
        this.setData({
            type: options.type
        })
        this.setData({
            msg: options.txt
        })
        wx.setNavigationBarTitle({  // 设置标题
            title: title
        })
    },
})