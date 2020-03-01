// pages/shoppingCar/shoppingCar.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

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
    checked: false,
    result: [],
    commodity: [],
    total: 0
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
    this.getTabBar().init();
    chaoliuguan.doc(userInfo._id).field({
      shopCart: true
    }).get().then(res => {
      console.log(res)
      userInfo.shopCart = res.data.shopCart;
      this.data.commodity = userInfo.shopCart
      this.setData({
        commodity: this.data.commodity
      })
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

  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          instance.close();
          let id = event.detail.name;

          Toast.loading('删除中');
          chaoliuguan.doc(userInfo._id).update({
            data: {
              shopCart: _.pull({ id })
            },
            success: res => {
              const index = this.data.commodity.findIndex(item => item.id == id);
              this.data.commodity.splice(index, 1);
              console.log(index)

              const indexR = this.data.result.findIndex(item => item == id);
              this.data.result.splice(indexR, 1);
              console.log(indexR)

              if (this.data.result.length == this.data.commodity.length && this.data.commodity.length !== 0) {
                this.data.checked = true;
              } else {
                this.data.checked = false;
              }

              this.setData({
                commodity: this.data.commodity
              })
              this.setData({
                result: this.data.result,
                checked: this.data.checked
              })
              Toast.success('删除成功');
              this.total()
            }
          })
        }).catch(() => {
          instance.close();
        });
        break;
    }
  },

  // 当数量值改变时调用的函数
  onChange(event) {
    var currentTarget = this.data.commodity.find(item => event.currentTarget.id == item.id);
    currentTarget.num = event.detail;
    this.total();//计算价格总数
  },

  // 全选函数
  all_onChange(event) {
    let result = []; // 先定义一个空的数组用来装选中的复选框的name
    if (event.detail) { // 判断全选按钮是否勾上 如果勾上了就
      let commodity = this.data.commodity; //定义一个变量装当前购物车中的商品
      for (let index in commodity) { // 循环为result数组加入名字，让他们有名字的都被选中
        result.push(commodity[index].id);
      }
    }
    this.setData({ // 最后渲染到界面上
      checked: event.detail,  // 全选按钮状态
      result: result, // 商品按钮状态
    });
    this.total(); // 渲染后计算总价格
  },

  // 单个选中按钮
  check_onChange(event) {
    if (event.detail.length == this.data.commodity.length) { // 判断选中的个数，如果选中的个数和购物车商品的数量相等就让全选按钮为选中状
      this.data.checked = true;
    } else { // 否则全选按钮为不选中状态
      this.data.checked = false;
    }
    this.setData({ // 当触发时渲染此函数，选中他的选定状态
      result: event.detail, // 重新渲染数组，决定哪些商品是被选中的
      checked: this.data.checked
    });
    this.total(); // 计算总价
  },

  // 计算价格总数的函数
  total() {
    let total = 0; // 先让价格总数归零，好重新进行计算
    for (let index in this.data.result) { // 循环选中的个数
      for (let j in this.data.commodity) { // 再循环选中个数的商品
        if (this.data.result[index] == this.data.commodity[j].id) { // 判断选中的商品是哪些，把他们的价格总和加起来
          console.log(this.data.commodity[j])
          total += this.data.commodity[j].price * this.data.commodity[j].num;
        }
      }
    }
    this.setData({ // 渲染总价格
      total: total
    })
  }
})