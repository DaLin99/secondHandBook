// pages/checking/checking.js
const db = wx.cloud.database()
const todos = db.collection('mybook');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbook_list: [], //正在审查
    userId: "",
    isShow_checking: false,
    id: '',
    book: ''
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
    var mythis = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        mythis.setData({
          userId: res.result.event.userInfo.openId
        });
        console.log("获取的id:" + this.data.userId);

        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        //查询正在审核的书
        db.collection('check').where({
          _openid: this.data.userId
        }).get({
          success(res) {
            console.log("正在审核JSON.stringify(res.data)" + JSON.stringify(res.data));
            mythis.setData({
              checkbook_list: res.data,
            });

            //console.log("isShow_selling:"+mythis.data.isShow_checking+"90402")
            if (mythis.data.checkbook_list.length == 0) {
              mythis.setData({
                isShow_checking: false,
              })
            } else {
              mythis.setData({
                isShow_checking: true
              })
            };
          }
        });
  },})},

  navTocheckDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../mycheckDetail/mycheckDetail?id=' + id
    })
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
    if (this.data.checkbook_list.length == 20) {
      this.setData({
        page: 0
      })
      console.log("加载正在审查的书的page:" + this.data.page + '0就欧克');
      let page = this.data.page + 20
      console.log("执行了加载正在审查的书！")
      db.collection('check').where({
        _openid: this.data.userId
      }).skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.checkbook_list
        console.log("新数据：" + new_data)
        console.log("老数据：" + old_data)
        this.setData({
          checkbook_list: old_data.concat(new_data),
          page: page
        }, res => {
          console.log(res);
          // console.log(this.onReachBottom())
        })
      })
    }
    
  },
  onPullDownRefresh: function () {
    console.log(this.onShow())
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})