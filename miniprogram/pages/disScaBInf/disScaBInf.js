// pages/disScaBInf/disScaBInf.js
const db = wx.cloud.database()
const todos = db.collection('check-books')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
      img: "",
      title: "display显示页面初始化的数据",
      author: "display显示页面初始化的数据",
      isbn: "display显示页面初始化的数据",
      publisher: "显示页面初始化的数据",
      price: "显示页面初始化的数据",
      newprice: "31",
      wechat: "",
      remark: "",
      category: "请选择",
      looklike: "请选择",
      openid: "",
      pubdate: '',

    },
    isdisable: false,
    isgist:true,
    ispubdate:false,
    isNone: true,
    ca_index: 0,
    categorys: ['请选择', '电气学院', '文传学院', '商学院', '外语学院', '会计学院', '艺创', '医管', '音乐系'],
    categorysObject: [{
      id: 0,
      name: '请选择'
    },
    {
      id: 1,
      name: '电气学院'
    },
    {
      id: 2,
      name: '文传学院'
    },
    {
      id: 3,
      name: '商学院'
    },
    {
      id: 4,
      name: '外语学院'
    },
    {
      id: 5,
      name: '会计学院'
    },
    {
      id: 6,
      name: '艺创'
    },
    {
      id: 7,
      name: '医管'
    },
    {
      id: 8,
      name: '音乐系'
    }
    ],
    looklike: ['请选择', '0%-25%', '25%-50%', '50%-75%', '75%-100%'],
    look_index: 0,
    lookObject: [{
      id: 0,
      name: '请选择'
    },
    {
      id: 1,
      name: '0%-25%'
    },
    {
      id: 2,
      name: '25%-50%'
    },
    {
      id: 3,
      name: '50%-75%'
    }, {
      id: 4,
      name: '75%-100%'
    }
    ]
  },


  //获取书的分类
  pickCategroy: function (e) {
    console.log(e)
    var mythis = this //mythis指向函数
    console.log('picker发送选择改变，携带值为', this.data.categorysObject[e.detail.value]);
    this.setData({
      ca_index: e.detail.value,
      'book.category': this.data.categorysObject[e.detail.value].name
    });

  },

  //获取新旧情况
  picklook: function (e) {
    //var look_index = this.data.look_index  
    var mythat = this
    this.setData({
      look_index: e.detail.value,
      'book.looklike': mythat.data.lookObject[e.detail.value].name
    });
    console.log('picker发送选择改变，携带值为', this.data.lookObject[e.detail.value]);
  },

  //获取用户输入步进器的值：
  newpriceInput: function (event) {
    this.setData({
      'book.newprice': event.detail,
    })
    console.log("你输入的出价:" + event.detail)
  },

  //获取输入的wechatInput
  wechatInput: function (event) {
    this.setData({
      'book.wechat': event.detail.value
    });
    console.log("你输入的wechat:" + event.detail.value)
  },

  //获取输入的备注：
  remarkInput: function (event) {
    this.setData({
      'book.remark': event.detail.value
    });
    console.log("你输入的备注:" + event.detail.value)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取扫码书信息缓存的数据
    var mythat = this;
    //缓存加载提示
    wx.showLoading({
      title: '加载中',
    })
   
    wx.getStorage({
      key: 'scanBook',
      success: function (res) {
        console.log("读取数据JSON.stringify(res.data.data):" + JSON.stringify(res.data.data));
        mythat.setData({
          'book.img': res.data.data.img,
          'book.title': res.data.data.title,
          'book.author': res.data.data.author,
          'book.publisher': res.data.data.publisher,
          'book.price': res.data.data.price,
          'book.gist': res.data.data.gist,
          'book.pubdate': res.data.data.pubdate,
          'book.isbn': res.data.data.isbn,

        });

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)

        //简介有无
        if (mythat.data.book.pubdate == '') {
          mythat.setData({
            ispubdate: false
          })
        } else {
          mythat.setData({
            ispubdate: true
          })
        }


        //简介有无
        if (mythat.data.book.gist == '') {
          mythat.setData({
            isgist: false
          })
        } else {
          mythat.setData({
            isgist: true
          })
        }
       
        
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },





  formSubmit: function (e) {
    let re = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
    console.log(this.data.book)
    if (this.data.book.category == '请选择' || this.data.book.looklike == '请选择') {
      wx.showToast({
        title: '请认真选择',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }

    if(this.data.book.wechat.trim()==''){
      wx.showToast({
        title: '请输入你的微信',
        image:'../../images/fail.png',
        duration:2000
      })
      return
    }

    if (re.test(this.data.book.wechat) == false) {
      console.log(this.data.book.wechat)
      wx.showToast({
        title: "请输入真实微信号！",
        icon: "none",
        duration: 1500
      })
      return
    }
 
      console.log("点击按钮时:" + JSON.stringify(this.data.book))
      db.collection('check').add({
        // data 字段表示需新增的 JSON 数据
        data: this.data.book
      })
        .then(res => {
          console.log("加入checks数据库" + res);
          console.log("表单上传");
          wx.showToast({
            title: '管理员火速审核',
            icon: 'success',
            duration: 2000
          });
        })
        this.setData({
          isdisable:true
        })
    }





    // console.log("点击按钮时价格:" + JSON.stringify(this.data.book));


})