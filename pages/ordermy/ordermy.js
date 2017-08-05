Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    selectedimg:'',
    selectedprice:'',
    serve_name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/Portal/Order/orderList',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data,
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
      });
      wx.redirectTo({
        url: '../submit/submit?selectedimg=' + that.data.selectedimg + '&selectedprice=' + s.currentTarget.dataset.price + '&serve_name=' + s.currentTarget.dataset.name+''
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