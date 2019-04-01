// pages/upimg/upimg.js
import WeCropper from '../../../we-cropper/dist/we-cropper.js';
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 100;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 200) / 2,
        y: (height - 200) / 2,
        width: 200,
        height: 200
      }
    },
    is_choose: false, //是否选择了照片
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
        self.setData({
          is_choose: true
        })
      }
    })
  },
  getCropperImage() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!this.data.is_choose) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      })
    } else {
      this.wecropper.getCropperImage((src) => {
        if (src) {
          console.log(src)
          let pages = getCurrentPages()
          console.log(pages)
          let lastPage = ''
          if (pages.length >= 2) { // 正常来说，这时必定符合条件的，这里加个判断以防万一
            lastPage = pages[pages.length - 2]
          }
          console.log(lastPage)
          if (lastPage && lastPage.route == 'pages/my/edit/edit') {
            lastPage.setData({ // 可直接修改上一个页面data中的值
              head: src,
              isUpload: true
            })
            wx.navigateBack({
              delta: 1
            })
          }
          // wx.uploadFile({
          //   url: app.globalData.url + '/api/file/uploadStudentHeadImg',
          //   filePath: src,
          //   header: {
          //     token: token
          //   },
          //   name: 'file',
          //   success: function(res) {
          //     console.log(res.data, '上传头像')
          //     var r = JSON.parse(res.data);
          //     if (r.info == 1) {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     }
          //   }
          // })
        } else {
          console.log('获取图片地址失败，请稍后重试')
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      cropperOpt
    } = this.data
    // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context: ${ctx}`)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
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
  // onShareAppMessage: function() {

  // }
})