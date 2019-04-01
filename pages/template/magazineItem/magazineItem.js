// pages/template/magazineItem/magazineItem.js
let magazineItemJS = {
  toDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+ id,
    })
  }
}
export default magazineItemJS;