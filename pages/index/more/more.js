// pages/search/result/result.js
import magazineItemJS from '../../template/magazineItem/magazineItem'
import api from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 6,
    maxSize: 0,
    orderType: 1,
    priceOrder: 1,
    filters: {
      type: 1,
      grades: [],
      categoryId: null
    },
    currentFilters: {
      type: 1,
      grades: [],
      categoryId: null
    },
    orders: [{
      label: '综合',
      value: 1
    }, {
      label: '销量',
      value: 2
    }, {
      label: '新品',
      value: 3
    }, {
      label: '价格',
      value: 4
    }],
    showFilter: false,
    magazines: [],
    types: [{
      label: '杂志',
      value: 1
    }, {
      label: '辅导教材',
      value: 2
    }],
    series: [],
    subjects: [],
    grades: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 需要接收类型参数，1是杂志，2是教辅
    this.setData({
      'filters.type': options.type || 1,
      'currentFilters.type': options.type || 1
    })
    this.getFilterConditons()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.initData()
    this.getDatas()
  },
  getFilterConditons() {
    api.GET("/category/filter", {}, res => {
      console.log(res)
      if (res.code == 1) {
        this.setData({
          series: res.params.categories[0].subCategories,
          subjects: res.params.categories[1].subCategories,
          grades: res.params.tags
        })
      }
    })
  },
  initData() {
    this.setData({
      magazines: [],
      page: 1,
      maxSize: 0
    })
  },
  getDatas() {
    let filters = this.dealConditions()
    api.POST("/magazine/search", filters, res => {
      console.log(res)
      if (res.code == 1) {
        if(this.data.page == 1){
          this.setData({
            maxSize: res.params.totalCount
          })
        }
        let magazines = this.data.magazines;
        magazines.push(...res.params.magazines);
        this.setData({
          magazines: magazines
        })
      }
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  orderTab(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(e.currentTarget.dataset.value);
    let value = e.currentTarget.dataset.value
    if (value != this.data.orderType) {
      this.setData({
        orderType: value,
        priceOrder: 1
      })
      this.initData()
      this.getDatas()
    } else if (value == 4) {
      let priceOrder = this.data.priceOrder == 1 ? 2 : 1
      this.setData({
        priceOrder: priceOrder
      })
      this.initData()
      this.getDatas()
    }
  },
  showModal() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },
  // 禁止滚动
  preventTouchMove() {},
  //隐藏弹窗
  hideModal() {
    this.setData({
      showFilter: false
    })
  },
  toFilter() {
    this.showModal()
  },
  noSubmit() {
    this.setData({
      filters: this.data.currentFilters
    })
    this.hideModal()
  },
  selectGrade(e) {
    let grade = e.currentTarget.dataset.grade
    let filtersGrades = this.data.filters.grades
    let index = filtersGrades.findIndex(item => item === grade)
    if (index != -1) {
      filtersGrades.splice(index, 1)
    } else {
      filtersGrades.push(grade)
    }
    console.log(filtersGrades)
    this.setData({
      "filters.grades": filtersGrades
    })
  },
  select(e) {
    let categoryId = e.currentTarget.dataset.id
    if (categoryId != this.data.filters.categoryId) {
      this.setData({
        "filters.categoryId": categoryId
      })
    } else {
      this.setData({
        "filters.categoryId": null
      })
    }
  },
  reset() {
    let filters = {
      type: this.data.filters.type,
      grades: [],
      categoryId: null
    }
    this.setData({
      filters: filters
    })
  },
  filter() {
    console.log(this.data.filters);
    this.setData({
      currentFilters: this.data.filters,
      showFilter: false
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.initData()
    this.getDatas()
  },
  dealConditions() {
    let orderType = this.data.orderType
    if (orderType == 4 && this.data.priceOrder == 2) {
      orderType = 5
    }
    // console.log(orderType)
    let filters = {
      type: this.data.currentFilters.type,
      categoryId: this.data.currentFilters.categoryId,
      tags: this.data.currentFilters.grades,
      sortType: orderType > 3 ? null : orderType,
      priceSortType: orderType == 4 ? 2 : orderType == 5 ? 1 : 0,
      page: this.data.page,
      size: this.data.size,
    }
    console.log(filters)
    return filters
  },
  toDetail: magazineItemJS.toDetail,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let title = '杂志'
    if (this.data.filters.type == 2) {
      title = '辅导材料'
    }
    wx.setNavigationBarTitle({
      title: title,
    })
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
    wx.setNavigationBarTitle({
      title: "红领巾书架",
    })
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
    if (this.data.magazines.length < this.data.maxSize) {
      this.data.page++;
      this.getDatas()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})