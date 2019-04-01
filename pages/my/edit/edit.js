// pages/edit/edit.js
import api from '../../../utils/api.js';
import util from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '你好',
    phone: '',
    head: '',
    isUpload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyself()
  },
  getMyself() {
    api.GET("/user/profile", {}, res => {
      console.log(res)
      if (res.code == 1) {
        this.setData({
          name: res.params.nickname,
          phone: res.params.mobile,
          head: res.params.iconUrl
        })
      }
    })
  },
  changeName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  changePhone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  goUpImg: function () {
    wx.navigateTo({
      url: '../uploadImg/uploadImg',
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    var info = this.data.phone;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
      api.POST("/user/mobile", params, res => {
        if (res.code == 1) {
          this.setData({
            phone: res.params.mobile
          })
        }
      })
    }
  },
  saveInfo(){
    if (!this.data.name) {
      util.showModal("请输入昵称")
    } else if (this.data.phone&&!/^\d{11}$/.test(this.data.phone)) {
      util.showModal("请输入正确的手机号码")
    } else{
      api.PUT("/user", {
        nickname: this.data.name,
        mobile: this.data.phone
      }, res => {
        console.log(res)
        if (res.code == 1) {
          util.showModal("保存成功",()=>{
            wx.navigateBack({
              delta: 1
            })
          })
        }
      })
      if(this.data.isUpload){
        this.setData({
          isUpload: false
        })
        api.uploadImg("/user/icon",this.data.head,()=>{
          console.log('上传头像');
        })
      }
    } 
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
  // onShareAppMessage: function () {

  // }
})