// pages/searSchchool1/searSchchool1.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      flag:true,
      show:false,
      schools:[],
      value:'',
  },
  // padding(){
  //   this.setData({
  //     flag:false,
  //   })
  // },
  //跳转回去新建/创建地址页
  backEstablish(e){
    let _this=this
    let schoolName= e.currentTarget.dataset.name
    let schoolId = e.currentTarget.dataset.id
    let address = e.currentTarget.dataset.address
    console.log(address)
    // wx.setStorageSync('schoolName', schoolName)
    // wx.setStorageSync('schoolId', schoolId)
    // wx.setStorageSync('address', address)
    let pages = getCurrentPages()
    console.log(pages)
    let lastPage = ''
    if (pages.length >= 2) {
      lastPage = pages[pages.length - 2]
    }
    console.log(lastPage)
    lastPage.setData({
      schoolName: schoolName,
      schoolId: schoolId,
      address: address
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //搜索学校
  search(e){
   let _this=this
   if (e.detail.value.length>0){
      this.setData({
        flag: false,
        // show: true,
      })
    } else if (e.detail.value.length <= 0) {
      this.setData({
        flag: true,
        show: false,
        // schools:"", 
      })
    }
   _this.setData({
     value:e.detail.value
   })
    // console.log(e.detail.value)
  },
  //请求学校接口
  show(){
    let _this = this
    api.POST(
      "/common/school/search", {
        "name":_this.data.value
      },
      res => {
        if(res.msg){
          let schools = res.params.schools
          console.log(res)
          // 判断学校输入是否为无
          if(!schools.length){
            _this.setData({
              show: true,
            })
          }else{
            _this.setData({
              show: false,
            })
          }
          _this.setData({
            schools: schools
          })
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.show()
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