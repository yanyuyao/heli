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
  console.log("===== FUN wxLogin =====");
  var usersession = wx.getStorageSync('usersession');
  console.log("");
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
          console.log(info);
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
              console.log('==================== ouid ==========');
              console.log(res.data.ouid);
              wx.setStorageSync('usersession', res.data.ouid);
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              }
              //that.setData({
              //  usersession: res.data.ouid
              //});
              //console.log(that.data.usersession);
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
  console.log("======= Fun uploadFileToServer 上传文件方法 ========");
  console.log(tempFilePaths);
  wx.saveFile({
    tempFilePath: tempFilePaths,
    success: function (res) {
      var savedFilePath = res.savedFilePath;
      console.log("====== save file path =======");
      console.log("==== save file path : " + savedFilePath);
      wx.uploadFile({
        url: 'https://xcx.heyukj.com/index.php/Portal/Order/uploadfiles',
        filePath: savedFilePath,
        name: "file",
        formData: {
          "filetype": filetype
        },
        success: function (res) {
          wx.showModal({
            title: '上传文件成功'
          });
          var data = res.data;
          console.log(res);
          //do something
        },
        fail:function(res){
          console.log(res);
          wx.showModal({
            title: '上传文件失败'
          });
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
  console.log("===== Fun userServiceStratus=====");
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
      console.log(res.data);
      if (res.data.data.morethan6 == 1){
        wx.showToast(
          {
            title: '距离您上次购买时间不能小于6小时!',
            icon: '',
            image: 'loading',
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
              image: 'loading',
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
  console.log("========= register User ==========");
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
  console.log("======= get User Id =============");
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
        console.log("===>"+res.data.status);
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
  console.log('userid==>'+wx.getStorageSync('userid'));
  console.log('usersession==>' + wx.getStorageSync('usersession'));
  console.log("======== end get User Id ============");

  return userid;
}
module.exports = {
  formatTime: formatTime,
  wxLogin: wxLogin,
  uploadFileToServer:uploadFileToServer,
  userServiceStatus: userServiceStatus,
  getUserId: getUserId
}
