// pages/try/try.js

const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch: false,
    search: '',
    search_list: '',
    page: 0,
    btn: 0
  },

  onShow: function() {

  },

  //获取输入的wechatInput
  onBindconfirm: function(event) {
    console.log(event)
    this.setData({
      search: event.detail.value,
      search_list: '',
      isSearch: true,
      page: 0
    })
    console.log("你输入的内容是" + this.data.search);
    if ((this.data.search).trim() == '') {
      console.log("你输入的是空呐")
      wx.showToast({
          title: '请输入内容啦',
          icon: 'none',
          duration: 2000
        }),
        this.setData({
          isSearch: false,

        })
    } else {
      db.collection('mybook').where(_.or([{
          title: db.RegExp({
            regexp: '.*' + this.data.search,
            options: 'i'
          })
        },
        {
          author: db.RegExp({
            regexp: this.data.search,
            options: 'i'
          })
        },
        {
          category: db.RegExp({
            regexp: this.data.search,
            options: 'i'
          })
        }
      ])).get({
        success: res => {
          console.log(res.data)
          if (res.data != '') {
            this.setData({
              search_list: res.data,
              btn: 1
            })
          } else {
            setTimeout(function() {
              wx.showToast({
                title: '对不起，没找你想要的商品',
                icon: 'none',
                duration: 2500
              })
            }, 500)
          }
        },
        fail: function() {
          setTimeout(function() {
            wx.showToast({
              title: '对不起，没找你想要的商品',
              icon: 'none',
              duration: 2500
            })
          }, 1000)
        }
      })
    }
  },
  //加载数据
  onReachBottom() {

    let page = this.data.page + 20
    db.collection('mybook').where(_.or([{
        title: db.RegExp({
          regexp: '.*' + this.data.search,
          options: 'i'
        })
      },
      {
        author: db.RegExp({
          regexp: '.*' + this.data.search,
          options: 'i'
        })
      },
      {
        category: db.RegExp({
          regexp: '.*' + this.data.search,
          options: 'i'
        })
      }
    ])).skip(page).get().then(res => {
      let new_data = res.data
      let old_data = this.data.search_list
      console.log("000新数据：" + new_data)
      console.log("000老数据：" + old_data)
      this.setData({
        search_list: old_data.concat(new_data),
        page: page,
      })
    })

  },

  //点击查看按钮，显示书的详情
  viemItem: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
  }
})