// pages/mycart/mycart.js
Page({
  data: {
    cartItems: [],
    total: 0,
    CheckAll: true,
  },

  //再次渲染
  onLoad: function () {

  },
  //全选
  select: function (e) {
    var CheckAll = this.data.CheckAll;
    CheckAll = !CheckAll
    var cartItems = this.data.cartItems
    for (var i = 0; i < cartItems.length; i++) {
      cartItems[i].selected = CheckAll
    }
    this.setData({
      cartItems: cartItems,
      CheckAll: CheckAll
    })
    this.getsumTotal()
    console.log(this.data.CheckAll)
  },


  //合计
  getsumTotal: function () {
    var sum = 0
    for (var i = 0; i < this.data.cartItems.length; i++) {
      if (this.data.cartItems[i].selected) {
        sum += this.data.cartItems[i].newprice
      }
    }
    //更新数据
    this.setData({
      total: sum
    })
  },

  // 选中
  selectedCart: function (e) {
    var cartItems = this.data.cartItems //获取购物车列表
    var index = e.currentTarget.dataset.index; //获取当前点击事件的下标索引
    var selected = cartItems[index].selected;
    //取反
    cartItems[index].selected = !selected;
    this.setData({
      cartItems: cartItems
    })
    this.getsumTotal();
    wx.setStorageSync("cartItems", cartItems)
  },
  //清空购物车
  delall: function () {
    var mythis = this;
    wx.showModal({
      title: '',
      content: '你要清除购物车吗?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.removeStorage({
            key: 'cartItems',
            success(res) {
              console.log(res);
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            }
          }),
            mythis.setData({
              cartItems: []
            })
        } else if (res.cancel) {
          wx.showToast({
            title: '那就别删了',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /*渲染界面*/
  onShow: function () {
    var cartItems = wx.getStorageSync("cartItems")
    console.log(cartItems)
    this.setData({
      cartList: false,
      cartItems: cartItems
    })
    this.getsumTotal()
  },
  //看书详情
  viemItem: function (event) {
    var id = event.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id,
      success: function (res) {
        // success
      },
      fail: function () {
        wx.showToast({
          title: '被买走了啊',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //删除
  delItem: function (e) {
    var cartItems = this.data.cartItems //获取购物车列表
    var index = e.currentTarget.dataset.index //获取当前点击事件的下标索引
    cartItems.splice(index, 1)
    this.setData({
      cartItems: cartItems
    });
    if (cartItems.length) {
      this.setData({
        cartList: false
      });
    }
    this.getsumTotal()
    wx.setStorageSync("cartItems", cartItems)
  },
})