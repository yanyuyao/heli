var util = require('../../utils/util.js');  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerdisplay: "none",
    serveList:[],
    selectedimg:'',
    selectedprice:'',
    singleheight:'',
    lcimgheight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          singleheight:res.windowHeight,
          lcimgheight: res.windowHeight-170,
        })
      },
    })
    console.log(this.data.singleheight);
    
    util.getUserId();
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
    });
    util.userServiceStatus(this, e.currentTarget.dataset.serveid);
  },

  /**close点击*/
  closetap: function (cc) {
    this.setData({
      footerdisplay: "none"
    })
  },
  

 
})

