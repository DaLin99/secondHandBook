
const db = wx.cloud.database()
const todos = db.collection('check-books')

// pages/sao/sao.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      price: "",
      newprice: "",
      wechat: "",
      pubdate: "",
      category: '',
      remark: '',
      gist: '暂无简介',
      img: '../../images/no.jpg',
      looklike:'请选择',
      category:'请选择'
    },
    ca_index: 0,
    categorys: ['请选择', '电气学院', '文传学院', '商学院', '外语学院', '会计学院', '艺创', '医管', '音乐系'],
    categorysObject: [
      {
        id: 0, name: '请选择'
      },
      {
        id: 1, name: '电气学院'
      },
      {
        id: 2, name: '文传学院'
      },
      {
        id: 3, name: '商学院'
      },
      {
        id: 4, name: '外语学院'
      },
      {
        id: 5, name: '会计学院'
      },
      {
        id: 6, name: '艺创'
      },
      {
        id: 7, name: '医管'
      },
      {
        id: 8, name: '音乐系'
      }
    ],
    looklike: ['请选择', '0%-25%', '25%-50%', '50%-75%', '75%-100%'],
    look_index: 0,
    lookObject: [
      {
        id: 0, name: '请选择'
      },
      {
        id: 1, name: '0%-25%'
      },
      {
        id: 2, name: '25%-50%'
      },
      {
        id: 3, name: '50%-75%'
      }, {
        id: 4, name: '75%-100%'
      }
    ]
  }
  ,
  //获取书名
  btitleInput: function (event) {
    this.setData({
      'book.title': event.detail.value
    });
    console.log("你输入的书名:" + event.detail.value)
  },
  //获取书isbn
  bisbnInput: function (event) {
    this.setData({
      'book.isbn': event.detail.value
    });
    console.log("你输入的isbn:" + event.detail.value)
  }
  ,
  //获取书作者
  bauthorInput: function (event) {
    this.setData({
      'book.author': event.detail.value
    });
    console.log("你输入的作者:" + event.detail.value)
  },
  //获取出版社
  publisherInput: function (event) {
    this.setData({
      'book.publisher': event.detail.value
    });
    console.log("你输入的出版社:" + event.detail.value)
  },
  //获取出版时间
  pubdateInput: function (event) {
    this.setData({
      'book.pubdate': event.detail.value
    });
    console.log("你输入的出版日期:" + event.detail.value)
  },

  //获取书的原价
  priceInput: function (event) {
    this.setData({
      'book.price': event.detail.value
    });
    console.log("你输入的原价:" + event.detail.value)
  },

  //获取书的分类
  pickCategroy: function (e) {
    console.log(e)
    var mythis = this //mythis指向函数
    console.log('picker发送选择改变，携带值为', this.data.categorysObject[e.detail.value]);
    this.setData({
      ca_index: e.detail.value,
      'book.category': mythis.data.categorysObject[e.detail.value].name
    });
  },
  //获取新旧情况
  picklook: function (e) {
    //var look_index = this.data.look_index  
    var mythat = this

    console.log('picker发送选择改变，携带值为', this.data.lookObject[e.detail.value]);
    this.setData({
      look_index: e.detail.value,
      'book.looklike': mythat.data.lookObject[e.detail.value].name
    });
    // console.log("书的新旧为："+this.data.book.looklike);
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
    console.log("你输入的wechat:" + event.detail.value);
    console.log("书的wechat:" + this.data.book.wechat)
  }
  ,

  //获取输入的备注：
  remarkInput: function (event) {
    console.log(event)
    this.setData({
      'book.remark': event.detail.value
    });
    console.log("你输入的备注:" + event.detail.value)
  },
  
  //提交表单
  formSubmit: function () {
    var num = /^\d+$|^\d+[.]?\d+$/;
    var wxreg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
   
    var mythis = this;
    mythis.setData({
      'book.img': '../../images/no.jpg'
    })
    console.log(mythis.data.book);

/* if((mythis.data.book.title).trim()==''){
    wx.showToast({
      title: '请输入书名',
      image: '../../images/fail.png',
      duration: 2000
    })
   return
  }
   if ((mythis.data.book.author).trim() == '') {
      wx.showToast({
        title: '请输入作者',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }   

    if ((mythis.data.book.isbn).trim() == '') {
      wx.showToast({
        title: '请输入ISBN',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }

    if (num.test(mythis.data.book.isbn)==false){
      wx.showToast({
        title: '请输入正isbn',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }

    if ((mythis.data.book.publisher).trim() == '') {
      wx.showToast({
        title: '请输入出版社',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }

    if ((mythis.data.book.price).trim() == '') {
      wx.showToast({
        title: '请输入原价',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }

    if (num.test(this.data.book.price) == false) {
      wx.showToast({
        title: '请输入数字',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }



    if (this.data.book.looklike == '请选择' || this.data.book.category == '请选择'){
      console.log(mythis.data.book.looklike)
      
      wx.showToast({
        title: '请认真选择',
        image: '../../images/fail.png',
        duration: 2000
      })
     
      return
    }*/

    if ((mythis.data.book.wechat).trim() == '') {
      wx.showToast({
        title: '请输入微信',
        image: '../../images/fail.png',
        duration: 2000
      })
      return
    }
  

   if(wxreg.test(mythis.data.book.wechat)==false){
     console.log(mythis.data.book.wechat)
     wx.showToast({
       title: '请输入正微信',   
       image: '../../images/fail.png',
       duration: 2000
     })
     return
   }



      console.log("ok");}
    /* db.collection('check').add({
        // data 字段表示需新增的 JSON 数据
        data: mythis.data.book
      })
        .then(res => {
          console.log(res);
          console.log("添加入数据库成功");
          wx.switchTab({
            url: '../scanCode/scanCode',
          })
          wx.showToast({
            title: '管理员火速审核中',
            icon: 'success',
            duration: 2000
          })
        })
    }
   /* */
  
}
)