// pages/collection/collection.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currenttab: '1',
    magazineData:[
    ],
    coachData: [
    ],
    magazineId:'',
    magazine_page: 1,
    size: 6,
    magazinemaxsize:'',
    coachmaxsize: '',
    coach_page:1,
    allcount: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    let allcount = e.count;
    console.log(allcount)
    let currenttab = this.data.currenttab;
    this.setData({
      currenttab: this.data.currenttab,
      allcount: allcount
    })
    console.log(currenttab)
    
  
  },
  selectTab: function (e) {
    //切换标签页
    console.log(e.currentTarget.dataset.tabid)
      this.setData({
        currenttab: e.currentTarget.dataset.tabid,
      })
    let that =this;
    this.getfavorite();
  },
  goMagazinedetail:function(e){
    var magazineId = e.currentTarget.dataset.mid
    console.log(magazineId)
    wx.navigateTo({
      url: '../detail/detail?id=' + magazineId,
    })
  },
  goCoachDatadetail: function (e) {
    var magazineId = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../detail/detail?id=' + magazineId,
    })
  },
  getfavorite() {
    let magazineType = this.data.currenttab;
    let that = this;
    let page = magazineType == 1?this.data.magazine_page:this.data.coach_page
    api.GET(
      "/favorite", {
        magazineType,
        size: this.data.size,
        page: this.data.magazine_page
      },
      res => {
        if (this.data.currenttab == 1) {
          if (page == 1) {
            that.setData({
              magazineData: res.params.favorites,
              magazinemaxsize: res.params.totalCount
            })
            //加载更多页面时
          } else {
            if (res.params.favorites == '') {
              that.setData({
                magazineData: this.data.magazineData
              })
            } else {
              that.setData({
                magazineData: this.data.magazineData.concat(res.params.favorites)
              })
            }
          }
          var coachmaxsize = this.data.allcount-this.data.magazinemaxsize
          that.setData({
            coachmaxsize: coachmaxsize
          })
          console.log(coachmaxsize);
        } else {
          if (page == 1) {
            that.setData({
              coachData: res.params.favorites,
              coachmaxsize: res.params.totalCount
            })
            console.log(that.data.coachmaxsize)
            //加载更多页面时
          } else {
            if (res.params.favorites == '') {
              that.setData({
                coachData: this.data.coachData
              })
            } else {
              that.setData({
                coachData: this.data.coachData.concat(res.params.favorites)
              })
            }
          }
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
    if(this.data.currenttab == 1){
      this.setData({
        magazine_page: 1
      })
    }else{
      this.setData({
        coachcount_page: 1
      })
    }
    this.getfavorite();
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
    var that = this;
    if (this.data.currenttab == 1) {
      let page = this.data.magazine_page + 1;
      this.setData({
        magazine_page: page
      })
      if (this.data.magazineData.length < this.data.magazinemaxsize) {
        this.getfavorite();
      } 
    } else {
      let page = this.data.coachcount + 1;
      this.setData({
        coachcount: page
      })
      if (this.data.coachData.length < this.data.coachmaxsize) {
        this.getfavorite();
      } 
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})