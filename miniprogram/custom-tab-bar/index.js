Component({
  data: {
    active: 0,
    list: [
      {
        icon: '/custom-tab-bar/icon/tabbar-icon-1.jpg',
        text: '首页',
        url: '/pages/home/home'
      },
      {
        icon: '/custom-tab-bar/icon/tabbar-icon-2.jpg',
        text: '分类',
        url: '/pages/classfly/classfly'
      },
      {
        icon: '/custom-tab-bar/icon/tabbar-icon-3.jpg',
        text: "购物车",
        url: "/pages/shoppingCar/shoppingCar"
      },
      {
        icon: '/custom-tab-bar/icon/tabbar-icon-4.jpg',
        text: "我的",
        url: "/pages/about/about"
      }
    ]
  },

  methods: {
    onChange(event) {
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].url
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
});
