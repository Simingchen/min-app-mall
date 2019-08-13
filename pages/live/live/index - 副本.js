const util = require('../../../utils/util.js');
Page({
    data: {
        isShowPopup: false,
        isShowPopup1: false,
        video: "",
    },
    // 切换弹窗
    togglePopup() {
        this.setData({
            isShowPopup: !this.data.isShowPopup
        })
    },
    // 切换弹窗
    togglePopup1() {
        this.setData({
            isShowPopup1: !this.data.isShowPopup1
        })
    },
    onReady(res) {
        this.ctx = wx.createLivePlayerContext('player')
    },
    // 播放状态变化事件
    statechange(e) {
        console.log('live-player code:', e.detail.code)
    },
    // 出错
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
    },
    // 播放
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
    // 暂停
    bindPause() {
        this.ctx.pause({
            success: res => {
                console.log('pause success')
            },
            fail: res => {
                console.log('pause fail')
            }
        })
    },
    // 停止
    bindStop() {
        this.ctx.stop({
            success: res => {
                console.log('stop success')
            },
            fail: res => {
                console.log('stop fail')
            }
        })
    },
    // 恢复
    bindResume() {
        this.ctx.resume({
            success: res => {
                console.log('resume success')
            },
            fail: res => {
                console.log('resume fail')
            }
        })
    },
    // 静音
    bindMute() {
        this.ctx.mute({
            success: res => {
                console.log('mute success')
            },
            fail: res => {
                console.log('mute fail')
            }
        })
    },
    onSocketEvent(num) {
        let socket = app.globalData.socket
        console.log('监听信息')
        let _this = this
        socket.on(num + 'Room', function(ret, msg) {
            let messageList = _this.data.messageList
            let obj = {}
            obj.Name = ret.Name
            obj.content = msg.content
            obj.type = msg.type
            messageList.push(obj)
            _this.setData({
                messageList
            })
        })
    },
    sendMessage() {
        let messageList = this.data.messageList
        let roomNumber = this.data.roomNumber
        let input = this.data.input
        let userInfo = this.data.userInfo
        if (input == "") {
            return
        }
        app.globalData.socket.emit('chat', roomNumber, userInfo, {
            type: 1,
            Name: userInfo.Name,
            content: input
        })
        let obj = {
            type: '0',
            content: input,
            Name: userInfo.Name
        }
        messageList.push(obj)
        this.setData({
            messageList,
            input: ''
        })
    },
    onLoad: function(options) {
        // this.getMsg(options.id);
        this.setData({
            video: options.id
        })
    }
})