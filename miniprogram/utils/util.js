const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const request = url => {
  return new Promise(success => {
    wx.showLoading({
      title: "加载中"
    })
    wx.request({
      url: 'https://www.studyinghome.com/mock/5e60f0ef597ac8103c47608b/chaoliuguan' + url,
      success,
      complate() {
        wx.hideLoading();
      }
    })
  })
}

module.exports = {
  formatTime,
  request
}
