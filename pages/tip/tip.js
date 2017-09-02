var util = require('../../utils/util.js');
var utilMd5 = require('../../utils/md5.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popdisplay:'none',
    tipnum:0,
    tipimg:'',
    imagewidth:0,
    imageheight:0,
  },

  tiptap:function(){
    this.setData({
      popdisplay:'block',
    })
  },
  tipnumber: function(e){
    this.setData({tipnum:e.detail.value});
  },
  tiphide: function () {
    this.setData({
      popdisplay: 'none',
    })
  },
  tippay: function(){
    var that = this;
    if (wx.getStorageSync('usersession')){
        wx.request({
          url: 'https://helizixun.cn/index.php?g=Portal&m=Order&a=tippay',
          data: {
            user_id: wx.getStorageSync('userid'),
            usersession: wx.getStorageSync('usersession'),
            tipnum: this.data.tipnum
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              popdisplay: 'none',
            });
            if(res.data.status == 1001){
              var tipid = res.data.data.tipid;
              //{{{微信支付
              var reswxData = res.data.wxorder;

              if (reswxData.return_code == 'SUCCESS') {
                var appId = reswxData.appid;
                var timeStamp = (Date.parse(new Date()) / 1000).toString();
                var pkg = 'prepay_id=' + reswxData.prepay_id;
                var nonceStr = reswxData.nonce_str;
                var paySign = utilMd5.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=7TCfxZCV2xFFGKEJo15ooCoVzP6iMyVL").toUpperCase();
                wx.requestPayment({
                  'timeStamp': timeStamp,
                  'nonceStr': nonceStr,
                  'package': pkg,
                  'signType': 'MD5',
                  'paySign': paySign,
                  'success': function (res) {
                    //{{{支付成功，修改订单状态
                    wx.request({
                      url: 'https://helizixun.cn/index.php?g=Portal&m=Order&a=payTipOrder',
                      data: {
                        tid: tipid,
                        status: 1
                      },
                      method: 'POST',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: function (res) {
                        wx.showToast({
                          title: "打赏成功...",//这里打印出登录成功           
                          icon: 'success',
                          duration: 2000
                        });
                        
                        //wx.navigateTo({
                        //  url: '../success/success'
                        //});
                      } 
                    });
                    //}}} 支付成功，修改订单状态
                  },
                  'fail': function (res) {
                    wx.showToast({
                      title: "打赏失败...",//这里打印出登录成功           
                      icon: 'warn',
                      duration: 2000
                    });
                    
                  },
                  'complete': function (res) {
                    //wx.showToast({
                    //  title: "支付完成...",//这里打印出登录成功           
                    //  icon: 'success',
                    //  duration: 2000
                    //});
                  }
                });
              } else {
                wx.showToast({
                  title: "打赏失败...",//这里打印出登录成功           
                  icon: 'error',
                  duration: 2000
                });
                
              }
              //}}} end 微信支付
            }else{
            }
          },
          fail: function () {

          }
        })
    }else{
      util.getUserId();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserId();
    
    var that = this;
    wx.request({
      url: 'https://helizixun.cn/index.php?g=Portal&m=Interface&a=getReward',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: {

      },
      success: function (res) {
        that.setData({
          tipimg: res.data.reward_url,
        })
      }
    });

  },

  imageLoad: function (e) {
    var imageUtil = require('../../utils/util.js');
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
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