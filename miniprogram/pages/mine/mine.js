// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
goselling:function(){
  wx.navigateTo({
    url: '../selling/selling'
  })
},
goselled: function () {
    wx.navigateTo({
      url: '../selled/selled'
    })
  },
  gochecking: function () {
    wx.navigateTo({
      url: '../checking/checking'
    })
  },
  gonopass: function () {
    wx.navigateTo({
      url: '../nopass/nopass'
    })
  },
  aboutour:function(){
    wx:wx.navigateTo({
      url: '../aboutus/aboutus'
    })
  }
})