var utilMd5 = require('../../utils/md5.js');  
var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:0,
    order_tel: '',
    order_names:'',
    order_email:'',
    order_vconsult:'',
    order_tconsult:'',
    serve_id:0,
    selectedimg:'',
    selectedprice:'',
    serve_name:'',
    soundactive:'cardactive',
    textactive:'',
    sounddisplay:'',
    textdisplay:'none',
    soundfile:'',
    usersession: wx.getStorageSync('usersession'),
    userid: wx.getStorageSync('userid'),
  },
  
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    this.setData({
      selectedimg: options.selectedimg,
      selectedprice: options.selectedprice,
      serve_id: options.serve_id,
      serve_name: options.serve_name
    })
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
    var that = this;
    wx.startRecord({
      success:function(res){
        that.setData({
          soundfile:res.tempFilePath
        });
        /*wx.saveFile({
          tempFilePath: res.tempFilePath[0],
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            console.log("====== save file =======");
          }
        })
        */
        console.log(res.tempFilePath);
        console.log('==== 保存录音文件 ====');
        util.uploadFileToServer(res.tempFilePath,'sounds');
        
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
   * 提交订单
   */
  formSubmit: function (e) {
    wx.showToast(
      {
        title: '订单提交中...',
        icon: 'loading',
        duration: 1500
      }); 
    console.log("====== 提交订单 ========");
    console.log("==== openid : " + this.data.usersession);
    console.log("==== 录音文件 ："+this.data.soundfile);
    if (e.detail.value.companyname.length == 0) { 
        wx.showToast(
          { 
            title: '姓名/公司不得为空!', 
            icon: '',
            image:'../../images/warn.png', 
            duration: 1500 
          });    
          setTimeout(function () { wx.hideToast()}, 2000); 
    } else if (e.detail.value.phone.length == 0){
      wx.showToast(
        {
          title: '手机号码不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    }else if (e.detail.value.phone.length != 11) { 
        wx.showToast(
          { 
            title: '请输入11位手机号码!', 
            icon: '',
            image: '../../images/warn.png', 
            duration: 1500 
          });    
          setTimeout(function () {wx.hideToast()}, 2000) 
    } else if (e.detail.value.email.length == 0) { 
        wx.showToast({
          title: '请输入邮箱!', icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });    
        setTimeout(function () { wx.hideToast() }, 2000) 
    } else {
        //console.log('create order');
        //console.log(this.data.serve_name);
        
      if(this.data.usersession){
       
        wx.request({
          url: 'https://xcx.heyukj.com/Portal/Order/createOrder', 
          header: { "Content-Type": "application/x-www-form-urlencoded" }, 
          method: "POST", 
          data: { 
            order_id: this.data.order_id,
            usersession: this.data.usersession,
            users_id: this.data.userid,
            serve_id: this.data.serve_id,
            serve_name: this.data.serve_name,
            number:1,
            amount: this.data.selectedprice,
            //amount: 0,
            names:e.detail.value.companyname,
            order_vconsult: this.data.soundfile,
            order_tconsult: e.detail.value.zixun_text,
            order_tel: e.detail.value.phone, 
            order_email: e.detail.value.email 
          }, 
          success: function (res) {
            console.log('创建订单成功');
            //console.log(res);
            if (res.data.status == 1003){
              var order_id = res.data.data.order_id;
              var order_num = res.data.data.order_num;
              if (res.data.data.pay_type == 'dev'){//支付为0，
                wx.showToast({
                  title: "支付成功...",//这里打印出登录成功           
                  icon: 'success',
                  duration: 2000
                });
                console.log("=== 支付成功后跳转的页面 " + '../success/success/?sid=' + this.data.serve_id);
                wx.navigateTo({
                  url:'../success/success/?sid='+this.data.serve_id
                });
              }else{
              //{{{
                var reswxData = res.data.data.wxorder;

                if (reswxData.return_code == 'SUCCESS'){
                  var appId = reswxData.appid;
                  var timeStamp = (Date.parse(new Date()) / 1000).toString();
                  var pkg = 'prepay_id=' + reswxData.prepay_id;
                  var nonceStr = reswxData.nonce_str;
                  var paySign = utilMd5.hexMD5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=7TCfxZCV2xFFGKEJo15ooCoVzP6iMyVL").toUpperCase();
                 // console.log(paySign);
                  //console.log(appId);
                  wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': nonceStr,
                    'package': pkg,
                    'signType': 'MD5',
                    'paySign': paySign,
                    'success': function (res) {
                      //console.log(" === wx request payment success === ");
                     //{{{支付成功，修改订单状态
                      wx.request({
                        url: 'https://xcx.heyukj.com/index.php/Portal/Order/payOrder',
                        data: {
                          order_id: order_id,
                          status : 2
                        },
                        method: 'POST',
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                          wx.showToast({
                            title: "支付成功...",//这里打印出登录成功           
                            icon: 'success',
                            duration: 2000
                          });
                          wx.navigateTo({
                            url: '../success/success'
                          });
                        }
                      });
                      //}}} 支付成功，修改订单状态
                      //console.log(res);
                    },
                    'fail': function (res) {
                      //console.log(" === wx request payment fail === ");
                      wx.showToast({
                        title: "支付失败...",//这里打印出登录成功           
                        icon: 'error',
                        duration: 2000
                      });
                      //console.log(res);
                    },
                    'complete': function (res) {
                      //console.log(" === wx request payment complete === ");
                      //wx.showToast({
                      //  title: "支付完成...",//这里打印出登录成功           
                      //  icon: 'success',
                      //  duration: 2000
                      //});
                      //console.log(res);
                    }
                  });
                }else{
                  wx.showToast({
                    title: "支付失败...",//这里打印出登录成功           
                    icon: 'error',
                    duration: 2000
                  });
                }
              //}}} end 微信支付
            }

            }else{
              wx.showToast({
                title: res.data.msg,//这里打印出登录成功           
                icon: 'success',
                duration: 3000
              });
            }
            
           
           
            /*
            if (res.data.status == 0) { wx.showToast({ title: res.data.info, icon: 'loading', duration: 1500 }) } else {
                wx.showToast({
                  title: res.data.info,//这里打印出登录成功           
                  icon: 'success',           
                  duration: 1000          
                })        
            }
            */       
          }
        });   
      }else{
          wx.showToast({
            title: "登录授权失败...",//这里打印出登录成功           
            icon: 'error',
            duration: 1000
          });
          util.wxLogin(this);
      }
    }  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserId();
    this.setData({
      selectedimg:options.selectedimg,
      selectedprice:options.selectedprice,
      serve_id: options.serve_id,
      serve_name: options.serve_name,
      order_id: options.order_id
    });
    if (options.order_id != 'undefined' && options.order_id >0){
      console.log('====== order Info =====');
      var that = this;
        wx.request({
          url: 'https://xcx.heyukj.com/index.php/Portal/Order/orderInfo',
          data: {
            user_id: wx.getStorageSync('userid'),
            order_id: options.order_id
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              order_email: res.data.data.order_email,
              order_tel: res.data.data.order_tel,
              order_names: res.data.data.names,
              order_tconsult: res.data.data.order_tconsult,
              order_vconsult: res.data.data.order_vconsult
            });
          },
          fail: function () {

          }
        })
    }else{
      this.setData({
        order_id: 0
      });
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

