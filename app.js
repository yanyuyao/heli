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
      lang:'zh_CN',
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },

  globalData: {
    userInfo: null,
    g_isPlayingMusic: false,
    g_currentMusicId: null,
    doubanBase: "https://api.douban.com",
  },
  
})