Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots:true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    userInfo: getApp().globalData.userInfo,
    userTest: getApp().globalData.userTest,
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  createUser: function(e){
    var l = 'https://wx.cfweb2015.com/index.php/User/Register/register/';
    wx.request({
      url: l,
      data: {
        "openId":'1234567890',
        "avatar":"http://www.henkuai.com/uc_server/images/noavatar_middle.gif",
        "user_nicename":'ran',
        "sex":1,
        "province":'山东',
        "city":'德州',
        "area":'禹城'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
      // header: {}, // 设置请求的 header    
      success: function (res) {
        var obj = {};
        obj.userid = res.data.userid;
        obj.nickname = res.data.nickname;
        console.log('aaaaaaaaaaaaaaaaaaa');
        console.log(res);
        //obj.expires_in = Date.now() + res.data.expires_in;
        //console.log(obj);  
        wx.setStorageSync('user', obj);//存储openid    
      }
    });
  }
})