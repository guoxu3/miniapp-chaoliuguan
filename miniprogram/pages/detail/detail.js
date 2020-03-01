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
      bannerImg: ['https://img.yzcdn.cn/vant/apple-1.jpg'],
      name: '卡西欧',
      price: '3200.00',
      type: {
        color: ['海之蓝', '玫瑰金', '沙滩银', '深空灰', '中国红', '神秘黑', '抹茶绿', '骚粉色'],
        size: [41, 41.5, 42, 43, 44, 45]
      }
    },
    currentColor: '',
    show: false,
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

  showPopup() {
    var data = Data.commodity[0];
    const index = userInfo.shopCart.findIndex(item => item.id == data.id)
    console.log(index)
    const indexName = `shopCart.${index}.num`;
    if (index != -1){
      commodity.doc(userInfo._id).update({
        data: {
          [indexName]: _.inc(1)
        },
        success: function (res) {
          console.log(res)
          userInfo.shopCart[index].num++
        }
      })
    }else{
      commodity.doc(userInfo._id).update({
        data: {
          shopCart: _.push(data)
        },
        success: function (res) {
          userInfo.shopCart.push(data)
        }
      })
    }

    this.setData({ show: true });

  },

  onClose() {
    this.setData({ show: false });
  },

  handleContact(e) {
    console.log(e)
  },

  selected(e) {
    this.setData({
      currentColor: e.currentTarget.dataset.index
    })
  }
})