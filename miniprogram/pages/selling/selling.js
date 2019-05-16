// pages/selling/selling.js
const db = wx.cloud.database()
const todos = db.collection('mybook');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mybook_list: [],
    userId: "",
    isShow_selling: false,
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
  onShow: function (options){
    //获取用户的openid
    var mythis = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        mythis.setData({
          userId: res.result.event.userInfo.openId
        });
        console.log("获取的id:" + this.data.userId);

       

       
        //查询正在卖的书
        db.collection('mybook').where({
          _openid: this.data.userId
        }).get({
          success(res) {
            console.log("正在卖JSON.stringify(res.data)" + JSON.stringify(res.data));
            mythis.setData({
              mybook_list: res.data,
            });

            // console.log("mybooklist的长度："+mythis.data.mybook_list.length)
            if (mythis.data.mybook_list.length == 0) {
              mythis.setData({
                isShow_selling: false
              })
              console.log("执行if")
            } else {
              mythis.setData({
                isShow_selling: true
              });
              console.log("执行else")
            }
          },

        });
        },
    })},

  //点击查看按钮，显示书的详情
  viemItem: function (event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    //加载提示
    wx.showLoading({
      title: '加载中'
    })
    wx.navigateTo({
      url: '../mybDetail/mybDetail?id=' + id
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  }
  ,

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.mybook_list.length == 20) {
      let page = this.data.page + 20
      console.log("执行了加载正在卖的书！")
      db.collection('mybook').where({
        _openid: this.data.userId
      }).skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.mybook_list
        console.log("新数据：" + new_data)
        console.log("老数据：" + old_data)
        this.setData({
          mybook_list: old_data.concat(new_data),
          page: page
        }, res => {
          console.log(res);
          // console.log(this.onReachBottom())
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
    })