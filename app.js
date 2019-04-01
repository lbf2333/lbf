//app.js
App({
  onLaunch: function() {
  },
  onShow: function(path) {
    console.log(path);
    // 如果是通过其他路径进来小程序的，判断是否有token,如果没有就先跳去登录再跳回来
    var that = this;
    let query = '';
    let redirect_url = '';
    let word = ''
    for (let i in path.query) {
      if (i) {
        query = query + word + i + '=' + path.query[i]
        word = '&'
      }
    }
    if (query) {
      redirect_url = path.path + '?' + query;
    } else {
      redirect_url = path.path
    } 
    console.log(redirect_url);
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({
        url: '/pages/login/login?redirect_url=' + encodeURIComponent(`/${redirect_url}`)
      })
    }
  },
  globalData: {
    userInfo: null
  }
})