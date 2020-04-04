// pages/about/about.js
const app = getApp().globalData;
const db = wx.cloud.database();
const user = db.collection('chaoliuguan');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: '',
    nickName: '未登录',
    disabled: true,
    logged: app.logged
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
    wx.showLoading({
      title: '请稍等',
    });
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      user.where({
        _openid: res.result.openid
      }).get().then(res => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          app.logged = true;
          app.updated = true;
          this.setData({
            userAvatar: app.userInfo.userAvatar,
            nickName: app.userInfo.nickName,
            disabled: false,
            logged: app.logged
          })
          wx.hideLoading();
          wx.showToast({
            title: '登陆成功',
          });
        } else {
          this.setData({
            disabled: false
          })
          wx.hideLoading();
          wx.showToast({
            title: '请先进行登陆',
          });
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    this.setData({
      userAvatar: app.userInfo.userAvatar,
      nickName: app.userInfo.nickName
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

  feedback: function(){
    
  },

  getUserInfo: function (e) {
    wx.showLoading({
      title: '登陆中',
    });
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      user.where({
        _openid: res.result.openid
      }).get().then(res => {
        if(res.data.length){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          app.logged = true;
          app.updated = true;
          this.setData({
            userAvatar: app.userInfo.userAvatar,
            nickName: app.userInfo.nickName,
            disabled: false,
            logged: app.logged
          })
          wx.hideLoading();
          wx.showToast({
            title: '登陆成功',
          });
        }else{
          const userInfo = e.detail.userInfo;
          if (!app.logged && userInfo) {
            user.add({
              data: {
                userAvatar: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                shopCart: [],
                address: [],
                time: new Date()
              }
            }).then(res => {
              user.doc(res._id).get().then(res => {
                app.userInfo = Object.assign(app.userInfo, res.data);
                app.logged = true;
                app.updated = true;
                this.setData({
                  userAvatar: app.userInfo.userAvatar,
                  nickName: app.userInfo.nickName,
                  disabled: false,
                  logged: app.logged
                })
                wx.hideLoading();
                wx.showToast({
                  title: '登陆成功',
                });
              })
            })
          }
        }
      })
    })
  }
})