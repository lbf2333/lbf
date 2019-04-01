// pages/search/result/result.js
import magazineItemJS from '../template/magazineItem/magazineItem'
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 6,
    maxSize: 0,
    records: [],
    hots: [],
    searchKey: '',
    orderType: 1,
    priceOrder: 1,
    filters: {
      type: null,
      grades: [],
      categoryId: null
    },
    currentFilters:{
      type: null,
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
    showSearch: true,
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
    this.getFilterConditons()
    this.getSearchHots()
  },
  bindKeyInput(e) {
    this.setData({
      searchKey: e.detail.value.trim()
    })
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
        console.log()
      }
    })
  },
  getSearchHots() {
    api.GET("/magazine/searchKeyword/10", {}, res => {
      console.log(res)
      if (res.code == 1) {
        this.setData({
          hots: res.params.searchKeywords
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let filters = this.dealConditions()
    api.POST("/magazine/search", filters, res => {
      console.log(res)
      if (res.code == 1) {
        if (this.data.page == 1) {
          this.setData({
            maxSize: res.params.totalCount
          })
        }
        this.setData({
          magazines: res.params.magazines
        })
      }
    })
  },
  toSearch() {
    this.reset()
    this.setData({
      showSearch: true,
      orderType:1
    })
  },
  clearRecords() {
    this.setData({
      records: []
    })
    wx.removeStorageSync('records')
  },
  search(e) {
    console.log(e.currentTarget.dataset.key);
    let key = e.currentTarget.dataset.key
    if (!key) {
      return;
    }
    this.setData({
      searchKey: key
    })
    let records = this.data.records
    let index = records.findIndex(record => record == key)
    if(index != -1){
      records.splice(index, 1);
    }
    records.unshift(key)
    if (records.length > 10) {
      records.pop()
    }
    console.log(records);
    wx.setStorageSync('records', JSON.stringify(records))
    this.setData({
      showSearch: false,
      records: records
    })
    this.initData()
    this.getDatas()
  },
  orderTab(e) {
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
  selectType(e) {
    this.setData({
      "filters.categoryId": null
    })
    console.log(e.currentTarget.dataset.type);
    let FilterType = e.currentTarget.dataset.type
    if (FilterType != this.data.filters.type) {
      this.setData({
        "filters.type": FilterType
      })
    } else {
      this.setData({
        "filters.type": 0
      })
    }
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
      type: null,
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
      name:this.data.searchKey,
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
    let records = wx.getStorageSync('records') ? JSON.parse(wx.getStorageSync('records')) : []
    console.log(records)
    this.setData({
      records: records
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