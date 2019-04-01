const utils = require("./util.js");
const API_URL = utils.DOMAIN + '/api'

//GET请求  
function GET(url, params, requestHandler) {
  request('GET', url, params, requestHandler)
}
//POST请求  
function POST(url, params, requestHandler) {
  request('POST', url, params, requestHandler)
}
//PUT请求  
function PUT(url, params, requestHandler) {
  request('PUT', url, params, requestHandler)
}
//DELETE请求  
function DELETE(url, params, requestHandler) {
  request('DELETE', url, params, requestHandler)
}
/*
请求方法封装与拦截
  method:请求方式，一般为GET或POST
  url:请求路径，一般为去掉提取出来的域名剩下的路径
  requestHandler:请求参数后的处理方法
*/
function request(method, url, params, requestHandler) {
  //注意：可以对params加密等处理  
  var that = this;
  let token = wx.getStorageSync('token')
  wx.request({
    url: API_URL + url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    header: { token: token},
    success: function (res) {
      //注意：可以对参数解密等处理
      let code = res.statusCode
      if (code == 404 || code == 405 || code == 500) {
        utils.showModal("服务器发生错误");
        return
      }
      if (code == 200) {
        if (res.data.code == 17) {
          utils.showModal("后台网络出错，请稍后再试");
        } else if (res.data.code == 18&&token) {
          utils.showModal("登录失效，重新登录中", ()=>{
            login(request, [ method, url, params, requestHandler])
          });
        } else {
          requestHandler(res.data);
        }
      }
    }, fail(res) {
      console.log(res)
      utils.showModal("网络错误，请检测你的网络");
    },
    complete() {
      setTimeout(() => {
        wx.hideLoading();
      },1000) 
    }
  })
}

// 上传图片
function uploadImg(url, file, requestHandler) {
  console.log(file);
  wx.uploadFile({
    url: API_URL + url,
    filePath: file,
    name: 'file',
    header: { token: wx.getStorageSync('token') },
    formData: {},
    success: function (res) {
      // console.log(res);
      requestHandler(res.data)
    }
  })
}

function login(callback, callbackParams) {
  wx.login({
    success: function (res) {
      if (res.code) {
       let code = res.code
        POST("/token/mp", {code}, res => {
          console.log(res, 'login')
          if (res.code == 1) {
            wx.setStorageSync('token', res.params.token);
            callback(...callbackParams);
          }
        })
      }
    }
  })
}


module.exports = {
  GET,
  POST,
  PUT,
  DELETE,
  uploadImg,
  login
}