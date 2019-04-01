// pages/evaluation/evaluation.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anonymous:true,
    magazineId:'',
    orderItemId:'',
    content:'',
    star: 0,
    two_2: 5,
    commentsuccess: false
  },
  //评价星星
  in_xin: function (e) {
    if(this.data.commentsuccess){
      return
    }
    var in_xin = e.currentTarget.dataset.in;
    var star;
    if (in_xin === 'use_sc2') {
      star = Number(e.currentTarget.id);
    } else {
      star = Number(e.currentTarget.id) + this.data.star;
    }
    this.setData({
      star: star,
      two_2: 5 - star
    })
  },
  //获取评论内容
  bindTextAreaChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 评价提交
  bindSubmit: function () {
    var that = this;
    api.POST(
      "/comment", {
      anonymous:this.data.anonymous,
      star: this.data.star ,
      content: this.data.content,
      orderItemId: this.data.orderItemId,
      },
      res => {
        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 1500,  
        })
        that.setData({
          commentsuccess:true
        })
      }
    )
    console.log(this.data.star)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var evaluationData = JSON.parse(options.evaluationData)
    var orderItemId = options.id;
    this.setData({
      orderItemId: orderItemId,
      evaluationData: evaluationData
    })
    let that = this;
    console.log(orderItemId)
    this.getComment()
  },
  getComment() {
    api.GET(
      "/orderItem/" + this.data.orderItemId + "/comment", {
      },
      res => {
        console.log(res);
        if (res.code == 1){
          this.setData({
            content: res.params.comment.content,
            star: res.params.comment.star,
            commentsuccess: true,
            two_2: 5 - res.params.comment.star
          })
        }
        
      }
    )
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

  }
})