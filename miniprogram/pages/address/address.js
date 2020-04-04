// miniprogram/pages/address/address.js
const app = getApp().globalData;
const userInfo = app.userInfo;
const db = wx.cloud.database();
const chaoliuguan = db.collection('chaoliuguan');
const _ = db.command;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: '',
    address: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    chaoliuguan.doc(userInfo._id).field({
      address: true,
      defaultAddress: true
    }).get().then((res) => {
      console.log(res)
      userInfo.address = res.data.address;
      userInfo.defaultAddress = res.data.defaultAddress;
      this.setData({
        address: userInfo.address,
        defaultAddress: userInfo.defaultAddress
      })
      wx.hideLoading()
    })
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
    this.setData({
      address: userInfo.address,
      defaultAddress: userInfo.defaultAddress
    })
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
  
  onChange(event) {
    console.log(event)
    if(event.detail != this.data.radio){
      wx.showLoading({
        title: '请稍等',
      })
      chaoliuguan.doc(userInfo._id).update({
        data: {
          defaultAddress: event.detail
        },
        success:(res) => {
          userInfo.defaultAddress = event.detail
          this.setData({
            defaultAddress: event.detail
          });
          wx.hideLoading();
        }
      })
    }
  },

  editAddress(e) {
    wx.navigateTo({
      url: '../editAddress/editAddress?index=' + e.currentTarget.dataset.index,
    })
  },

  delAddress(e) {
    wx.showLoading({
      title: '请稍等',
    })
    const index = e.currentTarget.dataset.index
    console.log(index == userInfo.defaultAddress);
    if(index == userInfo.defaultAddress){
      chaoliuguan.doc(userInfo._id).update({
        data: {
          defaultAddress: null,
          address: _.pull({index})
        },
        success:(res) => {
          const indexName = userInfo.address.findIndex(item => item.index == index);
          userInfo.address.splice(indexName, 1);
          this.setData({
            address: userInfo.address
          });
          wx.hideLoading();
        }
      })
    }else{
      chaoliuguan.doc(userInfo._id).update({
        data: {
          address: _.pull({index})
        },
        success:(res) => {
          const indexName = userInfo.address.findIndex(item => item.index == index);
          userInfo.address.splice(indexName, 1);
          this.setData({
            address: userInfo.address
          });
          wx.hideLoading();
        }
      })
    }
  },

  addAddress(e) {
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  }
})