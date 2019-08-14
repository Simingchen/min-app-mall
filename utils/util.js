const app = getApp()
const urlXBase = 'https://ssl.wmgyb.com:444/';
const urlXApi = urlXBase + 'actions/';
var userinfo = {};
var openid = '';
const appid = ''; //填写微信小程序appid  
const secret = ''; //填写微信小程序secret

var API_URL = 'http://localhost/loverule/api/api.php'

var requestHandler = {
    params: {},
    success: function (res) {
        // success  
    },
    fail: function () {
        // fail  
    },
}

//GET请求  
function GET(requestHandler, checkLogin) {
    request('GET', requestHandler, checkLogin)
}
//POST请求  
function POST(requestHandler, checkLogin) {
    request('POST', requestHandler, checkLogin)
}

function request(method, requestHandler, checkLogin) {
    // 进入页面先判定登录情况
    let token = wx.getStorageSync('token');
    console.log(token)
    if (!token && checkLogin) {
        wx.redirectTo({
            url: '/pages/center/login/login'
        })
    }
    //注意：可以对params加密等处理  
    var url = urlXApi + requestHandler.url;
    var params = requestHandler.params;

    wx.request({
        header: {
            "Content-Type": "application/x-www-form-urlencoded", //post
            "Authorization": wx.getStorageSync("token")
        }, // 设置请求的 header  
        url: url,
        data: params,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        success: function (res) {
            // 分别为200（成功），201（操作失败），500（请求服务器失败）
            if (res.data[0].Status == "201") {
                wx.showToast({
                    icon: 'none',
                    title: res.data[0].Msg
                })
                var patt1 = new RegExp("getMember.ashx");
                var result = patt1.test(url);
                if (result) {
                    wx.redirectTo({
                        url: '/pages/center/login/login'
                    })
                }
                
            }
            //注意：可以对参数解密等处理  
            requestHandler.success(res)
        },
        fail: function () {
            wx.showToast({
                icon: 'none',
                title: "失败"
            })
            requestHandler.fail()
        },
        complete: function () {
            // complete  
        }
    })
}

// 设置登录超时
const setLogin = time => {
    time = parseInt(time);
    let timer = setTimeout(() => {
        clearTimeout(timer)
        wx.setStorageSync('losetime', 0)
        wx.setStorageSync("token", "")
    }, time)
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const pay = (data, wxRequestHandler) => {
    var that = this;
    var params = {};
    params.Number = data;
    params.PaymentWay = 8;
    var url = "payTrade.ashx"

    // get user openid
    wx.login({
        success: function (res) {
            if (res.code) {
                params.Code = res.code;
                params.PayWay = 1;
                POST({
                    url: url,
                    params: JSON.stringify(params),
                    success: function (res) {
                        wx.requestPayment({
                            'timeStamp': res.data[0].Data[0].Info.TimeStamp,
                            'nonceStr': res.data[0].Data[0].Info.NonceStr,
                            'package': res.data[0].Data[0].Info.Package,
                            'signType': 'MD5',
                            'paySign': res.data[0].Data[0].Info.Sign,
                            'success': function (res) {
                                wxRequestHandler.success(res)
                            },
                            'fail': function (res) {
                                wxRequestHandler.fail(res)
                            }
                        })
                    },
                    fail: function () {
                        wx.showToast({
                            icon: "none",
                            title: "微信支付触发失败"
                        })
                    },
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}

// 金额加两位数
const formatMoney = n => {
    return Number(n).toFixed(2).toString();
}
module.exports = {
    GET: GET,
    POST: POST,
    formatTime: formatTime,
    formatMoney,
    setLogin: setLogin,
    PAY: pay,
}
