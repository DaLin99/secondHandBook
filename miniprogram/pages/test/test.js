// pages/scanCode/scanCode.js
//云数据库初始化
const db = wx.cloud.database()
const todos = db.collection('mybook');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cantainShow: true,
    searchContian: false,
    inputShowed: false,
    inputVal: "",
    inputValue: '',
    isNone: false,
    book_list: [],
    search: "全部",
    showLoading: true,
    catagroys: [],
    page: 0,
    currentIndexNav: 0, //导航索引
    navList: ['全部', '电气学院', '文传学院', '商学院', '外语学院', '会计学院', '艺创', '医管', '音乐系']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载提示
    wx.showLoading({
      title: '加载中',
    })

    //读取mybook数据库
    db.collection('mybook').get({
      success: res => {
        //  console.log("mybook数据"+JSON.stringify(res.data));
        this.setData({
          book_list: res.data
        })
      }
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  //根据按钮分类查找
  select_category: function (event) {
    var that = this
    console.log(event)

    var category = event.currentTarget.dataset.value
    var current_index = event.currentTarget.dataset.index

    console.log("单击按钮是：" + category);
    console.log("单击按钮的index是：" + current_index);

    that.setData({
      currentIndexNav: current_index,  //为了点击按钮变化颜色的
      search: category
    })
    console.log(this.data.currentIndexNav);//为了点击按钮变化颜色的

    if (category == '全部') {
      //读取mybook数据库
      db.collection('mybook').get({
        success: res => {
          //  console.log("mybook数据"+JSON.stringify(res.data));
          that.setData({
            book_list: res.data
          })
        }
      });
    } else {
      db.collection('mybook').where({
        category: category
      })
        .get({
          success(res) {
            that.setData({
              book_list: res.data
            })
            if (res.data.length == 0) {
              that.setData({
                isNone: true
              })
            } else {
              that.setData({
                isNone: false
              })
            }
          }
        })
    }
  }
  ,
  //点击查看按钮，显示书的详情
  viemItem: function (event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    //加载提示
    wx.showLoading({
      title: '加载中'
    })
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var mythis = this;
    console.log("search:" + this.data.search)
    let search = this.data.search
    console.log("刷新了" + search)

    if (search == '全部') {
      db.collection('mybook')
        .get({
          success(res) {
            console.log("刷新的数据：" + res.data);
            mythis.setData({
              book_list: res.data
            })
            console.log("刷新的booklist：" + mythis.data.book_list);
          }
        })
    } 
    else {
      var mythis = this;
      console.log("执行了else")
      db.collection('mybook').where({
        category: this.data.search
      })
        .get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log("执行了更新其他数据" + res.data)
            mythis.setData({
              book_list: res.data
            })
          },
          fail(err) {
            console.log(err)
          }
        })
    }
    wx.stopPullDownRefresh();
  },

  //底部加载
  onReachBottom() {
    console.log("触底！");
    let search = this.data.search
    console.log("按钮：" + search)

    //按钮点击的是"全部""
    if (search == '全部') {
      let page = this.data.page + 20
      db.collection('mybook').skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.book_list
        console.log("下拉新数据：" + new_data)
        console.log("下拉老数据：" + old_data)
        this.setData({
          book_list: old_data.concat(new_data),
          page: page,
        })
      })
    } else {
      this.setData({
        page: 0
      })
      let page = this.data.page + 20
      console.log("执行了else")
      db.collection('mybook').where({
        category: search
      }).skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.book_list
        console.log("下拉新数据：" + new_data)
        console.log("下拉老数据：" + old_data)
        this.setData({
          book_list: old_data.concat(new_data),
          page: page
        }, res => {
          console.log("根据分类" + search + "加载100条");
          console.log("this.data.search:" + this.data.search);
        })
      })
    }
  },


  //点击搜索框跳转搜索页面
  navToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
      success: function (res) {
        console.log("跳转成功到搜索页面")
      },
      fail: function (err) {
        console.log("跳转搜索页面失败" + err)
      }
    })
  }
})