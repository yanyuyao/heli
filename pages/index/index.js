var app = getApp();
var util = require('../../utils/util.js');  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 10000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    util.getUserId();
    var that = this;
    wx.request({
      url: 'https://helizixun.cn/index.php?g=Portal&m=Interface&a=bannerList',
      data:{
        
      },
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        that.setData({
          imgUrls:res.data.data
        });
      },
      fail:function(){
        that.setData({
          imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg']
        });
      }
    })
  },

})