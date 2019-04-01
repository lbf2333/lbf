// pages/subscribe/subscribe.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["订阅中", "订阅完成"],
    activeIndex: 0,
    finishData:[ 
    ],
    notfinishData: [  
    ],
    thisTimes:'',
    subscribeId:'',
    notfinish_page: 1,
    finish_page: 1,
    size: 5,
    maxsize_no:0,
    maxsize:0
  },
  //查看详情
  checkLogistics: function(e) {
    var that = this;
    var subscribeId = e.currentTarget.id
    console.log(subscribeId);
    wx.navigateTo({
      url: '../subscribedetails/subscribedetails?id=' + subscribeId,
    })
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    })
  },
  //填写评价
  goEvaluation: function(e) {
    var id = e.currentTarget.id;
    var eid = e.currentTarget.dataset.in;
    console.log(eid)
    let evaluationData = JSON.stringify(this.data.finishData[eid])
    wx.navigateTo({
      url: '../evaluation/evaluation?id=' + id + '&evaluationData=' + evaluationData,
    })
    wx.showLoading({
      title: '加载中',
    }) 
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var activeIndex = options.id;
    var that =this;
    this.setData({
      activeIndex: activeIndex,
    })
    console.log(activeIndex)
    console.log(options)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this;
    // 显示加载图标  
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    if (this.data.activeIndex == 0) {
      let page = this.data.notfinish_page + 1;
      this.setData({
        notfinish_page: page
      })
      if (this.data.notfinishData.length < this.data.maxsize_no){
        this.getnotfinish();
      }else{
        // wx.showToast({
        //   title: '没有更多数据了',
        //   icon: 'none'
        // })
      }
    } else {
      let page = this.data.finish_page + 1;
      this.setData({
        finish_page: page
      })
      if (this.data.finishData.length < this.data.maxsize) {
        this.getfinish();
      } else {
        // wx.showToast({
        //   title: '没有更多数据了',
        //   icon: 'none'
        // })
      }
    }
  },
  tabClick: function(e) {
    //切换标签页
    console.log(e.currentTarget.id)
    var newtab = e.currentTarget.id;
    this.setData({
      activeIndex: newtab,
    })
    if (this.data.activeIndex == 0) {
      this.getnotfinish();
    } else {
      this.getfinish();
    }
  },
  getfinish() {
    let that = this;
    let page = this.data.finish_page;
    api.GET(
      "/subscribe/finish", {
        size: this.data.size,
        page: this.data.finish_page
      },
      res => {
        console.log(res);
        //当前页面为1时
        if (page == 1) {
          that.setData({
            finishData: res.params.orderitems,
            maxsize: res.params.totalCount,
          })
          console.log(this.data.thisTimes)
          //加载更多页面时
        } else {
          // 将新获取的数据concat到的finishData中
          if (res.params.orderitems == '') {
            that.setData({
              finishData: this.data.finishData,
            })
          } else {
            that.setData({
              finishData: this.data.finishData.concat(res.params.orderitems)
            })
          }
        }
      }
    )
  },
  getnotfinish() {
    let that = this;
    let page = this.data.notfinish_page
    api.GET(
      "/subscribe/notFinish", {
        size: this.data.size,
        page: this.data.notfinish_page
      },
      res => {
        console.log(res);
        //当前页面为1时
        if (page == 1){
        that.setData({
          notfinishData: res.params.orderitems, 
          maxsize_no: res.params.totalCount,
        })
        //加载更多页面时
        }else{
          // 将新获取的数据concat到的notfinishData中
          if (res.params.orderitems == '') {
            that.setData({
              notfinishData: this.data.notfinishData,
            })
          } else {
            that.setData({
              notfinishData: this.data.notfinishData.concat(res.params.orderitems)
            })
          }
        }
      }
    )
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
    if (this.data.activeIndex == 1) {
      this.getfinish()
    } else {
      this.getnotfinish();
    }
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})