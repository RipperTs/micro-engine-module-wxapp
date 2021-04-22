const App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: {},
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let _this = this;
        _this.setData({
            options
        });
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },

    // 新版授权登陆
    getUserProfile() {
        let _this = this,
            loginInfo = {detail: {}};
        wx.getUserProfile({
            desc: '获取您的基础信息用户登陆和注册', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                loginInfo.detail = res;
                _this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                App.getUserInfo(loginInfo, () => {
                    // 跳转回原页面
                    _this.onNavigateBack(1);
                });
            }
        })
    },

    /**
     * 授权登录
     */
    getUserInfo(e) {
        let _this = this;
        App.getUserInfo(e, () => {
            // 跳转回原页面
            _this.onNavigateBack(1);
        });
    },

    /**
     * 暂不登录
     */
    onNotLogin() {
        let _this = this;
        // 跳转回原页面
        // _this.onNavigateBack(_this.data.options.delta);
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    /**
     * 授权成功 跳转回原页面
     */
    onNavigateBack(delta) {
        // wx.navigateBack({
        //     delta: Number(delta || 1)
        // });
        wx.switchTab({
            url: '/pages/member/member'
        })
    },

})
