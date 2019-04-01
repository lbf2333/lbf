// pages/subscribe/subscribe.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    magazineData:[
    ],
    address:[],
    total:'',
    nextTimes:'',
    subscribeId:0
  },
  goEvaluation: function (e) {

    wx.navigateTo({
      url: '../evaluation/evaluation?id=' + this.data.subscribeId + '&evaluationData=' + JSON.stringify(this.data.magazineData)
    })
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    })
  },
  goAddress: function (e) {
    wx.navigateTo({
      url: '../modify/modify?orderNo=' + this.data.magazineData.address.orderNo 
    })
  },
  goRecord : function(e) {
    let sendrecordData = JSON.stringify( this.data.magazineData)
    wx.navigateTo({
      url: '../sendrecord/sendrecord?sendrecordData=' + sendrecordData,
    })
    console.log(sendrecordData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var subscribeId = options.id
    this.setData({
      subscribeId: subscribeId,
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
    let that = this;
    api.GET(
      "/subscribe/" + this.data.subscribeId + "/delivery", {
      },
      res => {
        console.log(res);
        that.setData({
          magazineData: res.params.orderitem,
          address: res.params.orderitem.address,
          total: res.params.orderitem.price * res.params.orderitem.number,
          nextTimes: res.params.orderitem.thisTimes + 1
        })
        console.log(this.data.total)
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