// pages/show/show.js
const CryptoJS = require("./crypto-js.js");
const querystring = require('./querystring.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn13: "show初始化",
    book: {
      images_medium: "",
      title: "show显示页面初始化的数据",
      author: "show显示页面初始化的数据",
      isbn13: "show显示页面初始化的数据",
      publisher: "show显示页面初始化的数据",
      price: "show显示页面初始化的数据",
      newprice: "show显示页面初始化的数据",
      tell: "show显示页面初始化的数据",
    }

  },

  myscanCode: function () {
    var mythis = this
    barCode: true;
    onlyFromCamera: false
    wx.scanCode({
      success: function (res) {
        //扫码成功    
        console.log('扫码的ISBN结果：' + res.result);
        mythis.setData({
          isbn13: res.result
        });
        //通过腾讯云获取数据
        // 云市场分配的密钥Id
        var secretId = "AKID4E20kx9Td28ZOFQ902bBE4M8rgz9YAxdilCm";
        // 云市场分配的密钥Key
        var secretKey = "kptAcHIxg1JTyK0tb0Uq86e3FD8fDLJRKjB0pGnY";
        var source = "market";

        // 签名
        var datetime = (new Date()).toGMTString();
        var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
        var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
        var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';

        // 请求方法
        var method = 'GET';
        // 请求头
        var headers = {
          "X-Source": source,
          "X-Date": datetime,
          "Authorization": auth,
        }
        // 查询参数
        var queryParams = {
          'isbn': res.result
        }
        // body参数（POST方法下）
        var bodyParams = {}
        // url参数拼接
        var url = 'https://service-osj3eufj-1255468759.ap-shanghai.apigateway.myqcloud.com/release/isbn';
        if (Object.keys(queryParams).length > 0) {
          url += '?' + querystring.stringify(queryParams);
        }

        var options = {
          url: url,
          timeout: 5000,
          method: method,
          header: headers
        }
        if (['POST', 'PUT', 'PATCH'].indexOf(method) != -1) {
          options['body'] = querystring.stringify(bodyParams);
          options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
        }
        //加载提示
        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        //请求数据
        wx.request({
          ...options,
          data: {
            isbn: res.result
          },
          success(res) {
            //请求成功
            console.log("成功请求之后返回的res:" + res)
            console.log("请求到的res.data.showapi_res_body.remark" + res.data.showapi_res_body.remark)
            if (res.data.showapi_res_body.remark == 'ok' || res.data.showapi_res_body.remark == 'success') {
              wx.setStorage({
                key: 'scanBook',
                data: res.data.showapi_res_body,
                success: function (res) {
                  console.log("缓存到scanBook" + res);
                  //缓存加载提示
                  wx.showLoading({
                    title: '加载中',
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 500)
                  //跳转到显示扫码书信息的页面
                  wx.navigateTo({
                    url: '/pages/disScaBInf/disScaBInf',
                    success: function (res) {
                      console.log("缓存之后跳转到显示扫码书信息的页面了")
                    },
                    fail: function (err) {
                      console.log(err)
                    },
                  })
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            } else {
              console.log("请求失败通过腾讯云获取的" + JSON.stringify(res.data.showapi_res_body));
              setTimeout(function () {
                wx.showToast({
                  title: '请手动输入',
                  icon: 'none',
                  duration: 1500
                })
              }, 1000)
              wx.navigateTo({
                url: '/pages/input/input',
              })
            }
          },
          fail: function (err) {
            setTimeout(function () {
              wx.showToast({
                title: '获取腾讯云失败',
                icon: 'none',
                duration: 2500
              })
            }, 2000)
            wx.navigateTo({
              url: '/pages/input/input',
            })
          }
        })
      },
      fail(err) {
        //扫码失败+取消扫码
        console.log(err)
        setTimeout(function () {
          this.myscanCode();
          wx.showToast({
            title: '请重新扫码',
            icon: 'none',
            duration: 2500
          })
        }, 1000)
      }
    })
  }
})