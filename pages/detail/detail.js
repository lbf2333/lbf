// pages/detail/detail.js
const api = require("../../utils/api.js");
const wxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    type: 0,
    isLike: false,
    menuTop: '',  // 吸顶
    // banner
    magazineCoverUrl: [
      
    ],
    // detail: `<div>我是HTML代码</div><h2>这是标题</h2><p>段落1</p ><p>段落2</p >`,
    indicatorDots: true, //是否显示面板指示点
    autoplay: false, //是否自 动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 500,
    subscribePlanMVos : [],
    count: 1,
    // 商品详情介绍
    detailsub:'',
    magazineName: '',
    price: '',
    detEva:[    //商品的评价
      
    ],
    boxIndex: 0,
    collect: '',
    shy: true,   //tab 切换
    riook: false,  //tab 切换
    magazineId: '',
    addlick: false,
    addressId: 1,
    shops:[],
    subscribePlanPeriod:'',
    subscribePlanPublishPeriod: '',
    beginDate: '',
    endDate: '',
    deliveryCycle: '',
    beginPublishedTime:'',
    endPublishedTime:'',
    cathide: false,
    detail: '',
    showPrice:''
  },
  shy: function (e) {
    this.setData({
      riook: false,
      shy: true 
    })
  },
  riook: function (e) {
    this.setData({
      shy: false,
      riook: true
    })
  },
  shopNums(e){
    let nums= e.detail.value;
    if(nums<1){
      nums= 1;
    }
    this.setData({
      count: nums
    })
  },
  goHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  boxbox(e){
    let boxIndex = e.currentTarget.dataset.id;
    if (boxIndex != this.data.boxIndex){
      
      let subscribePlanMVo = this.data.subscribePlanMVos.find(item => {
        return item.id == boxIndex
      }) 
      console.log(boxIndex)
      this.setData({
        boxIndex: boxIndex,
        subscribePlanPeriod: subscribePlanMVo.subscribePlanPeriod,
        subscribePlanPublishPeriod: subscribePlanMVo.subscribePlanPublishPeriod,
        beginDate: subscribePlanMVo.beginDate,
        endDate: subscribePlanMVo.endDate,
        deliveryCycle: subscribePlanMVo.deliveryCycle,
        endPublishedTime: subscribePlanMVo.endPublishedTime,
        beginPublishedTime: subscribePlanMVo.beginPublishedTime,
        showPrice: subscribePlanMVo.price
      })
      console.log(subscribePlanMVo)
    }
  },
  comment(e) {
    let comments = e.currentTarget.dataset.id;
  },
  // 收藏
  addLike(){  
    let that = this;
    let like = that.data.isLike;
    let collect = that.data.collect;
    let magazineId = that.data.magazineId
    if (like == collect){
      api.POST('/favorite', {
        magazineId: that.data.magazineId
      }, res => {
        console.log(res)
      })
    }else{
      api.DELETE('/favorite/'+magazineId,{},res=>{
        console.log(res)
      })
    }
    
    let pages = getCurrentPages()
    console.log(pages)
    let lastPage = ''
    if (pages.length >= 2) {
      lastPage = pages[pages.length - 2]
    }
    console.log(lastPage)
    if (lastPage.route == "pages/collection/collection"){
      let allcount = lastPage.data.allcount
      if (like == collect) {
        allcount++;
      } else {
        allcount--
      }
      lastPage.setData({
        allcount: allcount
      })
    } 
      // api.GET(
      // '/favorite?magazineType=1&page=1&size=5', {}, res => {
      //   console.log(res)
      // })
      
    
      this.setData({
      isLike: !this.data.isLike
    });
  },
  
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  // 立即订购
  immeBuy(e) {
    console.log(this.data.boxIndex)
    if(!this.data.boxIndex) {
      return
    }
    let that = this;
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      this.hideModal()
    } else {
      this.buyHideModal()
    }
    let sublist = that.data.subscribePlanMVos;
    let boxindex = that.data.boxIndex;
    // sublist.find(function (id, boxindex){
    //   return id = boxindex
    // })
    let shops = [{ 
      price: that.data.price, 
      magazineName: that.data.magazineName, 
      magazineCoverUrl: that.data.magazineCoverUrl[0], 
      subscribePlanId: that.data.boxIndex, 
      count: that.data.count,
      subscribePlanPeriod: that.data.subscribePlanPeriod,
      subscribePlanPublishPeriod: that.data.subscribePlanPublishPeriod,
      beginDate: that.data.beginDate,
      endDate: that.data.endDate,
      endPublishedTime: that.data.endPublishedTime,
      beginPublishedTime: that.data.beginPublishedTime
      }]
    let shop = JSON.stringify(shops)

      wx.navigateTo({
        url: '/pages/submitOrder/submitOrder?shop=' + shop
    })
  },
  goCat(e){
    console.log(this.data.boxIndex)
    if (!this.data.boxIndex) {
      return
    }
    let type = e.currentTarget.dataset.type; 
    let  that = this;
    api.POST(
      '/shopcart',{
        count: that.data.count,
        magazineId : that.data.magazineId,
        subscribePlanId: that.data.boxIndex
      },res=>{
        console.log(res)
        if(type == 1){
          this.hideModal()
        }else{
          this.catHideModal()
        }
          wx.showToast({
            title: '成功加入购物车',
            icon: 'success',
            duration: 2000
          });
      }
    )


    // 查询购物车里的商品
    // api.GET(     
    //   '/shopcart?page=1&size=5',{},res=>{
    //     console.log(res)
    //   }
    // )
    
    
  },
  preventTouchMove: function (e) {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let magazineId = options.id;
    let that = this;
    // wxParse.wxParse('article', 'html', this.data.detail, that, 5);
    api.GET(
      '/magazine/' + magazineId, {},res => {
        console.log(res)
        that.setData({
          magazineCoverUrl : res.params.magazine.coverUrls,
          magazineName : res.params.magazine.name,
          detailsub : res.params.magazine.subscribeCount,
          price : res.params.magazine.cheapestPrice,
          subscribePlanMVos: res.params.magazine.subscribePlanMVos,
          collect: res.params.magazine.collect,
          detail: res.params.magazine.detail,
         
        })
        if (this.data.subscribePlanMVos.length != 0){
          this.setData({
            boxIndex: res.params.magazine.subscribePlanMVos[0].id,
            subscribePlanPeriod: res.params.magazine.subscribePlanMVos[0].subscribePlanPeriod,
            subscribePlanPublishPeriod: res.params.magazine.subscribePlanMVos[0].subscribePlanPublishPeriod,
            beginDate: res.params.magazine.subscribePlanMVos[0].beginDate,
            endDate: res.params.magazine.subscribePlanMVos[0].endDate,
            endPublishedTime: res.params.magazine.subscribePlanMVos[0].endPublishedTime,
            beginPublishedTime: res.params.magazine.subscribePlanMVos[0].beginPublishedTime,
            deliveryCycle: res.params.magazine.subscribePlanMVos[0].deliveryCycle,
            showPrice: res.params.magazine.subscribePlanMVos[0].price
          })
        }
        console.log(wxParse,that.data.detail);
        wxParse.wxParse('article', 'html', that.data.detail, that, 5)
      }
    ),
    
    // api.GET(
    //   '/magazine/' + magazineId +'/comment',{},res =>{
    //     console.log(res)
    //     if(res.params.totalCount != 0){
    //       that.setData({
    //         detEva: res.params.comments
    //       })
    //       console.log(that.data.detEva)
    //     }else{
    //       that.setData({
    //         detEva: res.params.totalCount
    //       })
    //     }
    //   }
    // )
 
    that.setData({
      magazineId: magazineId
    })
    this.getComments()
    console.log(that.data.magazineId) //杂志的id 
  },
  getComments() {
    api.GET(
      '/comment/' + this.data.magazineId, {
        evaluate: this.data.type
      }, res => {
        let detEva = []
        if(res.code == 1){
          detEva = res.params.comments
        }  
        this.setData({
          detEva: detEva
        }) 
        console.log(res)
      }
    )
  },
  selectType(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      type:type
    })
    this.getComments()
  },
  addNum:function(){ //商品数量的增加
    var count = this.data.count;
    count ++;
    this.setData({
      count: count
    })
  },
  minNum:function(){ //商品数量的递减
    var count = this.data.count;
    if (count>1){
      count --;
    }
    this.setData({
      count: count
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
    var that = this;
    var query = wx.createSelectorQuery()//创建节点查询器 query
    query.select('#fix').boundingClientRect()//选择Id的节点，获取节点位置信息的查询请求
    query.exec(function (res) {
      // console.log(res[0].top); // #fix节点的上边界坐标
      that.setData({
        menuTop: res[0].top
      })
    });
  },
  onPageScroll: function (e) {
    // console.log(e);//{scrollTop:99}
    var that = this;
    //当页面滚动距离scrollTop > menuTop某元素距离文档顶部的距离时，某元素固定定位
    if (e.scrollTop > that.data.menuTop) {
      that.setData({
        menuFixed: true
      })
    } else {
      that.setData({
        menuFixed: false
      })
    }
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
       duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  catShowModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      ModalStatus: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹框
  catHideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        ModalStatus: false
      })
    }.bind(this), 200)
  },
  buyShowModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      buyModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹框
  buyHideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        buyModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (open) {

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
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.magazineName,
      path: 'pages/detail/detail?id=' + that.data.magazineId,
      imageUrl: that.data.magazineCoverUrl[0]
    }
  }
})