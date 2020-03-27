// miniprogram/pages/editAddress/editAddress.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import area from '../../data/area.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: area,
    onoff: false,
    region: [{ name: '请选择' }],
    addressDetail: ''
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

  onoff() {
    this.setData({
      onoff: true
    })
  },

  onClose() {
    this.setData({ onoff: false });
  },

  onConfirm(event) {
    console.log(event)
    this.setData({
      onoff: false,
      region: event.detail.values
    })
  },

  onCancel() {
    this.setData({
      onoff: false
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  saveAddress: function (e) {
    wx.navigateBack({
      delta: 1,
    })
  },
  test() {
    // wx.getLocation({
    //   success: function (res) {
    //     console.log(res)
    //     wx.request({
    //       url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=WJDBZ-Y4MLD-KHN4B-HYNGP-QC4RH-UOFHJ&location=' + res.latitude + ',' + res.longitude,
    //       success(res){
    //         console.log(res)
    //       }
    //     })
    //   },
    // })
    wx.chooseLocation({
      success: res => {
        console.log(res);
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=WJDBZ-Y4MLD-KHN4B-HYNGP-QC4RH-UOFHJ&location=' + res.latitude + ',' + res.longitude,
          success: res => {
            console.log(res);
            const city_code = res.data.result.ad_info.city_code.substr(3, 6);
            const province_code = res.data.result.ad_info.adcode.substr(0, 3) + "000"
            console.log(province_code);
            this.setData({
              region: [{
                code: province_code,
                name: res.data.result.ad_info.province
              }, {
                code: city_code,
                name: res.data.result.ad_info.city
              }, {
                code: res.data.result.ad_info.adcode,
                name: res.data.result.ad_info.district
              }],
              addressDetail: res.data.result.address
            })
          }
        })
      },
    })
  }
})