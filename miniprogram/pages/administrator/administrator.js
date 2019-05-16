// pages/seller/seller.js

const db = wx.cloud.database()
const todos = db.collection('checks')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book_list: [],
    noCheck:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //读取check
    var mythis = this;
    db.collection('check').get({
      success: res => {
         console.log("check数据"+JSON.stringify(res.data));
        
        mythis.setData({
          book_list: res.data
        });
        console.log("check数据"+this.data.book_list);
        if(this.data.book_list==''){
          mythis.setData({
            noCheck:true
          })
        }else{
          mythis.setData({
            noCheck:false
          })
        }
      }
    });
  },

  onShow: function(options) {
    //读取check
    var mythis = this;
    db.collection('check').get({
      success: res => {
         console.log("check数据"+JSON.stringify(res.data));
        
        mythis.setData({
          book_list: res.data
        });
        console.log("check数据"+this.data.book_list);
        if(this.data.book_list==''){
          mythis.setData({
            noCheck:true
          })
        }else{
          mythis.setData({
            noCheck:false
          })
        }
      }
    });
  },

  viemItem: function(event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../admin-detail/admin-detail?id=' + id
   })
  }

})