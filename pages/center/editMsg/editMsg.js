// pages/center/editMsg/editMsg.js
const util = require('../../../utils/util.js');
Page({
    data: {
        user: {},
        index: "",  // 星座索引
        constellation: ["水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座"],
        avator: ""
    },
    // 获取信息
    getMsg: function () {
        var that = this;
        var url = "getMember.ashx"
        util.POST({
            url: url,
            success: function (res) {
                var oData = res.data[0]
                if (oData.Status == 200) {
                    var index = that.data.constellation.indexOf(oData.Data[0].Constellation);
                    that.setData({
                        user: oData.Data[0],
                        index: index
                    })
                }
            }
        })
    },
    // 选择上传图片
    selectPhoto () {
        let that = this
        let user = this.data.user
        wx.chooseImage({
            count: 1,
            success: function (res) {
                let tempFilePaths = res.tempFilePaths
                let imgType = tempFilePaths[0].split('.')[tempFilePaths[0].split('.').length - 1]
                const fileManager = wx.getFileSystemManager()
                let headInBase64 = 'data:image/' + imgType + ';base64,' + fileManager.readFileSync(tempFilePaths[0], 'base64')
                wx.request({
                    url: 'https://ssl.wmgyb.com:444/actions/uploadImg.ashx?ftype=' + imgType + '&storeid=head&span=' + (new Date()).getMilliseconds(),
                    data: { base64: headInBase64 },
                    method: 'POST',
                    success: function (res) {
                        that.setData({
                            ["user.Head"]: res.data.url
                        })
                    }
                })
            }
        })
    },
    changeMsg:function (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            ["user."+ type]: e.detail.value
        })
    },
    bindPickerChange: function (e) {   // 星座改变
        this.setData({
            index: e.detail.value
        })
    },
    saveMsg: function () {
        var that = this;
        var params = new Object();
        var url = "saveMember.ashx"
        params.File = this.data.user.Head.replace("http://img.honghuo777.com/UploadFile/head/", "");
        params.Sex = "1";
        params.LoginName = this.data.user.Name;
        params.Birthday = this.data.user.Birthday;
        params.Constellation = this.data.index == -1 ? "" : this.data.constellation[this.data.index];
        params.City = this.data.user.City;
        params.Occupation = this.data.user.Occupation;
        params.Introduce = this.data.user.Introduce
        params.GameLlist = "";
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
                
                if (oData.Status == 200) {
                    setTimeout(() => {
                        wx.navigateBack({ // 成后返回上一页
                            delta: 1
                        })
                    }, 1e3)
                }
            }
        })
    },
    onLoad: function () {
        this.getMsg();
    },
    onShow: function () {  // 设置保存上一页的数据
        let pages = getCurrentPages();  
        let curPage = pages[pages.length - 1]  // 当前页面
        if (curPage.data.nickname) {
            this.setData({
                ['user.Name']: curPage.data.nickname
            })
        }
        if (curPage.data.sign) {
            this.setData({
                ['user.Introduce']: curPage.data.sign
            })
        }
        if (curPage.data.job) {
            this.setData({
                ['user.Occupation']: curPage.data.job
            })
        }
        if (curPage.data.city) {
            this.setData({
                ['user.City']: curPage.data.city
            })
        }
    },
})