var utilMd5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');  
var app = getApp;
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
    confirmdisplay:'none',
    j: 1,//帧动画初始图片 
    isPlaying: false,//是否正在播放语音 
    yuyindisplay:'block',
  },
  audioPlay: function (e) {
    console.log(this.audioCtx);
    if(this.audioCtx !== undefined){
      this.audioCtx.pause();
    }
    var curplayid = e.currentTarget.id;
    console.log(curplayid);
    this.audioCtx = wx.createAudioContext(curplayid);
    this.audioCtx.play();
    var that = this;
    playing.call(that);
    that.setData({
      isPlaying: true,
      yuyindisplay: 'none',
    }) 
    /**
    wx.playVoice({
      filePath: e.currentTarget.dataset.src,
    })*/
  },
  audiostop:function(){
    this.setData({
      isPlaying: false,
      yuyindisplay: 'block',
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
      success: function (res) {
        console.log("9999999999--->"+res);
        /*
        that.setData({
          soundfile: res.tempFilePath
        });
       */
        setTimeout(function () {
          //暂停播放
          wx.stopRecord()
        }, 59000);
        //console.log(that.data.soundfile);
        console.log('==== 保存录音文件 ====');
        var tempFilePaths = res.tempFilePath;
        console.log('tem file ==>' + tempFilePaths);
        wx.saveFile({
          tempFilePath: tempFilePaths,
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            console.log("====== save file =======");
            wx.setStorageSync('soundfile', savedFilePath);
          }
        })
        
        console.log('}}}==== 保存录音文件 ====');

        
        //console.log(res.tempFilePath);
        //console.log('8888===>' + wx.getStorageSync('soundfile'));

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
    console.log('录音文件路径' + wx.getStorageSync('soundfile'))
    //console.log('录音文件路径' + this.data.soundfile);
    var that = this;
    wx.playVoice({
      filePath: wx.getStorageSync('soundfile'),
      complete:function(){
        console.log('试听录音文件成功');
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
    wx.setStorageSync('soundfile','')
  },

  /** 录音确认上传 */
  confirmtap:function(){
    this.setData({
      confirmdisplay:'block',
      shitingdisplay:'none',
    });
    if(wx.getStorageSync('soundfile')){
      //util.uploadFileToServer(this.data.soundfile, 'sounds');
      util.uploadFileToServer(wx.getStorageSync('soundfile'), 'sounds');
    }
    
  },


  /**
   * 提交订单
   */
  formSubmit: function (e) {
    console.log(e.detail.value.zixun_text);
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
    } else if(e.detail.value.shengming.length == 0){
        wx.showToast({
          title: '请勾选同意免责声明！', icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
        setTimeout(function () { wx.hideToast() }, 2000) 
    } else {
        //console.log('create order');
        //console.log(this.data.serve_name);
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
                //wx.navigateTo({
                 // url:'../success/success/?sid='+this.data.serve_id
                //});
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
                            url: '../success/success?sid=' + that.data.serve_id
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
                        icon: '',
                        image: '../../images/warn.png', 
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
            image: '../../images/warn.png', 
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
        console.log("录音示例文件列表");
        console.log(res);
        that.setData({
          shililist:res.data.data
        });
      },
      fail: function () {
        console.log("获取录音示例文件列表失败");
      }
    })
  },
})
//语音播放帧动画 
function playing() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 4;
    _this.setData({
      j: i
    })
  }, 500);
}
