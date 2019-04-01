// pages/modify/modify.js
const app = getApp();
import api from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: "",
    orderNo: 0,
    middle: true,
    id: 0, //修改接口id
    index: "", //判断新建/修改接口
    schoolName: "", //学校名字
    schoolId: "", //学校id
    address: "", //地址
    show: true,
    gradeIndexs: 0, //年级下标
    classIndexs: 0, //班级下标
    className: "", //班级名
    gradeName: "", //年级名、
    allName: "",
    studentName: "",
    parentName: '',
    phoneNumber: "",
    studentStatus: true,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    smallGrade: [ //小学
    ],
    middleGrade: [ //初中
    ],
    alladdress: [], //存储地址
    showCancel: true,
    classes: ["一班", "二班", "三班", "四班", "五班", "六班", "七班", "八班", "九班", "十班"]
  },
  // 切换学校
  swtchschool() {
    let _this = this
    console.log(1)
    let studentStatus = !_this.data.studentStatus
    _this.setData({
      studentStatus: studentStatus
    })
  },
  // 跳转到搜索学校页
  searchSchool() {
    wx.navigateTo({
      url: '../searchSchool/searchSchool',
    })
  },

  //获取学生姓名
  studentName(e) {
    this.setData({
      studentName: e.detail.value,
    })
  },
  //获取家长姓名
  parentName(e) {
    this.setData({
      parentName: e.detail.value,
    })
    // console.log(this.data.classname)
  },
  //获取联系电话
  phoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value,
    })
  },
  //确定
  deter() {
    let that = this;
    if (!that.data.schoolName) {
      wx.showToast({
        title: '学校不能为空,请重填',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    if (!that.data.className) {
      wx.showToast({
        title: '班级不能为空,请重填',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    if (!that.data.studentName) {
      wx.showToast({
        title: '学生姓名不能为空,请重填',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    if (!that.data.parentName) {
      wx.showToast({
        title: '家长姓名不能为空,请重填',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.phoneNumber))) {
      wx.showToast({
        title: '手机号码有误,请重填',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false;
    }
    console.log(this.data.orderid)
    // 新建地址接口
    if (this.data.id == 0 && (!this.data.orderid)) {
      console.log(1)
      // console.log(that.data.gradeIndexs, that.data.classIndexs)
      // return;
      if (this.data.orderNo) {
        this.updateOrderNoAddress()
        return;
      }
      api.POST(
        "/common/address", {
          grade: that.data.gradeIndexs + 1,
          klass: that.data.classIndexs + 1,
          parentName: that.data.parentName,
          phone: that.data.phoneNumber,
          schoolId: that.data.schoolId,
          studentName: that.data.studentName,
          defaultAddress: true
        },
        res => {
          let that = this
          // let alladdress = that.data.alladdress
          if (res.code == 1) {
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })

            let pages = getCurrentPages()
            console.log(pages)
            let lastPage = ''
            if (pages.length >= 2) {
              lastPage = pages[pages.length - 2]
            }
            console.log(lastPage)
            if (lastPage.route.indexOf('addressInformation') != -1) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.redirectTo({
                url: '/pages/addressInformation/addressInformation'
              })
            }

          }
        }
      )
    } else if (that.data.orderid) {
      console.log(2)
      api.POST(
        "/common/address", {
          grade: that.data.gradeIndexs + 1,
          klass: that.data.classIndexs + 1,
          parentName: that.data.parentName,
          phone: that.data.phoneNumber,
          schoolId: that.data.schoolId,
          studentName: that.data.studentName,
          defaultAddress: true
        },
        res => {
          let that = this
          // let alladdress = that.data.alladdress
          if (res.code == 1) {
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })

            // let pages = getCurrentPages()
            // console.log(pages)
            // let lastPage = ''
            // if (pages.length >= 2) {
            //   lastPage = pages[pages.length - 2]
            // }
            // console.log(lastPage)
            wx.navigateBack({
              delta: 1
            })

          }
        }
      )
    } else {
      console.log(3)
      let that = this
      let id = that.data.id
      api.PUT(
        "/common/address/" + id, {
          grade: that.data.gradeIndexs + 1,
          klass: that.data.classIndexs + 1,
          parentName: that.data.parentName,
          phone: that.data.phoneNumber,
          schoolId: that.data.schoolId,
          studentName: that.data.studentName
        },
        res => {

          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          //成功跳转回去，清空value值
          wx.setStorageSync('schoolName', "")
          wx.getStorageSync('schoolId', "")
          wx.getStorageSync('address', "")
          wx.navigateBack({
            delta: 1
          })
        }
      )
    }
  },
  // 修改订单的地址
  updateOrderNoAddress() {
    api.POST(
      "/order/" + this.data.orderNo + "/updateAddress", {
        grade: this.data.gradeIndexs + 1,
        klass: this.data.classIndexs + 1,
        parentName: this.data.parentName,
        phone: this.data.phoneNumber,
        schoolId: this.data.schoolId,
        studentName: this.data.studentName
      },
      res => {
        wx.showToast({
          title: '修改成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        wx.navigateBack({
          delta: 1
        })
      }
    )
  },
  // 显示遮罩层
  showModal: function() {
    var that = this;
    let id = that.data.schoolId
    let schoolName = that.data.schoolName
    console.log(this.data.gradeIndexs, this.data.classIndexs);
    if (schoolName) {
      that.setData({
        hideModal: false
      })
      var animation = wx.createAnimation({
        duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
        delay: 0,
      })
      this.animation = animation
      setTimeout(function() {
        that.fadeIn(); //调用显示动画
      }, 200)
    } else {
      wx.showModal({
        title: '提示',
        content: '您还没选择学校',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../searchSchool/searchSchool',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    let gradeIndexs = that.data.gradeIndexs
    let classIndexs = that.data.classIndexs
    let schoolName = that.data.schoolName
    if (schoolName) {
      // 小学年级班级
      if (that.data.studentStatus) {
        let className = that.data.smallGrade[gradeIndexs].maxClass[classIndexs]
        let gradeNames = that.data.smallGrade[gradeIndexs].grade
        let gradeName = gradeNames.replace("级", "");
        if (!that.data.classIndexs) {
          that.setData({
            className: className,
          })
        }
        if (!that.data.gradendexs) {
          that.setData({
            gradeName: gradeName,
          })
        }
        that.setData({
          allName: that.data.gradeName + that.data.className
        })
      }
      //初中年级班级
      if (!that.data.studentStatus) {
        let className = that.data.middleGrade[gradeIndexs-6].maxClass[classIndexs]
        let gradeNames = that.data.middleGrade[gradeIndexs-6].grade
        let gradeName = gradeNames.replace("级", "");
        if (!that.data.classIndexs) {
          that.setData({
            className: className,
          })
        }
        if (!that.data.gradendexs) {
          that.setData({
            gradeName: gradeName,
          })
        }
        that.setData({
          allName: that.data.gradeName + that.data.className
        })
      }
    }
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear

    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 600) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function() {
    this.animation.translateY(815).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  // 选择年级 切换班级 小学
  swichClass(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let gradeName = e.currentTarget.dataset.name
    _this.setData({
      gradeName: gradeName,
      gradeIndexs: index,
      classIndexs: 0
    })
  },
  // 选择班级 小学
  selectionClass(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let className = e.currentTarget.dataset.name
    _this.setData({
      className: className,
      classIndexs: index
    })
  },
  // 选择年级 切换班级 初中
  swichMClass(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let gradeName = e.currentTarget.dataset.name
    console.log(gradeName)
    _this.setData({
      gradeName: gradeName,
      gradeIndexs: index + 6,
      classIndexs: 0
    })
  },
  // 选择班级 初中
  selectionMClass(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let className = e.currentTarget.dataset.name
    console.log(className)
    _this.setData({
      className: className,
      classIndexs: index
    })
  },
  getPhoneNumber: function(e) {
    var that = this;
    var info = this.data.phoneNumber;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
      api.POST("/user/mobile", params, res => {
        if (res.code == 1) {
          this.setData({
            phoneNumber: res.params.mobile
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    console.log(options)
    if (options.orderid) {
      let orderid = options.orderid
      this.setData({
        orderid: orderid
      })
    }
    let id = options.id || 0;
    let schoolId = options.schoolId || 0;
    let orderNo = options.orderNo || 0
    this.setData({
      id: id,
      schoolId: schoolId,
      orderNo: orderNo
    })
    if (id != 0) {
      console.log(id)
      api.GET(
        "/common/address/" + id, {},
        res => {
          if (res.code == 1) {
            let address = res.params.address
            console.log(res.params.address);
            let allName = address.klass
            let gradeName = allName.slice(0, 2);
            let className = allName.slice(2, allName.length);
            let gradeIndexs = 0;
            let studentStatus = true;
            switch (gradeName) {
              case "一年":
                gradeIndexs = 0;
                break;
              case "二年":
                gradeIndexs = 1;
                break;
              case "三年":
                gradeIndexs = 2;
                break;
              case "四年":
                gradeIndexs = 3;
                break;
              case "五年":
                gradeIndexs = 4;
                break;
              case "六年":
                gradeIndexs = 5;
                break;
              case "初一":
                gradeIndexs = 6;
                studentStatus = false;
                break;
              case "初二":
                gradeIndexs = 7;
                studentStatus = false;
                break;
              case "初三":
                gradeIndexs = 8;
                studentStatus = false;
                break;
            }
            let classIndexs = 0;
            switch (className) {
              case "一班":
                classIndexs = 0;
                break;
              case "二班":
                classIndexs = 1;
                break;
              case "三班":
                classIndexs = 2;
                break;
              case "四班":
                classIndexs = 3;
                break;
              case "五班":
                classIndexs = 4;
                break;
              case "六班":
                classIndexs = 5;
                break;
              case "七班":
                classIndexs = 6;
                break;
              case "八班":
                classIndexs = 7;
                break;
              case "九班":
                classIndexs = 8;
                break;
              case "十班":
                classIndexs = 9;
                break;
            }
            console.log(address.schoolVo.name)
            _this.setData({
              allName: address.klass,
              className: className,
              gradeName: gradeName,
              classIndexs: classIndexs,
              gradeIndexs: gradeIndexs,
              studentStatus: studentStatus,
              parentName: address.parentName,
              studentName: address.studentName,
              phoneNumber: address.phone,
              schoolId: address.schoolId,
              schoolName: address.schoolVo.name,
            })
          }
        }
      )
      // this.getAdress();
    }
    // let index = options.index
    // let userid = options.userid
    // if (wx.getStorageSync('alladdress')) {
    //   let alladdress = JSON.parse(wx.getStorageSync('alladdress'))
    //   console.log(alladdress[index].schoolName)
    //   this.setData({
    //     index: index,
    //     userid: userid,
    //     allName: alladdress[index].allName,
    //     parentName: alladdress[index].parentName,
    //     studentName: alladdress[index].studentName,
    //     phoneNumber: alladdress[index].phone
    //   })
    //   wx.setStorageSync('schoolName', alladdress[index].schoolName)
    //   wx.setStorageSync('schoolId', alladdress[index].schoolId)
    //   wx.setStorageSync('address', alladdress[index].address)
    // }

    console.log(_this.data.schoolName)
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
    //判断选择学校值是否为空，true隐藏学校
    if (this.data.schoolId) {
      api.GET(
        "/common/school/" + this.data.schoolId, {},
        res => {
          if (res.msg) {
            let grades = res.params.school.grades
            // let length = grades.length
            // console.log(length)
 
            let smallGrade = [];
            let middleGrade = [];
            for (var i = 0; i < grades.length; i++) {
              let maxClass = this.data.classes.slice(0, grades[i].maxClass)
              let grade = ""
              switch (grades[i].grade) {
                case 1: grade = "一年级"; break;
                case 2: grade = "二年级"; break;
                case 3: grade = "三年级"; break;
                case 4: grade = "四年级"; break;
                case 5: grade = "五年级"; break;
                case 6: grade = "六年级"; break;
                case 7: grade = "初一"; break;
                case 8: grade = "初二"; break;
                case 9: grade = "初三"; break;
              }
              let gradeItem = {
                grade,
                maxClass
              }
              if (grades[i].grade<=6){
                smallGrade.push(gradeItem)
              }else {
                middleGrade.push(gradeItem)
              }
            }
            let className = "一班"
            let classIndexs = 0
            let gradeName = "一年"
            let gradeIndexs = 0
            let studentStatus = true
            if(smallGrade.length == 0){
              gradeName = "初一"
              gradeIndexs = 6
              studentStatus = false
            }
            if (middleGrade.length == 0) {
              gradeName = "一年"
              gradeIndexs = 0
            }
            console.log(smallGrade,middleGrade)
            this.setData({
              smallGrade: smallGrade,
              middleGrade: middleGrade,
              allName: gradeName + className ,
              gradeIndexs: gradeIndexs,
              gradeName: gradeName,
              classIndexs: classIndexs,
              className: className,
              studentStatus: studentStatus
            })
          }
        }
      )
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
    let that = this
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