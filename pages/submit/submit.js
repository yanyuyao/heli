var utilMd5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');  
var musicsData = [];
var app = getApp();
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
    audioCtx:'',
    luyindisplay:'block',
    shitingdisplay:"none",
    shililist:[],
    musicList:[],
    confirmdisplay:'none',
    isPlayingMusics: [],
    musicId: "",
  },
  
  audioPlay: function (e) {
    if(this.audioCtx !== undefined){
      this.audioCtx.pause();
    }
    var curplayid = e.currentTarget.id;
    this.audioCtx = wx.createAudioContext(curplayid);
    this.audioCtx.play();
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
      success: function (res) {
        setTimeout(function () {
          //暂停播放
          wx.stopRecord()
        }, 59000);
        var tempFilePaths = res.tempFilePath;
        wx.saveFile({
          tempFilePath: tempFilePaths,
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            wx.setStorageSync('soundfile', savedFilePath);
          }
        })
        

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
    this.setData({
      luyindisplay: 'none',
      shitingdisplay: "block",
    })

  },
  /**试听录音文件 */
  silkPlay: function () {
    var that = this;
    wx.playVoice({
      filePath: wx.getStorageSync('soundfile'),
      complete:function(){
      }
    })
  },

  /** 录音删除重录 */
  deletetap:function(){
    this.setData({
      luyindisplay: 'block',
      shitingdisplay: "none",
      confirmdisplay:'none',
    });
    wx.pauseVoice();
    wx.setStorageSync('soundfile','')
  },

  /** 录音确认上传 */
  confirmtap:function(){
    this.setData({
      confirmdisplay:'block',
      shitingdisplay:'none',
    });
    wx.pauseVoice();
    if(wx.getStorageSync('soundfile')){
      util.uploadFileToServer(wx.getStorageSync('soundfile'), 'sounds');
    }
    
  },


  /**
   * 提交订单
   */
  formSubmit: function (e) {
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
    } else if(e.detail.value.shengming.length == 0){
        wx.showToast({
          title: '请勾选同意免责声明！', icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
        setTimeout(function () { wx.hideToast() }, 2000) 
    } else if (wx.getStorageSync('ordersounds') != '' || e.detail.value.zixun_text!=''){
      wx.showToast(
        {
          title: '订单提交中...',
          icon: 'loading',
          duration: 500
        }); 
      var usersession = wx.getStorageSync('usersession');
      if(usersession){
       var that = this;
        wx.request({
          url: 'https://helizixun.cn?g=Portal&m=Order&a=createOrder', 
          header: { "Content-Type": "application/x-www-form-urlencoded" }, 
          method: "POST", 
          data: { 
            order_id: this.data.order_id,
            usersession: usersession,
            users_id: this.data.userid,
            serve_id: this.data.serve_id,
            serve_name: this.data.serve_name,
            number:1,
            amount: this.data.selectedprice,
            //amount: 0,
            names:e.detail.value.companyname,
            order_vconsult: wx.getStorageSync('ordersounds'),
            order_tconsult: e.detail.value.zixun_text,
            order_tel: e.detail.value.phone, 
            order_email: e.detail.value.email 
          }, 
          success: function (res) {
            if (res.data.status == 1003){
              var order_id = res.data.data.order_id;
              var order_num = res.data.data.order_num;
              if (res.data.data.pay_type == 'dev'){//支付为0，
                wx.showToast({
                  title: "支付成功...",//这里打印出登录成功           
                  icon: 'success',
                  duration: 2000  
                });
                
              }else{
              
                var reswxData = res.data.data.wxorder;

                if (reswxData.return_code == 'SUCCESS'){
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
                      wx.request({
                        url: 'https://helizixun.cn/index.php?g=Portal&m=Order&a=payOrder',
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
                            url: '../success/success?sid=' + that.data.serve_id+'&oid='+that.data.order_id
                          });
                          wx.setStorageSync('soundfile','');
                          wx.setStorageSync('ordersounds', '');
                        }
                      });
                    },
                    'fail': function (res) {
                      wx.showToast({
                        title: "支付失败...",//这里打印出登录成功           
                        icon: '',
                        image: '../../images/warn.png', 
                        duration: 2000
                      });
                      wx.setStorageSync('soundfile', '');
                      wx.setStorageSync('ordersounds', '');
                    },
                    'complete': function (res) {
                    }
                  });
                }else{
                  wx.showToast({
                    title: "支付失败...",//这里打印出登录成功           
                    icon: '',
                    image: '../../images/warn.png', 
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
             
          }
        });   
      }else{
          wx.showToast({
            title: "登录授权失败...",//这里打印出登录成功           
            icon: 'error',
            image: '', 
            duration: 1000
          });
          util.wxLogin(this);
      }
    } else if (wx.getStorageSync('soundfile')!=''){
      wx.showToast({
        title: '请上传语音！',          
        icon: '',
        image: '../../images/warn.png', 
        duration: 1500
      });
    } else if (wx.getStorageSync('soundfile') == '') {
      wx.showToast({
        title: '请录音或填写咨询文本',
        icon: '',
        image: '../../images/warn.png',
        duration: 1500
      });
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
      order_id: options.order_id,
    });
    if (options.order_id != 'undefined' && options.order_id >0){
      var that = this;
        wx.request({
          url: 'https://helizixun.cn/index.php?g=Portal&m=Order&a=orderInfo',
          data: {
            user_id: wx.getStorageSync('userid'),
            order_id: options.order_id
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
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

    var that = this;
    wx.request({
      url: 'https://helizixun.cn/index.php?g=Portal&m=Interface&a=VsampleList',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          musicList: res.data.data,
          musicsData:res.data.data
        });
      },
      fail: function () {
      }
    })
  },



  onShow: function (options) {
    var musicId = app.globalData.g_currentMusicId;
    //实现页面再次载入时音乐图标显示正确
    if (app.globalData.g_isPlayingMusic) {
      //var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      })
      //app.globalData.g_isPlayingMusic = true;
    }
    else {
      var isPlayingMusics = [];
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId
      })
    }
    this.setMusicMonitor();
  },
  //监听总控开关与页面开关一致
  setMusicMonitor: function () {
    var that = this;
    //音乐是否播放
    wx.onBackgroundAudioPlay(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      that.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = true;
      // app.globalData.g_currentMusicId = musicId;
    })
    //音乐是否暂停
    wx.onBackgroundAudioPause(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false
      that.setData({
        isPlayingMusics: isPlayingMusics,
        //musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      //app.globalData.g_currentMusicId = musicId;
    })
    //音乐播放结束
    wx.onBackgroundAudioStop(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false
      that.setData({
        isPlayingMusics: isPlayingMusics,
        //musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      //app.globalData.g_currentMusicId = musicId;
    })
  },
  //实现音乐的播放与暂停
  onMusicTap: function (event) {
    var musicId = event.currentTarget.dataset.musicid;
    var musicData = this.data.musicList[musicId - 1];
    var isPlayingMusic = this.data.isPlayingMusics[musicId - 1];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false;
      this.setData({
        isPlayingMusics: isPlayingMusics,
        // musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      //app.globalData.g_currentMusicId = null;
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: musicData.mp3Url,
        title: musicData.name,
      })
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      })
      app.globalData.g_currentMusicId = musicId;
      app.globalData.g_isPlayingMusic = true;
    }
  },
  
  onUnload:function(){
    wx.pauseBackgroundAudio();
  }

})

