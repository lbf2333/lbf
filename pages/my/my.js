// pages/my/my.js
const app = getApp();
import api from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:"/images/img-example.jpg",
    hidden: true  ,
    myinfo:[],
  },
  // 点击进入修改
  chooseimage: function (e) {
    wx.navigateTo({
      url: '../my/edit/edit'
    })
  },
  // 查看我的收藏
  goCollection: function (e) {
    var count = e.currentTarget.dataset.count
    wx.navigateTo({
      url: '../collection/collection?count=' + count,
    })
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    })
  },
  //查看地址信息
  goAddress: function (e) {
    if (this.data.myinfo.addressCount == 0){
      wx.navigateTo({
        url: '../addressManagement/addressManagement',
      })
    }else {
      wx.navigateTo({
        url: '../addressInformation/addressInformation',
      })
      wx.showLoading({
        title: '加载中...',
        icon: 'loading'
      })
    }
    
  },
  // 查看我的订阅
  goSubscribeing:function(e){
    var currenttab = 0;
    wx.navigateTo({
      url: '../subscribe/subscribe?id=' + currenttab,
    })
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    })
  },
  // 查看我的订阅
  goSubscribesuccess: function (e) {
    var currenttab = 1
    wx.navigateTo({
      url: '../subscribe/subscribe?id=' + currenttab,
    })
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
    let that = this;
    api.GET(
      "/user/me", {
      },
      res => {
        console.log(res);
        that.setData({
          myinfo: res.params.myinfo,
        })
        console.log(that)
      }
    )
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

  }
})