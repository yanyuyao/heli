var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    util.getUserId();
    console.log('----- index onload ----');
    console.log('user id ' + wx.getStorageSync('userid'));
    var that = this;
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/Portal/Interface/bannerList',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})