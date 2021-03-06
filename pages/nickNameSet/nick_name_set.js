import HttpRequestService from '../../utils/HttpRequestService.js'

Page({
  HttpRequestService: new HttpRequestService,

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nickName: wx.getStorageSync('userInfo').nickName
    })
  },

  /**
   * 更新用户昵称
   */
  updateNickName(event) {
    let nickName = event.detail;
    this.HttpRequestService.updateNickName(nickName, {
      success: (data, msg) => {
        let userInfo = wx.getStorageSync('userInfo')
        userInfo.nickName = nickName
        wx.setStorageSync("userInfo", userInfo)
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      },
      fail: (code, msg) => {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})