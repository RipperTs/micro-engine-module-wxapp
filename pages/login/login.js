const App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let _this = this;
        _this.setData({
            options
        });
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
            url:'/pages/index/index'
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
            url:'/pages/member/member'
        })
    },

})
