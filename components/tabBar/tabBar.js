// pages/tabBar/tabBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        "color": "#9E9E9E",
        "selectedColor": "#b20000",
        "backgroundColor": "#fff",
        "borderStyle": "",
        "position": "bottom",
        "items": [{
            "pagePath": "/pages/home/index",
            "text": "首页",
            "iconPath": "./images/1_27.png",
            "selectedIconPath": "./images/1_27.png",
            "clas": "menu-item2",
            "selectedColor": "#b20000",
            active: false
        }, {
            "pagePath": "/pages/liveSquare/index",
            "text": "直播广场",
            "iconPath": "./images/1_29.png",
            "selectedIconPath": "./images/1_29.png",
            "clas": "menu-item2",
            "selectedColor": "#b20000",
            active: false
        },  {
            "pagePath": "/pages/center/mine/mine",
            "text": "个人中心",
            "iconPath": "./images/1_34.png",
            "selectedIconPath": "./images/1_34.png",
            "clas": "menu-item2",
            "selectedColor": "#b20000",
            active: false
        }]
    },
    // {
    //     "pagePath": "/pages/zuche/rentIndex/rentIndex",
    //     "text": "o2o",
    //     "iconPath": "./images/1_26.png",
    //     "selectedIconPath": "/img/icon-car-select.png",
    //     "clas": "menu-item2",
    //     "selectedColor": "#b20000",
    //     active: false
    // }, {
    //     "pagePath": "/pages/account/index/index",
    //     "text": "任务广场",
    //     "iconPath": "./images/1_32.png",
    //     "selectedIconPath": "/img/icon-account-select.png",
    //     "clas": "menu-item2",
    //     "selectedColor": "#b20000",
    //     active: false
    // },
    /**
     * 组件的方法列表
     */
    methods: {
        setItems (e) {
            var index = e.currentTarget.dataset.index;
            var url = e.currentTarget.dataset.url;

            var pages = getCurrentPages()
            var currentPage = pages[pages.length - 1]    //获取当前页面的对象
            var curUrl = currentPage.route    //当前页面url

            if ("/" + curUrl !== url) {
                var t = 'items[' + index + '].active';
                this.setData({
                    [t]: true
                });
                wx.redirectTo({
                    url: url,
                })
            }
        }
    }
})
