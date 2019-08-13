const util = require('../../../utils/util.js');
Page({
    data: {

    },
    signOut () {
        wx.setStorageSync('losetime', 0)
        wx.setStorageSync('token', "")
        util.setLogin(0);
        wx.redirectTo({
            url: '/pages/center/login/login'
        })
    }
})