import HttpRequestService from '../../utils/HttpRequestService.js'

Page({
    HttpRequestService: new HttpRequestService,
    data: {
        remind: '加载中',
        angle: 0,
        userInfo: null
    },

    /**
     * 跳转至主页
     */
    startCook: function() {
        if (!getApp().globalData.token) {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    this.HttpRequestService.code2Session(res.code, {
                        success: (data, msg) => {
                            if (data.token) {
                                getApp().globalData.token = data.token
                            }
                            getApp().globalData.openId = data.openId
                            wx.switchTab({
                                url: '/pages/index/index',
                            });
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
        } else {
            wx.switchTab({
                url: '/pages/index/index',
            });
        }
    },

    /**
     * 获取微信信息
     */
    bindGetUserInfo: function(e) {
        if (!e.detail.userInfo) {
            return;
        }
        wx.setStorageSync('wxUserInfo', e.detail.userInfo)
        this.HttpRequestService.updateWxUserInfo(e.detail.userInfo, {
            success: (data, msg) => {
                getApp().globalData.token = data
            },
            fail: (code, msg) => {
                wx.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        this.setData({
            userInfo: e.detail.userInfo
        })
    },

    onReady: function() {
        var that = this;
        setTimeout(function() {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function(res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) {
                angle = 14;
            } else if (angle < -14) {
                angle = -14;
            }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    },

    onShow: function() {
        let that = this
        let userInfo = wx.getStorageSync('wxUserInfo')
        if (userInfo) {
            that.setData({
                userInfo: userInfo
            })
        }
    },
});