// pages/addIformation/addIformation.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:"",
    defaultAddress:false,
    list:[
     
    ],
    id:"",
  },
  //修改地址
  modify(e){
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: "../modify/modify?id=" + id + "&schoolId=" + this.data.list[index].schoolId
    })
  },
  // 跳转增加地址
  increase(){
    if (this.data.orderid) {
      wx.redirectTo({
        url: "../modify/modify?orderid=" + this.data.orderid
      })
    }else{
      wx.navigateTo({
        url: "../modify/modify"
      })
    }
  },
  //删除地址
  deletes(e){
   let _this=this;
    let id = e.currentTarget.dataset.id
    console.log(id)
    let newlist = _this.data.list.splice(e.currentTarget.dataset.index,1)
    _this.setData({
      list: _this.data.list
    })
    // let addressStres = JSON.stringify(_this.data.list)
    // let addressStr = addressStres.replace(/\ +/g, "").replace(/[\r\n]/g, "")
    // wx.setStorageSync('alladdress', addressStr)
    
    api.DELETE(
      "/common/address/"+id, {
      },
      res => {
        if (res.code == 1) {
          _this.address()
        }
      }
    )
  },
  //使用地址
  use(e){
    let _this = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let list = _this.data.list
    console.log(list)
    if (_this.data.orderid){
      api.POST(
        "/common/address/" + id + "/default", {
        },
        res => {
          if (res.code == 1) {
            console.log(res)
            for (let i = 0; i < list.length; i++) {
              list[i].defaultAddress = false
              list[index].defaultAddress = true
            }
            this.setData({
              list: list
            })
          }
          //成功返回订单页
          wx.navigateBack({
          })
        }
      )
    }else{
      api.POST(
        "/common/address/" + id + "/default", {
        },
        res => {
          if (res.code == 1) {
            console.log(res)
            for (let i = 0; i < list.length; i++) {
              list[i].defaultAddress = false
              list[index].defaultAddress = true
            }
            this.setData({
              list: list
            })
          }
        }
      )
    }
    // list.unshift(_this.data.list[index])
    // list.splice(index+1,1)
    // _this.setData({
    //   list:list
    // })
    // let addressStres = JSON.stringify(_this.data.list)
    // let addressStr = addressStres.replace(/\ +/g, "").replace(/[\r\n]/g, "")
    // wx.setStorageSync('alladdress', addressStr)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.orderid) {
      let orderid = options.orderid
      this.setData({
        orderid: orderid
      })
    }
    // if (wx.getStorageSync("alladdress")) {
    //   let alladdress = JSON.parse(wx.getStorageSync("alladdress"))
    //   console.log(alladdress)
    //   this.setData({
    //     list: alladdress
    //   })
    // }
    // let id="133"
    // api.POST(
    //   "/common/address/" + id +"/default", {
    //   },
    //   res => {
    //     console.log(res)
    //     if (res.code == 1) {
    //     }
    //   }
    // )
    // wx.setStorageSync("alladdress","")
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this
    console.log(_this.data.list)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  address(){
    api.GET(
      "/common/address", {
      },
      res => {
        let address = res.params.address
        // console.log(typeof this.data.defaultAddress)
        // for(let i=0;i<address.length;i++){
        //   if (address[i].defaultAddress){
        //     this.setData({
        //       defaultAddress: address[i].defaultAddress
        //     })
        //   } 
        // }
        if (res.code == 1) {
          this.setData({
            list: res.params.address
          })
        } else if (res.code == 4) {
          wx.redirectTo({
            url: '../addressManagement/addressManagement',
          })
        }
      }
    )
  },
  onShow: function () {
   
    this.address()
    
    // api.GET(
    //   "/common/address", {
    //   },
    //   res => {
    //     let address = res.params.address
    //     // console.log(typeof this.data.defaultAddress)
    //     // for(let i=0;i<address.length;i++){
    //     //   if (address[i].defaultAddress){
    //     //     this.setData({
    //     //       defaultAddress: address[i].defaultAddress
    //     //     })
    //     //   } 
    //     // }
    //     if(res.code == 1) {
    //       this.setData({
    //         list: res.params.address
    //       })
    //     }else if(res.code == 4) {
    //       wx.navigateTo({
    //         url: '../addressManagement/addressManagement',
    //       })
    //     }
    //   }
    // )
    // console.log(wx.getStorageSync("alladdress"),12321);
    //重新加载地址数据

    //   console.log(this.data.list.length)
    // }
    // if (this.data.list.length == 0) {
    //   // 判断地址是否为空
    //   wx.navigateTo({
    //     url: '../addressManagement/addressManagement',
    //   })
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