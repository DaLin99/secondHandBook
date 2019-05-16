const app = getApp()
Page({
  data: {
    user: {
      appid: "",
      openid: ""
    }
  },

  onLoad: function(options) {
    {
      // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getSetting({
         success:res=>{
           if(res.authSetting['scope.userInfo']){
             wx.getUserInfo({
                success:res=>{
                  this.setData({
                    userInfo:res.userInfo,
                    logged:true

                  })
                  app.globalData.userInfo = res.userInfo
                }
             })
           }
         }
        })
    }
  },

  bindGetUserInfo: function(e) {
    if(!this.data.logged&&e.data.userInfo){
      this.setData({
        logged:true,
        userInfo:e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo;
      setTimeout(function(){
        wx.showToast({
          title: '登录成功',
        },1500)
      })
    }
  

 

  }})