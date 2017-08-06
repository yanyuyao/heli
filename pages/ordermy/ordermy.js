var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    selectedimg:'',
    selectedprice:'',
    serve_name:'',
    serve_id:0,
    order_id:0,
    orderListCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.getUserId();
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/Portal/Order/orderList',
      data: {
        user_id:wx.getStorageSync('userid')
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data,
          orderListCount:res.data.data.length
        });
      },
      fail: function () {

      }
    })
  },

  paytap:function(s){
    if (s.currentTarget.id==1){
      var that = this;
      that.setData({
        selectedimg: s.currentTarget.dataset.img,
        selectedprice: s.currentTarget.dataset.price,
        serve_name: s.currentTarget.dataset.name,
        serve_id: s.currentTarget.dataset.sid,
        order_id: s.currentTarget.dataset.oid
      });
      var redirectUrl = '../submit/submit?order_id=' + that.data.order_id + '&serve_id=' + that.data.serve_id + '&selectedimg=' + that.data.selectedimg + '&selectedprice=' + s.currentTarget.dataset.price + '&serve_name=' + s.currentTarget.dataset.name;
      console.log(redirectUrl);

      wx.redirectTo({
        url: redirectUrl
      })
    }
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