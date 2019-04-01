// pages/submitOrder/submitOrder.js
const api = require("../../utils/api.js");
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delivery:[
      

    ]   /* 接收地址详情信息 */,
    allPrice: '', // 所有杂志总价
    allNum : '' , //所有杂志总数
    shoplist: [],
    order : [],
    consignee:[],
    shopPrice: '',
    shopNum:'',
    imgCover:'',
    subscribePlanId : '',//订购方案参数
  },
  goModify(){
    wx.navigateTo({
      // orderid 只是跳转地址页面的参数
      url: '/pages/modify/modify?orderid='+'5',
    })
  },
  goaddress(){
    wx.navigateTo({
      // orderid 只是跳转地址页面的参数
      url: '/pages/addressInformation/addressInformation?orderid='+'5',
    })
  },
  goOrderSuccessfully:function(){
    let that = this;
    let delivery = that.data.delivery
    let subscribePlanAddVos = [];
    for(let i=0;i<this.data.shoplist.length;i++){
      let subscribePlanAddVo = {
        number: this.data.shoplist[i].count,
        subscribePlanId: that.data.shoplist[i].subscribePlanId
      }
      subscribePlanAddVos.push(subscribePlanAddVo)
    }
    console.log(delivery)
    if (delivery==null){
      that.goModify();
    }else{
      let addressId = delivery.id
       api.POST('/order', {
        addressId: addressId,
        subscribePlanAddVos: subscribePlanAddVos
      }, res => {
        console.log(res)
        let order = res.params.orderNo;
        api.POST('/order/' + order + '/pay', {}, res => {
          console.log(res)
          let timeStamp = res.params.pay.timeStamp;
          let nonceStr = res.params.pay.nonceStr
          let packages = res.params.pay.package
          let paySign = res.params.pay.paySign
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: packages,
            signType: 'MD5',
            paySign: paySign,
            success(res) {
              wx.showLoading({
                title: '支付中...'
              })
              setTimeout(() => {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/orderSuccessfully/orderSuccessfully?order=' + order,
                })
              }, 1000)

            },
            fail(res) { }
          })
        })
        // wx.navigateTo({
        //   url: '/pages/orderSuccessfully/orderSuccessfully?order=' + order,
        // })
      })
    }
     

      
        
        
      
    
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
   
    var shop =JSON.parse(options.shop)
    that.setData({
      shoplist: shop
    })
    that.count();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  count(){
    let shoplist = this.data.shoplist;
    let shopPrice = 0;
    let shopNum = 0;
    for(let i = 0;i<shoplist.length; i++ ){
      shopPrice += shoplist[i].price * shoplist[i].count
      shopNum += shoplist[i].count
    }
    this.setData({
      allNum: shopNum,
      allPrice: shopPrice
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    api.GET(
      '/common/address', {
      }, res => {
        console.log(res.params.address)
        let delivery = null
        if (res.code == 1) {
          let address = res.params.address;
          for (let i = 0; i < address.length; i++) {
            if (address[i].defaultAddress) {
              delivery = address[i]
              break;
            }
          }
        }
        this.setData({
          delivery: delivery
        })
      }
    )
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