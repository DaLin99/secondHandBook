// pages/mycheckDetail/mycheckDetail.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isNone: '11',
    book_id: '11'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('options:'+JSON.stringify(options))
    db.collection('noSell').doc(options.id).get({
      success: res => {
        console.log("从数据库读取_id:" + JSON.stringify(res));
        this.setData({
          book: res.data,
        });
        console.log("book:" + this.data.book._id)
        if (this.data.book.gist == '') {
          this.setData({
            isNone: true,
            book_id: this.data.book._id
          })
        } else {
          this.setData({
            isNone: false,
            book_id: this.data.book._id
          })
        }
      }
    })
  },
  //跳转到扫码的页面
  navToScan:function(event){
   wx.switchTab({
      url: '/pages/scanCode/scanCode',
      fail:(err)=>{
        console.log(err)
      }
    })
  },

//删除不过的书籍
 del_nosell: function (event) {
   console.log(event);
    db.collection('noSell').doc(this.data.book_id).remove({
      success(res) {
        console.log(res);
        console.log(this.onShow());
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  





})


