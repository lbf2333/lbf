// pages/login/login.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    info: {}
  },

  access: function(res) {
    console.log(res);
    if (!res.detail.userInfo) {
      return;
    }
    app.globalData.userInfo = res.detail.userInfo;
    let info = res.detail
    this.setData({
      info: res.detail
    });
    api.login(this.update, [info]);
  },
  update(info) {
    let that = this;
    api.POST(
      "/user/mp", {
        iv: info.iv,
        encryptedData: info.encryptedData
      },
      res => {
        if (res.code == 1) {
          if (that.data.redirect_url) {
            wx.reLaunch({
              url: that.data.redirect_url
            })
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let url = options.redirect_url ? decodeURIComponent(options.redirect_url) : '';
    console.log(url)
    this.setData({
      redirect_url: url || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})