const util = require('../../../utils/util.js');
const app = getApp()
import io from "../../../wxsocket.io/index"
let socket = io("ws://193.112.72.100:8002")
Page({
    data: {
        showCover: 0,
        aid: '',
        input: '',
        roomNumber: '',
        kind: '',
        //showShadow:1,
        course: [],
        path: '',
        liveRoomInfo: {},
        userInfo: {},
        messageList: [],
        isShowPopup: false,
        isShowPopup1: false,
        isShowSkuDialog: false,
        goodsList: {},
        seeList: [],
        isLikeIt: false,    // 点赞
        goods:{
            msg: [],
            productQuantity: 1,         // 选定商品数量
            curStock: null,    // 选定的当前库存
            curSkuId: null,     // 当前选定的skuID
            curPrice: null,     // 当前选定价格
            curProty: null,     // 当前选定属性
        },
        pushGoods:{},       // socket推送商品
    },
    saveInput(e) {
        let input = e.detail.value
        this.setData({
            input
        })
    },
    onShareAppMessage() {
        return {
            title: '',
            desc: '',
            path: '/pages/live/live/index?aid=' + this.data.aid + '&roomNumber=' + this.data.roomNumber
        }
    },
    onSocketEvent(num) {
        console.log('监听信息')
        let _this = this
        console.log(num + 'Room');
        socket.on(num + 'Room', function (ret, msg) {
            let messageList = _this.data.messageList
            console.log(ret)
            console.log(msg)
            let obj = {
                type: msg.type,
                Name: ret.Name,
                Content: msg.Content,
                LevelName: msg.LevelName
            }
            messageList.push(obj)
            if (messageList.length > 9) {
                console.log("成功")
                messageList.shift();
            }
            _this.setData({
                messageList
            })
        })
    },
    // 发送聊天
    sendMessage() {
        let messageList = this.data.messageList
        let roomNumber = this.data.roomNumber
        let input = this.data.input
        let userInfo = this.data.userInfo
        if (input == "") {
            return false;
        }

        console.log("这是名字：" + userInfo.Name);
        console.log("聊天内容：" + input)
        let obj = {
            type: 1,
            Name: userInfo.Name,
            Content: input,
            LevelName: userInfo.LevelName
        }
        socket.emit('chat', roomNumber, userInfo, obj)

        console.log(obj)
        console.log(messageList)
        // messageList.splice(0, 0)
        messageList.push(obj);
        if (messageList.length > 9) {
            console.log("成功")
            messageList.shift();
        }

        this.setData({
            messageList,
            input: '',
            isShowPopup1: !this.data.isShowPopup1
        })
        console.log(this.data.messageList)
    },
    onSocketPushGoods(num) {
        console.log('监听推送商品信息')
        let that = this
        socket.on(num + '_push_goods', function (ret, msg) {
            console.log(ret)
            console.log(msg)
            let pushGoods = {}
            pushGoods.Name = ret.Name
            pushGoods.Price = ret.Price
            pushGoods.Img = ret.Img
            pushGoods.Index = ret.Index
            pushGoods.Number = ret.Number
            that.setData({
                pushGoods
            })
        })
    },
    
    changeShowShadow() {
        let showShadow = ~~!this.data.showShadow
        this.setData({
            showShadow
        })
    },
    onReady(res) {
        this.ctx = wx.createLivePlayerContext('player')
        //ctx.requestFullScreen()
        this.bindPlay()
    },
    statechange(e) {
        console.log('live-player code:', e.detail.code)
        if (e.detail.code == '-2301') {
            this.setData({
                showCover: 1
            })
        }
    },
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
    },
    bindPlay() {
        this.ctx.play({
            success: res => {
                console.log('play success')
            },
            fail: res => {
                console.log('play fail')
            }
        })
    },
    /*pageScrollToBottom: function () {
      let _this = this
      wx.createSelectorQuery().select('#box').fields({
        size: true,
      }, function (res) {
        console.log(res)
        wx.pageScrollTo({
          scrollTop: res.height
        })
      }).exec()
    },*/
    onLoad(options) {
        let _this = this
        let aid = options.aid
        let path = options.path
        let roomNumber = options.roomNumber
        let messageList = this.data.messageList
        this.onSocketEvent(roomNumber)
        this.onSocketPushGoods(roomNumber);
        console.log(options)
        if (!path) {//直播类型
            this.setData({
                kind: '直播',
                roomNumber,
                aid
            })
        } else {//录播类型
            this.setData({
                kind: '录播',
                path,
                roomNumber,
                aid
            })
        }
        this.getLiveRecordInfo(aid);
        this.joinLiveRoom(roomNumber);
        this.getLiveSeeList(roomNumber);
    },
    // 直播信息
    getLiveRecordInfo: function (aid) {
        let messageList = this.data.messageList
        var that = this;
        var params = {};
        var url = "getLiveRecordInfo.ashx"
        params.AID = aid;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                console.log('这里是直播间信息')
                console.log(res)
                that.setData({
                    liveRoomInfo: res.data[0].Data[0]
                })
                let anchorName = that.data.liveRoomInfo.Name
                messageList.push({ Name: '', content: `欢迎进入${anchorName}的直播间`, type: '' })
                that.setData({
                    messageList
                })
                let obj = { title: anchorName }
                wx.setNavigationBarTitle(obj)

                // 获取商品
                that.getLiveGoodsList(that.data.liveRoomInfo.ID)
            },
        })
    },
    // 用户信息
    joinLiveRoom: function (roomNumber) {
        var that = this;
        var params = {};
        var url = "joinLiveRoom.ashx"
        params.RoomID = roomNumber;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                console.log('观看者信息接口')
                console.log(res)
                that.setData({
                    userInfo: res.data[0].Data[0]
                })
                console.log(that.data.userInfo)

                // 登陆聊天
              socket.emit('userLogin', roomNumber, res.data[0].Data[0]);
            },
        })
    },
    // 切换弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup,
            isShowPopup1: false
        })
    },
    // 切换发送弹窗
    togglePopup1() {
        this.setData({
            isShowPopup1: !this.data.isShowPopup1,
            isShowPopup: false,
        })
    },
    // 获取商品
    getLiveGoodsList: function (LiveRecordID) {
        var that = this;
        var params = {};
        var url = "getLiveGoodsList.ashx"
        params.LiveRecordID = LiveRecordID;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                that.setData({
                    goodsList: res.data[0].Data[0]
                })
            },
        })
    },
    // 获取观看直播间用户
    getLiveSeeList: function (roomNumber) {
        var that = this;
        var params = {};
        var url = "getShowLiveRecordByRoom.ashx"
        params.RoomID = roomNumber;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                console.log(res.data[0].Data[0])
                that.setData({
                    seeList: res.data[0].Data[0].List
                })
            },
        })
    },
    // 点赞
    likeLiveRecord: function () {
        var that = this;
        var params = {};
        var url = "likeLiveRecord.ashx"
        params.LiveRecordID = that.data.liveRoomInfo.ID;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                that.setData({
                    isLikeIt: true
                })
            },
        })
    },
    goBack () {
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取商品信息
    getGoods (e){
        var index = e.currentTarget.dataset.index
        var number = e.currentTarget.dataset.number
        var that = this;
        var url = "getGoodsDetails.ashx";
        var params = {};
        params.Index = index;
        params.Number = number;
        util.POST({
            url: url,
            params: JSON.stringify(params),
            success: function (res) {
                var oData = res.data[0]
                var curStock = JSON.stringify(oData.Data[0].SkuInfo) == "[]" ? oData.Data[0].TotalStock : oData.Data[0].SkuInfo[0].Stock;
                var curProty = JSON.stringify(oData.Data[0].SkuInfo) != "[]" && oData.Data[0].SkuInfo[0].Name;
                if (oData.Status == 200) {
                    that.setData({
                        ["goods.msg"]: oData.Data[0],
                        ["goods.curStock"]: curStock,
                        ["goods.curPrice"]: oData.Data[0].Price,
                        ["goods.curSkuId"]: oData.Data[0].DefaultSkuID,
                        ["goods.curProty"]: curProty
                    })
                    that.toggleSku();
                }
            }
        })
    },
    // 切换sku弹窗
    toggleSku: function (e) {
        this.setData({
            isShowSkuDialog: !this.data.isShowSkuDialog,
            isShowPopup: false,
        })
    },
    // 加减商品数量
    changeQuantity: function (e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var nowNum = this.data.goods.productQuantity;

        if (type > 0) {
            if (this.data.goods.productQuantity < this.data.goods.curStock) {
                nowNum++;
            }
        } else {
            nowNum > 1 ? nowNum-- : nowNum = 1;
        }
        that.setData({
            ["goods.productQuantity"]: nowNum
        })
    },
    // 加入购物车
    goBuy(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        var url = "addToCart.ashx";
        var params = new Object();
        var skuId = this.data.goods.curSkuId;
        params.SID = this.data.goods.msg.StoreID;
        params.Quantity = this.data.goods.productQuantity;
        if (!that.data.goods.msg.SkuInfo.length) {
            skuId = that.data.goods.msg.DefaultSkuID
        }
        params.ID = skuId;
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
                that.setData({
                    isShowSkuDialog: false
                })
                if (oData.Status === "200") {
                    if (type == 2) {
                        wx.redirectTo({
                            url: "/pages/shopCart/shopCart"
                        })
                    }
                }
            }
        }, true)
    },
    // 选择水库
    selectSku(e) {
        var item = e.currentTarget.dataset.item;
        this.setData({
            ["goods.curSkuId"]: item.MainID,  // 当前选定的skuID
            ["goods.curStock"]: item.Stock || 0,    // 选定的当前库存
            ["goods.curPrice"]: item.Price,     // 当前选定价格
            ["goods.curProty"]: item.Name,     // 当前选定属性
        })
    },
})
