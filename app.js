//app.js
var util = require('utils/util.js');  
App({
  onLaunch: function() {
    util.getUserId();
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },

  globalData: {
    userInfo: null
  },
  
})

/**
 * 登录
 */
/*
function wxLogin(e) {
  var that = e;
  //wx.showModal({
  //  title: '登录'
  //});
  //调用登录接口
  //1.小程序调用wx.login得到code.
  wx.login({
    success: function (res) {
      var code = res['code'];
      //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
      wx.getUserInfo({
        success: function (info) {
          //console.log(info);
          var rawData = info['rawData'];
          var signature = info['signature'];
          var encryptData = info['encryptData'];
          var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
          var iv = info['iv'];

          that.globalData.userInfo = info.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo)

          //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
          wx.request({
            url: 'https://xcx.heyukj.com/index.php/User/Register/wxLogin/',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            }, // 设置请求的 header   
            success: function (res) {
              //console.log(res.data.ouid);
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              }
              that.globalData.usersession = res.data.ouid;
              //console.log(that.globalData.usersession);
              wx.setStorageSync('usersession', res.data.ouid);
              wx.setStorageSync('userid', 888);
              typeof func == "function" && func(res.data);
            }
          });
        }
      });

    }
  });


}
*/