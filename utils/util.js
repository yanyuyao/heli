function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 登录usersession
 */
function wxLogin(e) {
  //wx.showModal({
  //  title: '登录'
  //});
  //调用登录接口
  //1.小程序调用wx.login得到code.
  var usersession = wx.getStorageSync('usersession');
  if(usersession){
    return 1;
  }

  //var that = e;
  wx.login({
    success: function (res) {
      var code = res['code'];
      //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
      wx.getUserInfo({
        success: function (info) {
          var rawData = info['rawData'];
          var signature = info['signature'];
          var encryptData = info['encryptData'];
          var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
          var iv = info['iv'];

          getApp().globalData.userInfo = info.userInfo;
          //typeof cb == "function" && cb(that.globalData.userInfo)

          //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
          wx.request({
            url: 'https://xcx.heyukj.com/index.php/User/Register/wxLogin/',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            }, // 设置请求的 header   
            success: function (res) {
              wx.setStorageSync('usersession', res.data.ouid);
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              }
              //that.setData({
              //  usersession: res.data.ouid
              //});
              //typeof func == "function" && func(res.data);
            }
          });
        }
      });

    }
  });
}
//}}} 用户登录

//{{{上传文件
function uploadFileToServer(tempFilePaths, filetype) {
  wx.saveFile({
    tempFilePath: tempFilePaths,
    success: function (res) {
      var savedFilePath = res.savedFilePath;
      wx.uploadFile({
        url: 'https://xcx.heyukj.com/index.php/Portal/Order/uploadfiles',
        filePath: savedFilePath,
        name: "file",
        formData: {
          "filetype": filetype
        },
        success: function (res) {
          var data = res.data;
          data = eval('(' + data + ')');
          if (data.status == 1001 && data.url != ''){
            if (filetype == 'xcx_aratar'){
              wx.setStorageSync('useravatar', data.url);
            }else if (filetype == 'sounds'){
              wx.setStorageSync('ordersounds', data.url);
            }
          }
          /*else{
            wx.showToast(
              {
                title: '上传失败rrr!',
                icon: '',
                image: '../../images/warn.png',
                duration: 1500
              });
            setTimeout(function () { wx.hideToast() }, 2000); 
          }
          */
          //do something
          wx.showToast(
            {
              title: '上传成功!',
              icon: '',
              image: '../../images/warn.png',
              duration: 1500
            });
          setTimeout(function () { wx.hideToast() }, 2000); 

        },
        fail:function(res){
          wx.showModal({
            title: '上传文件失败'
          });
        },
        complete:function(res){
          var data = res.data;
          data = eval('(' + data + ')');
          if (data.status == 1001 && data.url != '') {
            if (filetype == 'xcx_aratar') {
              wx.setStorageSync('useravatar', data.url);
            } else if (filetype == 'sounds') {
              wx.setStorageSync('ordersounds', data.url);
            }
          }
          //do something
          /**
          *wx.showToast(
          * {
          *    title: '上传完成!',
          *    icon: '',
          *    image: '../../images/warn.png',
          *    duration: 1500
          *  });
          *setTimeout(function () { wx.hideToast() }, 2000);
           */
        }
      });
    }
  })


}

//}}} end 上传文件


/**
 * 获取上次下单时间和服务次数
 */
function userServiceStatus(curthis,serve_id) {
  var that = curthis;
  var userid = wx.getStorageSync('userid');
  var usersession = wx.getStorageSync('usersession');
  
  wx.request({
    url: 'https://xcx.heyukj.com/index.php/Portal/Order/getUserServiceStatus',
    data: {
      user_id: wx.getStorageSync('userid'),
      serve_id:serve_id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.data.data.morethan6 == 1){
        wx.showToast(
          {
            title: '距离您上次购买时间不能小于6小时!',
            icon: '',
            image: '../../images/warn.png',
            duration: 2500
          });
        setTimeout(function () { wx.hideToast() }, 2000); 
        that.setData({
          footerdisplay: "none"
        });
      }else{
        if (res.data.data.limitbuy == 1) {
          wx.showToast(
            {
              title: '达到了今日购买次数上限!',
              icon: '',
              image: '../../images/warn.png',
              duration: 2500
            });
          setTimeout(function () { wx.hideToast() }, 2000);
          that.setData({
            footerdisplay: "none"
          });
        }
      }
    },
    fail: function () {

    }
  })
  
}
function registerUser(){
  var userInfo = getApp().globalData.userInfo;
  if(!userInfo){
    wx.getUserInfo({
      success: function (info) {
        getApp().globalData.userInfo = info.userInfo;
        userInfo = info.userInfo;
        wx.request({
          url: 'https://xcx.heyukj.com/index.php/User/Register/register',
          data: {
            openId: wx.getStorageSync('usersession'),
            avatar: userInfo.avatarUrl,
            user_nicename: userInfo.nickName,
            sex: userInfo.gender,
            province: userInfo.province,
            city: userInfo.city,
            area: userInfo.country
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.data.status == '1003') {
              wx.setStorageSync('userid', res.data.data.userid);
            }
          },
          fail: function () {

          }
        })
      }
    });
  }
 
}
function getUserId(curthis){
  var userid = wx.getStorageSync('userid');
  var usersession = wx.getStorageSync('usersession');

  if (!usersession) {
    wxLogin(curthis);
  }

  if (!userid) {
    //根据session获得user_id
    wx.request({
      url: 'https://xcx.heyukj.com/index.php/User/Register/getUserId',
      data: {
        openId: usersession
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.status == '1001'){
          wx.setStorageSync('userid', res.data.userid);
          userid = res.data.userid;
        }else{
          //注册一个
          
          userid = registerUser();
        }
      },
      fail: function () {
        
      }
    })
  };

  return userid;
}


/**图片高度自适应 */
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight / originalWidth;//图片高宽比 
  //获取屏幕宽高 
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比 
      //图片缩放后的宽为屏幕宽 
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;

    }
  })
  return imageSize;
}

module.exports = {
  formatTime: formatTime,
  wxLogin: wxLogin,
  uploadFileToServer: uploadFileToServer,
  userServiceStatus: userServiceStatus,
  getUserId: getUserId,
  imageUtil: imageUtil
}
