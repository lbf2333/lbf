function formatTime(date){
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n){
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取地理位置授权
function getUserLocation(fn) {
  wx.getSetting({
    success(res) {
      console.log(String(res.authSetting['scope.userLocation']))
      if (String(res.authSetting['scope.userLocation']) === 'undefined') { //如果没有授权
        wx.authorize({
          scope: 'scope.userLocation',
          success: res => { //用户同意授权
            fn();
          }
        })
      } else if (String(res.authSetting['scope.userLocation']) === 'false') {
        wx.showModal({
          title: '授权位置权限',
          content: '使用此功能需要授权地理位置权限，是否去设置打开授权',
          confirmText: "确认",
          cancelText: "取消",
          success: function (res) {
            console.log(res);
            //点击“确认”时打开设置页面
            if (res.confirm) {
              console.log('用户点击确认')
              wx.openSetting({
                success: (res) => {
                  fn()
                }
              })
            } else {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        fn()
      }
    }
  })
}

// 普通弹窗 
function showModal(title, handle = function(){}, color = "#c00") {
  wx.showModal({
    title: '提示',
    content: title,
    confirmColor: color,
    showCancel: false,
    success: res => {
      handle(res);
    }
  })
}

// 域名
// const DOMAIN = 'http://192.168.2.202:8080'
const DOMAIN = 'https://hljhouse.jizui.top/magazine'

// 同域名图片地址
const DOMAIN_IMG = DOMAIN + '/images'

// 阿里云图片地址
const ALY_IMG = 'https://heysenior.oss-cn-shenzhen.aliyuncs.com/' + 'images'

module.exports = {
  formatTime,
  getUserLocation,
  showModal,
  DOMAIN,
  DOMAIN_IMG,
  ALY_IMG
}
