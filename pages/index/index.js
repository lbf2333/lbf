//index.js
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js");
import magazineItemJS from '../template/magazineItem/magazineItem'
Page({
  data: {
    imgUrls: [
      '../../images/img-example.jpg',
      '../../images/img-example.jpg',
      '../../images/img-example.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    circular: true,
    magazienld: '',
    tas:[],
    magazines:[],
    magazineT: 1,
    tasT: 2,
  },
  toDetail: magazineItemJS.toDetail, // 根据商品id 跳转至详情
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  magazineMore(){
    let type = this.data.magazineT;
    wx.navigateTo({
      url: '/pages/index/more/more?type=' + type,
    })
  },
  tasMore() {
    let type = this.data.tasT;
    wx.navigateTo({
      url: '/pages/index/more/more?type=' + type,
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onShow: function(){
    let that = this;
    api.GET(
      '/magazine/hot', {}, res => {
        if (res.code == 1) {
          let tas = res.params.tas;
          let magazines = res.params.magazines;
          console.log(tas[0]);
          if (res.msg) {
            that.setData({
              tas: tas,
              magazines: magazines
            })
          }

        }
      }

    )
  },
  onLoad: function (options) {
    console.log(utils)
    console.log(api)
    
  }
})
