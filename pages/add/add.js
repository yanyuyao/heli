Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg:'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    add_name:'',
    date:'',
    submitnavigator:'',
  },
  
  //上传头像
  imgtap:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          headimg: res.tempFilePaths
        })  
          
      }
    })
  },

  // 点击日期组件确定事件 
  bindDateChange: function (e) { 
    this.setData({ 
      date: e.detail.value 
    }) 
  }, 

  /**提交支付 */
  formSubmit: function (e) {
    var that = this;
    console.log(e.detail.value.sex);
    if (e.detail.value.name.length == 0) {
      wx.showToast({
          title: '姓名不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000);
    } else if (e.detail.value.height.length == 0) {
      wx.showToast(
        {
          title: '身高不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if ( that.data.date == '') {
      wx.showToast(
        {
          title: '出生年月不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    }else if (e.detail.value.addr.length == 0) {
      wx.showToast(
        {
          title: '户口所在地不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.speciale.length == 0) {
      wx.showToast(
        {
          title: '特长不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.tel.length == 0) {
      wx.showToast(
        {
          title: '联系电话不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.tel.length < 11) {
      wx.showToast(
        {
          title: '请输入11位电话!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.degree.length == 0) {
      wx.showToast(
        {
          title: '学历不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.educate.length == 0) {
      wx.showToast(
        {
          title: '毕业院校不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.english.length == 0) {
      wx.showToast(
        {
          title: '英文能力不得为空!',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    } else if (e.detail.value.work.length < 10) {
      wx.showToast(
        {
          title: '工作能力不得少于10个字！',
          icon: '',
          image: '../../images/warn.png',
          duration: 1500
        });
      setTimeout(function () { wx.hideToast() }, 2000); 
    }else{
      wx.request({
        url: 'https://xcx.heyukj.com/index.php/Portal/Interface/addus',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          user_id: 6,
          addus_name:e.detail.value.name,
          addus_url:this.data.headimg,
          addus_sex:e.detail.value.sex,
          addus_height:e.detail.value.height,
          addus_birthday:this.data.date,
          addus_marry:e.detail.value.marry,
          addus_addr: e.detail.value.addr,
          addus_speciale: e.detail.value.speciale,
          addus_tel: e.detail.value.tel,
          addus_degree: e.detail.value.degree,
          addus_educate: e.detail.value.educate,
          addus_english: e.detail.value.english,
          addus_work: e.detail.value.work,
          addus_post: e.detail.value.post,
        },
        success: function (res) {
          console.log('创建订单成功');
          console.log(res);
          if (res.data.status == 1003) {
            wx.showToast({
              title: "提交成功，即将返回首页",//这里打印出登录成功           
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: res.data.msg,//这里打印出登录成功           
              icon: 'success',
              duration: 1000
            });
          }

        }
      });
    }
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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