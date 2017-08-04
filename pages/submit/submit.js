Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedimg:'',
    selectedprice:'',
    soundactive:'cardactive',
    textactive:'',
    sounddisplay:'',
    textdisplay:'none',
    soundfile:''
  },

  /**选项卡切换 */
  soundcardtap:function(){
    this.setData({
      soundactive: 'cardactive',
      textactive: '',
      sounddisplay: 'block',
      textdisplay: 'none'
    })
  },
  textcardtap: function () {
    this.setData({
      soundactive: '',
      textactive: 'cardactive',
      sounddisplay: 'none',
      textdisplay: 'block'
    })
  },
  soundtap:function(){
    wx.startRecord({
      success:function(res){
        this.setData({
          soundfile:res.tempFilePath
        })
        console.log(res.tempFilePath);
      }
    })    
  },
  soundtapend: function () {
    wx.stopRecord();
    wx.showToast({
      title: '录音成功',
      icon: 'success',
      duration: 2000
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedimg:options.selectedimg,
      selectedprice:options.selectedprice
    });
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