const db = wx.cloud.database();
Page({
  data: {
    book: {
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      pubdate: '',
      price: '',
      newprice: '',
      gist: '',
      looklike: '',
      wechat: '',
      remark: '',
      category: '',
      reason:'',
      
    },
    disabled:false,
    id: '',
    isNone:true,
    noCheck:true,
   reasons: ['请选择', '你信息填写不正确哦', '你填写了虚假信息', '其他'],
   reason_index: 0,
 reasonObject: [{
      id: 0,
      name: '请选择'
    },
    {
      id: 1,
      name: '你信息填写不正确哦'
    },
    {
      id: 2,
      name: '你填写了虚假信息'
    },
    {
      id: 3,
      name: '其他'
    }
    ]
  },








  onLoad: function (options) {
    // 生命周期函数--监听页面加载

    console.log("options.id:" + options.id);
    db.collection('check').doc(options.id).get({
      success: res => {
        console.log(res.data);
        this.setData({
          'book.img': res.data.img,
          'book.isbn': res.data.isbn,
          'book.title': res.data.title,
          'book.author': res.data.author,
          'book.publisher': res.data.publisher,
          'book.pubdate': res.data.pubdate,
          'book.price': res.data.price,
          'book.newprice': res.data.newprice,
          'book.gist': res.data.gist,
          'book.looklike': res.data.looklike,
          'book.wechat': res.data.wechat,
          'book.remark': res.data.remark,
          'book.category': res.data.category,
          'book._id':res.data._id,
          id:res.data._id,
         
        })
        if (this.data.book.pubdate == '') {
          this.setData({
            isPbd: false
          })
        }else{
          this.setData({
            isPbd:true
          })
        }
        console.log(this.data.book);
        if(this.data.book.gist=''){
          this.setData({
            isNone:true
          })
        }else{
          this.setData({
            isNone:false
          })
        }
      },
     
      fail: err => {
        console.log(err)
      }
    })
  },

 


  //发布
  toSell: function (e) {
    //console.log(e);
    //加入mybook数据库
    console.log("toSell");
    db.collection('mybook').add({
      data: this.data.book,
      success(res) {
        console.log("加入mybook数据库" + res);
        wx.showToast({
          title: '添加mybook',
          icon: 'success',
          duration: 4000
        })
        wx: wx.navigateTo({
          url: '../administrator/administrator',
        })
      },
      fail(err) {
        console.log(err);
      }
    });
      //从check删除
    db.collection('check').doc(this.data.book._id).remove({ 
      success(res){
        console.log("check删除" + res);
        wx.showToast({
          title: 'check删除',
          icon: 'success',
          duration: 4000
        })
      },
      fail(err){
        console.log(err)
      }
    })

  },

  //1.不发布按钮，
  displayReason: function (e) {
    var mythis = this
    console.log(e)
    mythis.setData({
      reason:true
    })  }
,

  //获取不通过的原因
  pickreascon: function (e) {
    console.log(e)
    var mythis = this //mythis指向函数
    console.log('picker发送选择改变，携带值为', mythis.data.reasonObject[e.detail.value]);

    this.setData({
      reason_index: e.detail.value,
      'book.reason': mythis.data.reasonObject[e.detail.value].name
    });
  },

//确认不通过
  noSell:function(e){
    console.log(e)
    console.log(this.data.book.reason)
    if(this.data.book.reason==''){
      wx.showToast({
        title: '请选择原因',
        image: '../../images/fail.png',
        duration: 2000
      })
    }else{

      //加入noSell数据库
      db.collection('noSell').add({
        data: this.data.book,
        success(res) {
          console.log("加入noSell数据库" + res);
          wx.showToast({
            title: '添加nosell',
            icon: 'success',
            duration: 4000
          })
        },
        
      });
      this.setData({
        disabled: true
      });

      //从check删除
      let that = this;
      let _id = e.currentTarget.dataset.id;
      console.log(_id)
      console.log(that.data.book._id)
      wx.showModal({
        title: "确定要删除该信息吗",
        confirmColor: '#27C79A',
        success: res => {
          if (res.confirm) {
            setTimeout(function () {
              wx.cloud.callFunction({
                name: 'maneger',
                data: {
                  type: "DeteleItem",
                  data: {
                    _id: that.data.book._id
                  },
                },
                success: res => {
                  console.log(res);
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (res) {
                      setTimeout(function () {
                        
                      }, 1000)
                    }
                  });
                  wx.navigateTo({
                    url: '/pages/administrator/administrator',
                  })

                },
                fail: err => {
                  console.log(err);
                }
              })
            }, 1500)
          }
        }
      }) 

    }
     
  },




})