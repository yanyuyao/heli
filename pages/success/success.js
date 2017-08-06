var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serve_id: 0,
    serve_name: '',
    serve_today_num: 0,
    serve_today_left: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.getUserId();
    that.setData({ serve_id: options.sid});
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/Portal/Order/getServeSuccess',
      data: {
        user_id: wx.getStorageSync('userid'),
        serve_id: options.sid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          serve_name: res.data.data.serve_name,
          serve_today_num: res.data.data.today_buy,
          serve_today_left: res.data.data.today_left
        });
      },
      fail: function () {

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