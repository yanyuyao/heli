Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerdisplay: "none",
    serveList:[],
    selectedimg:'',
    selectedprice:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/Portal/Interface/serveList',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          serveList:res.data.data
        });
      },
      fail: function () {
        
      }
    })
  },

  /**add点击 */
  addtap: function(e){
    this.setData({
      footerdisplay:"block",
      serve_id: e.currentTarget.dataset.serveid,
      serve_name: e.currentTarget.dataset.servename,
      selectedimg:e.currentTarget.dataset.img,
      selectedprice:e.currentTarget.dataset.price
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
