// pages/bookDetail/bookDetail.js
const db = wx.cloud.database();
Page({
  data: {
    isNone: true,
    book: {
      title: '卖完了',
      author: '卖完了',
      isbn: '卖完了',
      publisher: '卖完了',

    }
  },
  onLoad: function (options) {
    db.collection('mybook').doc(options.id).get({
      success: res => {
        console.log("从数据库读取:" + JSON.stringify(res.data));
        this.setData({
          book: res.data,
          id: options.id,
          
        });
        if (this.data.book.gist == '') {
          this.setData({
            isNone: true
          })
        } else {
          this.setData({
            isNone: false
          })
        }
      }
    })
    console.log('options.id:'+options.id);
  },

  //加入购物车
  addTomycart: function () {
    console.log("加入购物车了！")
    var book = this.data.book;
    var arr = wx.getStorageSync('cartItems') || [];
    console.log("读取缓存cartItems,{}", arr);
    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j]._id == this.data.id) {
          try {
            console.log("你已经收藏过了");
            wx.showToast({
              title: '购物车已有',
              duration: 20000
            })
          } catch (e) {
            console.log(e)
          }
          return;
        }
      }
      arr.push(book);
    } else {
      arr.push(book);
    }
    // 最后，把购物车数据，存放入缓存  
    try {
      wx.setStorageSync('cartItems', arr)
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 2000
      })
      return;
    } catch (e) {
      console.log(e)
    };
  }
})