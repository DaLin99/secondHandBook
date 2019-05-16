const app = getApp()
const db = wx.cloud.database()
const todos = db.collection('userId')
Page({
  data: {
   openid:''
  },

  onLoad: function () {
    {
      // 在没有 open-type=getUserInfo 版本的兼容处理
    var mythis = this
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          console.log('获取到用户信息的res.result: ', res.result);
          this.setData({
            openid: res.result.openid
          })
          console.log('openid:' + this.data.openid)
          console.log('openid:' + res.result.openid)

          if (this.data.openid =='oAnH-48E8Tu0D7NFBGd0647K2IQE'){
            wx.navigateTo({
              url: '/pages/administrator/administrator',
            })
          }else{
                 
            db.collection('userId').where({
              openid: this.data.openid,
            })
              .get({
                success(res) {
                  console.log(res)
                  console.log("123")

                  // res.data 是包含以上定义的两条记录的数组
                  if (res.data.length != 0) {
                    wx.switchTab({
                      url: '/pages/test/test',
                      success: function (res) {
                        console.log("跳转到首页JSON.stringify(res):" + res);

                      },
                      fail: function (err) {
                        console.log("跳转到首页111失败的err" + JSON.stringify(err));
                        console.log("why")
                      }
                    })
                  } else {
                    console.log("wuwu")
                  }
                },
                fail(err) {
                  console.log(err)
                }
              })



          }




         

        },
        fail: err => {
          console.log("获取用户信息失败的err:" + err)
        }
      })
    }
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.errMsg);
    var err = e.detail.errMsg;
    if (err != 'getUserInfo:fail auth deny') {
      db.collection('userId').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          openid:this.data.openid
        }
      })
        .then(res => {
          wx.switchTab({
            url: '/pages/test/test',
            success: function (res) {
              console.log("跳转到首页JSON.stringify(res):" + res);

            },
            fail: function (err) {
              console.log("跳转到首页111失败的err" + JSON.stringify(err));
              console.log("why")
            }
          })
        })
    } else {
      wx.showToast({
        title: '无法体验一波啦',
      })
    }
  },

  goIndex: function () {

  }
})