// pages/mycheckDetail/mycheckDetail.js
   const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     isNone:'11',
     book_id:'11',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('options:'+JSON.stringify(options))
    db.collection('check').doc(options.id).get({
      success: res => {
        console.log("从数据库读取_id:"+JSON.stringify(res));
        this.setData({
          book: res.data,
        });
        console.log("book:"+this.data.book._id)
        if(this.data.book.gist==''){
          this.setData({
            isNone:true,
            book_id:this.data.book._id
          })
        }else{
          this.setData({
            isNone:false,
            book_id:this.data.book._id
          })
        }
      }
    })
  },
//不卖了

noSell:function(e){
  var mythis = this
  wx.showModal({
    title: '震惊?!',
    content: '您不卖这本书了吗？',
    success(res) {
      if (res.confirm) {
        //在check删除了
       console.log(e.currentTarget.dataset.bookid)
       var book_id = e.currentTarget.dataset.bookid
        db.collection('check').doc(book_id).remove({
          success(res) {
            console.log(res)
          },
          fail(err) {
            console.log(err);
            console.log("id:"+book_id)
          }
        })
       mythis.setData({
         disabled:true
       })
      

        //提示用户
        wx.showToast({
          title: '那就不卖了',
          icon: 'success',
          duration: 2000
        })
      } else if (res.cancel) {
        wx.showToast({
          title: '等待审核啦',
          icon: 'success',
          duration: 2000
        })
      }
    }
  })
}




})
  

  