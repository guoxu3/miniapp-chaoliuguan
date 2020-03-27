// pages/detail/detail.js

import Data from '../../data/commodity.js';
const db = wx.cloud.database();
const commodity = db.collection('chaoliuguan');
const app = getApp().globalData;
const userInfo = app.userInfo;
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodity: {
      bannerImg: ["https://hbimg.huabanimg.com/4fb2e1e5cf9378f4d52342ec92c7b24a2d9b81574b914-0ak97R_fw658", "https://hbimg.huabanimg.com/28a98d6a86fddcd32f2ad7fddf1f734c7fdaecf74da08-edPjFU_fw658", "https://hbimg.huabanimg.com/191b71377e248baa8130f8d4d7f5913701e2a3a847655-bIUeUB_fw658", "https://hbimg.huabanimg.com/e87f13224525350e1ea1ce1aeeebfd7629dd3843551b4-0MSG1w_fw658", "https://hbimg.huabanimg.com/c281ae1994c9888e8bba8f9402e877cc83dc2ac17b10d-R0fiYt_fw658"],
      name: 'Vans Old Skool Black 黑白休闲板鞋 VN000D3HY28',
      type: [{
        size: 34.5,
        price: 459
      }, {
        size: 35,
        price: 409
      }, {
        size: 36,
        price: 409
      }, {
        size: 36.5,
        price: 429
      }, {
        size: 37,
        price: 419
      }, {
        size: 38,
        price: 439
      }, {
        size: 38.5,
        price: 439
      }, {
        size: 39,
        price: 419
      }, {
        size: 40,
        price: 419
      }, {
        size: 40.5,
        price: 419
      }, {
        size: 41,
        price: 409
      }, {
        size: 42,
        price: 419
      }, {
        size: 42.5,
        price: 429
      }, {
        size: 43,
        price: 429
      }, {
        size: 44,
        price: 439
      }, {
        size: 44.5,
        price: 489
      }, {
        size: 45,
        price: 499
      }, {
        size: 46,
        price: '--'
      }]
    },
    currentPrice: 439,
    currentSize: 0,
    currentColor: -1,
    price: 439,
    size: 0,
    color: -1,
    show: false,
    infoNum: 0,
    btnType: '',
    posTop: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.logged) {
      this.setData({
        infoNum: userInfo.shopCart.length
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  currentAttr() {
    this.setData({
      show: true,
      price: this.data.currentPrice,
      size: this.data.currentSize,
      color: this.data.currentColor,
    });
    setTimeout(res => {
        this.setData({ posTop: 0 })
    },50)
  },

  chageCurrentAttr() {
    this.setData({
      show: false,
      currentSize: this.data.size,
      currentColor: this.data.color,
      currentPrice: this.data.price
    })
  },

  showPopup() {
    this.data.btnType = 'select';
    this.currentAttr();
  },

  onClose() {

    this.setData({ show: false });
  },

  onJoin() {
    this.data.btnType = 'join'
    if (this.data.currentSize) {
      this.onSubmit()
    } else {
      this.currentAttr();
    }
  },

  onBuy() {
    this.data.btnType = 'buy'
    if (this.data.currentSize) {
      this.onSubmit()
    } else {
      this.currentAttr();
    }
  },

  onSubmit() {
    var data = Data.commodity[0];
    if (app.logged) {
      switch (this.data.btnType) {
        case 'join':
          if (this.data.size) {
            wx.showLoading();
            const index = userInfo.shopCart.findIndex(item => item.id == data.id)
            const indexName = `shopCart.${index}.num`;
            if (index != -1) {
              commodity.doc(userInfo._id).update({
                data: {
                  [indexName]: _.inc(1)
                },
                success: res => {
                  userInfo.shopCart[index].num++;
                  app.updated = true;
                  wx.showToast({
                    title: '添加成功',
                  });
                  this.chageCurrentAttr()
                }
              })
            } else {
              commodity.doc(userInfo._id).update({
                data: {
                  shopCart: _.push(data)
                },
                success: res => {
                  userInfo.shopCart.push(data);
                  app.updated = true;
                  wx.showToast({
                    title: '添加成功',
                  });
                  this.setData({ infoNum: userInfo.shopCart.length });
                  this.chageCurrentAttr();
                }
              })
            }
          } else {
            wx.showToast({
              title: '请选择尺码',
            })
          }
          break;
        case 'buy':
          if (this.data.size) {
            this.chageCurrentAttr();
            wx.showToast({
              title: '购买成功',
            })
          } else {
            wx.showToast({
              title: '请选择尺码',
            })
          }
          break;
        case 'select':
          this.chageCurrentAttr();
          break;
      }
    } else {
      wx.showToast({
        title: '请先登陆',
      })
      this.setData({ show: false });
    }
  },

  handleContact(e) {
    console.log(e)
  },

  selected(e) {
    if (e.currentTarget.dataset.index === this.data.color) {
      this.data.color = -1;
      this.data.price = 439;
      this.data.size = 0;
    } else {
      this.data.color = e.currentTarget.dataset.index;
      this.data.price = this.data.commodity.type[this.data.color].price;
      this.data.size = this.data.commodity.type[this.data.color].size;
    }
    this.setData({
      color: this.data.color,
      price: this.data.price,
      size: this.data.size
    })
  }
})