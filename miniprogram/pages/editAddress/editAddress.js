// miniprogram/pages/editAddress/editAddress.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import area from '../../data/area.js';
const app = getApp().globalData;
const userInfo = app.userInfo;
const db = wx.cloud.database();
const commodity = db.collection('chaoliuguan');
const _ = db.command;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: area,
    alt: true,
    onoff: false,
    type: '',
    address: {
      name: '',
      phone: '',
      region: [],
      dtaddress: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.hasOwnProperty('index');
    if(this.data.type) {
      this.setData({
        address: userInfo.address.find(item => item.index == options.index)
      })
    }
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

  onBlur(e) {
    this.data.address[e.currentTarget.dataset.item] = e.detail.value
    console.log(this.data.address[e.currentTarget.dataset.item])
  },

  onoff() {
    this.setData({
      onoff: true
    })
  },

  onClose() {
    this.setData({
      onoff: false
    });
  },

  onConfirm(event) {
    console.log(event)
    this.setData({
      onoff: false,
      ["address.region"]: event.detail.values
    })
  },

  onCancel() {
    this.setData({
      onoff: false
    })
  },

  saveAddress: function (e) {
    this.data.alt = true;
    for (let item in this.data.address) {
      console.log(this.data.address[item])
      if (this.data.address[item] == false) {
        this.data.alt = false;
        break;
      }
    }

    if (this.data.alt) {
      if (this.data.type) {
        const index = userInfo.address.findIndex(item => this.data.address.index == item.index);
        const indexName = `address.${index}`;
        commodity.doc(userInfo._id).update({
          data: {
            [indexName]:  this.data.address
          },
          success: res => {
            userInfo.address[index] = this.data.address
            wx.showToast({
              title: '保存成功',
              success() {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1500);
              }
            });
          }
        })
      } else {
        this.data.address.index = Date.parse(new Date());
        commodity.doc(userInfo._id).update({
          data: {
            address: _.push(this.data.address)
          },
          success: res => {
            userInfo.address.push(this.data.address);
            wx.showToast({
              title: '保存成功',
              success() {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1500);
              }
            });
          }
        })
      }
    } else {
      wx.showToast({
        title: '请填写完整',
      });
    }

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
              ["address.region"]: [{
                code: province_code,
                name: res.data.result.ad_info.province
              }, {
                code: city_code,
                name: res.data.result.ad_info.city
              }, {
                code: res.data.result.ad_info.adcode,
                name: res.data.result.ad_info.district
              }],
              ["address.dtaddress"]: res.data.result.address
            })
          }
        })
      },
    })
  }
})