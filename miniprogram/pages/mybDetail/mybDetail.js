// pages/mybDetail/mybDetail.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     isNone:'',
     id:'',
     isdisabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('mybook').doc(options.id).get({
      success: res => {
        console.log("从数据库读取:"+res.data);
        this.setData({
          book: res.data,
          //id: options.id
        });
        if(this.data.book.gist==''){
          this.setData({
            isNone:true
          })
        }else{
          this.setData({
            isNone:false
          })
        }
      }
    })
    console.log(options.id);
  },

//点击还没呢

wait:function(e){
  wx.showToast({
    title: '那等待卖家吧',
    icon: 'success',
    duration: 2000
  })
  wx.navigateTo({
    url: '../selling/selling',
  })
},

//点击卖了按钮
  sold:function(e){
    var mythat = this;
     console.log(e.currentTarget.dataset.bookid)
     var book_id = e.currentTarget.dataset.bookid;
     wx.showModal({
      title: '恭喜恭喜',
      content: '你找到买家了?',
      success(res) {
        if (res.confirm) {
          
          mythat.setData({
            isdisabled:true
          })
           //增加到sold_book数据库了
    db.collection('sold_book').add({
      data: {
        isbn: mythat.data.book.isbn,
        title: mythat.data.book.title,
        author: mythat.data.book.author,
        publisher: mythat.data.book.publisher,
        pubdate: mythat.data.book.pubdate,
        price: mythat.data.book. price,
        newprice: mythat.data.book.newprice,
        gist: mythat.data.book.gist,
        looklike: mythat.data.book.looklike,
        wechat: mythat.data.book.wechat,
        remark: mythat.data.book.remark,
        category: mythat.data.book.category,
        openid:mythat.data.book.openid,
        img:mythat.data.book.img
      }
    })
      .then(res => {
        console.log("添加到sold_book:"+res);
        db.collection('mybook').doc(book_id).remove({
          success(res) {
            console.log("mybook删除成功:"+res);
            wx.showToast({
              title: '好的呢',
              icon: 'success',
              duration: 2000
            })
          },
        

          fail(err) {
            console.log(err)
          }
        })
      })
        } else if (res.cancel) {
          wx.showToast({
            title: '坐等买家上门啦',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    
    
  }
})