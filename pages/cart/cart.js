// pages/shopcart1/shopcart1.js
const app = getApp();
import api from '../../utils/api.js';
import util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: null,
    count: 0,
    selectAllStatus: false,
    show: true,
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    shopNum: "1",
    shoplist: [
      // {
      //   magazine: "期刊名称期刊名称期刊名称期刊名称...",
      //   price: "100.00",
      //   number: "1",
      //   id: 1,
      //   _show: false,
      // },
      // {
      //   magazine: "期刊名称期刊名称期刊名称期刊名称...",
      //   price: "100.00",
      //   number: "2",
      //   id: 2,
      //   _show: false,
      // },
      // {
      //   magazine: "期刊名称期刊名称期刊名称期刊名称...",
      //   price: "100.00",
      //   number: "2",
      //   id: 3,
      //   _show: false,
      // }
    ],

  },
  //结算
  settlement() {
    let shoplist = this.data.shoplist;
    let shops = []
    let setttler=false
    for (let i = 0; i < shoplist.length; i++) {
      if (shoplist[i]._show){
        shops.push(shoplist[i])
        setttler=true
      }
    }
    if (setttler){
      let shop = JSON.stringify(shops)
      wx.navigateTo({
        url: '../submitOrder/submitOrder?shop=' + shop,
      })
    }else{
      wx.showToast({
        title: '请选择商品结算',
        icon:"none",
        duration:2000,
      })
    }
    
  },
  //收藏
  collect() {
    let _this = this
    let selectAllStatus = _this.data.selectAllStatus
    let shoplist = _this.data.shoplist
    let newlist = []
    let cartItemId = []
    let selectItem = false;
    for (let i = 0; i < shoplist.length; i++) {
      if (shoplist[i]._show) {
        selectItem = true
        cartItemId.push(shoplist[i].cartItemId)
        console.log(cartItemId)
      } else {
        // 不需要移入收藏夹的存到数组中
        newlist.push(shoplist[i]);
      }
    }
    if (!selectItem) {
      wx.showToast({
        title: '您还没选择商品',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定移入收藏夹吗？',
        success(res) {
          wx.hideToast()
          if (res.confirm) {
            _this.setData({
              shoplist: newlist,
              // selectAllStatus: newlist,
            });
          }
          //调取收藏接口
          api.POST(
            "/favorite/batch", {
              "magazineId": cartItemId
            },
            res => {
              if (res.code == 1) {
                console.log(res)
                _this.getTotalPrice();
              }
            }
          )
        }
      })
    }
  },
  // 计算总价
  getTotalPrice() {
    let shoplist = this.data.shoplist;
    let total = 0;
    for (let i = 0; i < shoplist.length; i++) { // 循环列表得到每个数据
      // 判断选中才会计算价格
      if (shoplist[i]._show) {
        total += parseInt(shoplist[i].count) * parseInt(shoplist[i].price / 100); // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      shoplist: this.data.shoplist,
      totalPrice: total
    });
  },
  // 全选事件
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let shoplist = this.data.shoplist;

    for (let i = 0; i < shoplist.length; i++) {
      shoplist[i]._show = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      shoplist: shoplist
    });
    this.getTotalPrice(); // 重新获取总价
  },
  // 切换管理
  administration() {
    let _this = this
    this.setData({
      show: !this.data.show,
    })
  },
  // 切换完成
  complete() {
    let _this = this
    this.setData({
      show: !this.data.show,
    })
  },
  //商品勾选的背景图切换
  toggle(e) {
    this.toggles(e)
    this.getTotalPrice()
  },
  toggles(e) {
    let _this = this
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    let shoplist = this.data.shoplist; //商品列表
    let index = e.currentTarget.dataset.index
    shoplist[index]._show = !shoplist[index]._show
    for (var i = 0; i < shoplist.length; i++) {
      if (!shoplist[i]._show) {
        selectAllStatus = false;
        break;
      } else {
        selectAllStatus = true;
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      shoplist: shoplist,
    })
  },
  //删除商品
  deleteList() {
    let _this = this
    let selectAllStatus = _this.data.selectAllStatus
    let shoplist = _this.data.shoplist
    let newlist = []
    let cartItemId = []
    let selectItem = false;
    for (let i = 0; i < shoplist.length; i++) {
      if (shoplist[i]._show) {
        selectItem = true
        cartItemId.push(shoplist[i].cartItemId)
      } else {
        // 不需要删除的存到数组中
        newlist.push(shoplist[i]);
      }
    }
    if (!selectItem) {
      wx.showToast({
        title: '您还没选择商品',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success(res) {
          wx.hideToast()
          if (res.confirm) {
            _this.setData({
              shoplist: newlist,
              // selectAllStatus: newlist,
            });
            //调取商品删除接口
            api.DELETE(
              "/shopcart?id=" + cartItemId, {},
              res => {
                if (res.code == 1) {
                  _this.getTotalPrice();
                }
              }
            )
          }
        }
      })
    }
  },
  // 清空购物车
  enpyt() {
    let _this = this
    let shoplist = _this.data.shoplist
      wx.showModal({
        title: '提示',
        content: '确定删除全部吗？',
        success(res) {
          if (res.confirm) {
            let shoplist = _this.data.shoplist;
            shoplist.length = 0;
            _this.setData({
              shoplist: shoplist
            })
            //调取商品删除接口
            api.DELETE(
              "/shopcart/empty", {},
              res => {
                if (res.code == 1) {
                  _this.setData({
                    shoplist: _this.data.shoplist
                  })
                  _this.getTotalPrice();
                }
              }
            )
          } else if (res.cancel) { }
        }
      })
   
  },
  // 减
  reduce(e) {
    let _this = this
    console.log(_this.data.shoplist)
    let index = e.currentTarget.dataset.index
    let cartId = e.currentTarget.dataset.id
    console.log(cartId)
    let numberes = e.currentTarget.dataset.value
    let num = Number(numberes)
    if (num > 1) {
      num--;
    }
    _this.data.shoplist[index].count = num
    this.setData({
      shoplist: _this.data.shoplist
    })
    this.getTotalPrice()
    this.debounce(this.toggleNum, cartId, num, 500);
    _this.getTotalNum()
  },
  debounce(fn, cartId, num, delay) {
    // fn是回调函数，delay是延迟时间，immediate是否先执行一次再节流 
    clearTimeout(this.data.timer);
    let _this = null;
    this.data.timer = setTimeout(()=>{
      fn(cartId, num)
    },delay);
  },
  // 数量增加减少
  toggleNum(cartId, num) {
    api.PUT(
      "/shopcart/" + cartId, {
        count: num
      },
      res => {
        if (res.code == 1) {
          this.getTotalPrice();
          //  this.getData();
        }
      }
    )
  },
  // 加
  addition(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let numberes = e.currentTarget.dataset.value
    let num = Number(numberes)
    let cartId = e.currentTarget.dataset.id
    num++
    _this.data.shoplist[index].count = num
    this.setData({
      shoplist: _this.data.shoplist
    })
    this.getTotalPrice()
    console.log(this.data.shoplist)
    this.debounce(this.toggleNum, cartId, num, 1000);
    _this.getTotalNum()
  },
  //输入框数量改变
  changeNum(e) {
    let _this = this
    let numberes = e.detail.value;
    console.log(numberes)
    if (numberes < 1) {
      numberes = 1
      // _this.setData({
      //   shopNum: numberes
      // })
    }
    // return;
    let num = Number(numberes)

    let cartId = e.currentTarget.dataset.id
    console.log(num)
    let index = e.currentTarget.dataset.index
    this.data.shoplist[index].count = num
    // 将数值与状态写回  
    this.setData({
      shoplist: _this.data.shoplist
    });
    this.getTotalPrice()
    this.debounce(this.toggleNum, cartId, num, 1000);
    _this.getTotalNum()
  },
  // 弹框之后的数据加减
  // addNum: function () { //商品数量的增加
  //   let shopNum = this.data.shopNum;
  //   shopNum++;
  //   this.setData({
  //     shopNum: shopNum
  //   })
  // },
  // changesNum(e){
  //   let shopNum = e.detail.value;
  //   console.log(shopNum)
  //   this.setData({
  //     shopNum: shopNum
  //   })
  // },
  // minNum: function () { //商品数量的递减
  //   let shopNum = this.data.shopNum;
  //   console.log(this.data.shoplist)
  //   if (shopNum > 1) {
  //     shopNum--;
  //   }
  //   this.setData({
  //     shopNum: shopNum
  //   })
  // },
  // showModal: function () {
  //   // 显示遮罩层
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: "linear",
  //     delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //     animationData: animation.export(),
  //     showModalStatus: true
  //   })
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     this.setData({
  //       animationData: animation.export()
  //     })
  //   }.bind(this), 200)
  // },
  // //隐藏对话框
  // hideModal: function () {
  //   // 隐藏遮罩层
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: "linear",
  //     delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //     animationData: animation.export(),
  //   })
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     this.setData({
  //       animationData: animation.export(),
  //       showModalStatus: false
  //     })
  //   }.bind(this), 200)
  // },
  // catShowModal: function () {
  //   // 显示遮罩层
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: "linear",
  //     delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //     animationData: animation.export(),
  //     ModalStatus: true
  //   })
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     this.setData({
  //       animationData: animation.export()
  //     })
  //   }.bind(this), 200)
  // },
  // //隐藏对话框
  // catHideModal: function () {
  //   // 隐藏遮罩层
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: "linear",
  //     delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //     animationData: animation.export(),
  //   })
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     this.setData({
  //       animationData: animation.export(),
  //       ModalStatus: false
  //     })
  //   }.bind(this), 200)
  // },
  // 计算书籍总数
  getTotalNum() {
    let _this = this
    let shoplist = _this.data.shoplist;
    let total = 0;
    for (let i = 0; i < shoplist.length; i++) { // 循环列表得到每个数据
      total += shoplist[i].count
    }
    _this.setData({ // 最后赋值到data中渲染到页面
      count: total
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getData() {
    let _this = this
    api.GET(
      "/shopcart", {},
      res => {
        console.log
          (res.params)
        _this.setData({
          shoplist: res.params.cartitems,
        })
        this.getTotalNum() //成功后获取总数
      }
    )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData()
    // this.getTotalPrice()
    // this.setData({
    //   hasList: true,
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //重置数据
    this.setData({
      timer: null,
      count: 0,
      selectAllStatus: false,
      show: true,
      hasList: false, // 列表是否有数据
      totalPrice: 0, // 总价，初始为0
      shoplist: []
    })  
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
  onShareAppMessage: function() {

  }
})