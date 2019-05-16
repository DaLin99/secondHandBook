// pages/selled/selled.js
const db = wx.cloud.database()
const todos = db.collection('sold_book');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    soldbook_list: [],
    userId: "",
    isShow_sold: false,
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

        db.collection('sold_book').where({
          _openid: this.data.userId
        }).get({
          success(res) {
            console.log("已经卖JSON.stringify(res.data)" + JSON.stringify(res.data));
            var temp = JSON.stringify(res.data);
            mythis.setData({
              soldbook_list: res.data
            });

            if (mythis.data.soldbook_list.length == 0) {
              mythis.setData({
                isShow_sold: false

              })
              console.log("这里执行了啊")
            } else {
              mythis.setData({
                isShow_sold: true
              });
              console.log("执行了啊")
            }
          }
        });

      }
    })
  },
  //删除功能
  del_sold: function (event) {
    console.log(event)
    var book_id = event.currentTarget.dataset.id;
    console.log(book_id)
    db.collection('sold_book').doc(book_id).remove({
      success(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err)
      }
    });
    console.log(this.onShow());
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.soldbook_list.length == 20) {
      this.setData({
        page: 0
      })
      console.log("加载已经卖的书的page:" + this.data.page + '0就欧克');
      let page = this.data.page + 20
      console.log("执行了加载已经卖的书！")
      db.collection('sold_book').where({
        _openid: this.data.userId
      }).skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.checkbook_list
        console.log("新数据：" + new_data)
        console.log("老数据：" + old_data)
        this.setData({
          soldbook_list: old_data.concat(new_data),
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