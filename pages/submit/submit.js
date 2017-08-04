Page({

  /**
   * 页面的初始数据
   */
  data: {
    serve_id:0,
    selectedimg:'',
    selectedprice:'',
    serve_name:'',
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
   * 提交订单
   */
  formSubmit: function (e) {
    if (e.detail.value.companyname.length == 0) { 
        wx.showToast(
          { 
            title: '姓名/公司不得为空!', 
            icon: 'loading', 
            duration: 1500 
          });    
          setTimeout(function () { wx.hideToast()}, 2000); 
    } else if (e.detail.value.phone.length == 0){
      wx.showToast(
        {
          title: '手机号码不得为空!',
          icon: 'loading',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    }else if (e.detail.value.phone.length != 11) { 
        wx.showToast(
          { 
            title: '请输入11位手机号码!', 
            icon: 'loading', 
            duration: 1500 
          });    
          setTimeout(function () {wx.hideToast()}, 2000) 
    } else if (e.detail.value.email.length == 0) { 
        wx.showToast({ title: '请输入邮箱!', icon: 'loading', duration: 1500 });    
        setTimeout(function () { wx.hideToast() }, 2000) 
    } else {
      console.log('create order');
        console.log(this.data.serve_name);
        wx.request({
          url: 'https://xcx.heyukj.com/Portal/Order/createOrder', 
          header: { "Content-Type": "application/x-www-form-urlencoded" }, 
          method: "POST", 
          data: { 
            users_id:6,
            serve_id: this.data.serve_id,
            serve_name: this.data.serve_name,
            number:1333,
            amount: this.data.selectedprice,
            names:e.detail.value.companyname,
            order_vconsult: this.data.soundfile,
            order_tconsult: e.detail.value.zixun_text,
            order_tel: e.detail.value.phone, 
            order_email: e.detail.value.email 
          }, 
          success: function (res) {
            console.log('创建订单成功');
            console.log(res);
            if (res.data.status == 1003){
              var order_id = res.data.data.order_id;
              var order_num = res.data.data.order_num;
              wx.showToast({
                title: "订单创建成功,请支付...",//这里打印出登录成功           
                icon: 'success',
                duration: 1000
              });
            }else{
              wx.showToast({
                title: res.data.msg,//这里打印出登录成功           
                icon: 'success',
                duration: 1000
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
        
    }  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
      selectedimg:options.selectedimg,
      selectedprice:options.selectedprice,
      serve_id: options.serve_id,
      serve_name: options.serve_name
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