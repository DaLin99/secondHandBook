// pages/nopass/nopass.js
const db = wx.cloud.database()
const todos = db.collection('mybook');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nobook_list: [], //不通过的书
    userId: "",
    isShow_nosell: false,
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
    //获取用户的openid
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

        //查询不通过审核的书
        db.collection('noSell').where({
          _openid: this.data.userId
        }).get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log("不通过审核JSON.stringify(res.data):" + JSON.stringify(res.data));
            mythis.setData({
              nobook_list: res.data
            });
            //  console.log(this.data.isShow_nosell)
            if (mythis.data.nobook_list.length == 0) {
              mythis.setData({
                isShow_nosell: false
              })
            } else {
              mythis.setData({
                isShow_nosell: true
              })
            }
          }
        });
  }})},

  //删去审核不过的书
  del_nosell: function (event) {
    var book_id = event.currentTarget.dataset.id;
    db.collection('noSell').doc(book_id).remove({
      success(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err)
      }
    }),
      console.log("用户id:" + this.data.userId)
    console.log(this.onShow());
  },

 //跳转详情页面
  viemItem: function (event) {
    console.log("跳转？")
    var id = event.currentTarget.dataset.id;
    //加载提示
    wx.showLoading({
      title: '加载中'
    })
    wx.navigateTo({
      url: '../myno-Detail/myno-Detail?id=' + id
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  }
,
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //加载审核不过的书
    if (this.data.nobook_list.length == 20) {
      this.setData({
        page: 0
      })
      console.log("加载审核不过的书的page:" + this.data.page + '0就欧克');
      let page = this.data.page + 20
      console.log("执行了加载审核不过的书！")
      db.collection('noSell').where({
        _openid: this.data.userId
      }).skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.nobook_list
        console.log("新数据：" + new_data)
        console.log("老数据：" + old_data)
        this.setData({
          nobook_list: old_data.concat(new_data),
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